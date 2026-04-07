import { discoverArtifacts, type ArtifactType, type ArtifactFile } from "./manifest";
import { QdrantClient } from "@qdrant/js-client-rest";

interface ToolCallEvent {
  name: string;
  args_summary: string;
  status: "pending" | "running" | "completed" | "failed";
}

interface TestResult {
  artifact_type: ArtifactType;
  artifact_path: string;
  artifact_name: string;
  agent_id: string | null;
  trial_number: number;
  prompt_index: number | null;      // which prompt from the pool was used (null for non-agent tests)
  prompt_text: string | null;       // the actual prompt sent (null for non-agent tests)
  tool_call_sequence: string[];
  tool_call_details: ToolCallEvent[];
  response_text: string | null;     // final assistant response text (null if not captured)
  // For node-library: whether sequence matches enforcement spec
  enforcement_expected: string[] | null;
  enforcement_match: boolean | null;
  // For agents: behavioral description for analysis
  success_description: string | null;
  duration_ms: number;
  timestamp: string;
  raw_events_count: number;
}

const OPENCODE_SERVER_URL = "http://localhost:4096";
const QDRANT_URL = "http://localhost:6333";
const QDRANT_COLLECTION = "prompt-engineering-test-harness";
const EVENT_TIMEOUT_MS = 120000; // 2 min per trial — local model is slow
const TRIALS_PER_ARTIFACT = 3;

interface ParsedArgs {
  artifactType: ArtifactType;
  // Specific prompt indices to use across trials (e.g. [0, 2, 3]).
  // If not provided, indices are chosen randomly from the pool.
  promptIndices: number[] | null;
  // Optional: run only a single named agent (by agentId) instead of all
  agentFilter: string | null;
  // Number of trials to run per artifact (default: TRIALS_PER_ARTIFACT)
  trials: number;
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);

  const typeArg = args.find((arg) => arg.startsWith("--type="));
  if (!typeArg) {
    console.error("Usage: bun run test/runner.ts --type=<agents|node-library|catalogue> [--prompt-indices=0,1,2] [--agent=<agentId>] [--trials=N]");
    process.exit(1);
  }

  const type = typeArg.split("=")[1] as ArtifactType;
  const validTypes: ArtifactType[] = ["agents", "node-library", "catalogue"];
  if (!validTypes.includes(type)) {
    console.error(`Invalid type: ${type}. Must be one of: ${validTypes.join(", ")}`);
    process.exit(1);
  }

  const trialsArg = args.find((arg) => arg.startsWith("--trials="));
  const trials = trialsArg ? parseInt(trialsArg.split("=")[1], 10) : TRIALS_PER_ARTIFACT;
  if (isNaN(trials) || trials < 1) {
    console.error("--trials must be a positive integer");
    process.exit(1);
  }

  const indicesArg = args.find((arg) => arg.startsWith("--prompt-indices="));
  let promptIndices: number[] | null = null;
  if (indicesArg) {
    promptIndices = indicesArg.split("=")[1].split(",").map((s) => parseInt(s.trim(), 10));
    if (promptIndices.some(isNaN)) {
      console.error("--prompt-indices must be comma-separated integers, e.g. --prompt-indices=0,1,3");
      process.exit(1);
    }
    if (promptIndices.length !== trials) {
      console.error(`--prompt-indices must have exactly ${trials} value(s) (one per trial)`);
      process.exit(1);
    }
  }

  const agentArg = args.find((arg) => arg.startsWith("--agent="));
  const agentFilter = agentArg ? agentArg.split("=")[1] : null;

  return { artifactType: type, promptIndices, agentFilter, trials };
}

/**
 * Select 3 prompt indices from the pool for the 3 trials.
 * If explicit indices are provided, use them.
 * Otherwise, pick 3 distinct random indices (or repeat if pool is smaller than 3).
 */
function selectPromptIndices(pool: string[], explicit: number[] | null, count: number = TRIALS_PER_ARTIFACT): number[] {
  if (explicit) {
    // Clamp to valid range
    return explicit.map((i) => Math.min(i, pool.length - 1));
  }

  if (pool.length === 0) return Array(count).fill(0);

  if (pool.length <= count) {
    // Cycle through all available, then repeat from start
    const indices: number[] = [];
    for (let i = 0; i < count; i++) {
      indices.push(i % pool.length);
    }
    return indices;
  }

  // Pick `count` distinct random indices
  const available = Array.from({ length: pool.length }, (_, i) => i);
  const selected: number[] = [];
  for (let i = 0; i < count; i++) {
    const randPos = Math.floor(Math.random() * available.length);
    selected.push(available[randPos]);
    available.splice(randPos, 1);
  }
  return selected;
}

function parseToolCallsFromEvents(events: Record<string, unknown>[]): {
  sequence: string[];
  details: ToolCallEvent[];
} {
  const sequence: string[] = [];
  const details: ToolCallEvent[] = [];
  const toolStates = new Map<string, ToolCallEvent>();

  for (const event of events) {
    try {
      if (event.type !== "message.part.updated") continue;

      const properties = event.properties as Record<string, unknown> | undefined;
      if (!properties) continue;

      const part = properties.part as Record<string, unknown> | undefined;
      if (!part || part.type !== "tool") continue;

      const toolName = (part.tool as string) || "unknown";
      const state = part.state as Record<string, unknown> | undefined;
      const stateStatus = state?.status as string | undefined;

      let status: ToolCallEvent["status"] = "pending";
      if (stateStatus === "running") status = "running";
      else if (stateStatus === "completed") status = "completed";
      else if (stateStatus === "error" || stateStatus === "failed") status = "failed";

      if (!toolStates.has(toolName)) {
        const argsRaw = state?.input ?? {};
        const detail: ToolCallEvent = {
          name: toolName,
          args_summary: JSON.stringify(argsRaw).substring(0, 100),
          status,
        };
        toolStates.set(toolName, detail);
        sequence.push(toolName);
      } else {
        const existing = toolStates.get(toolName)!;
        if (status === "completed" || status === "failed") {
          existing.status = status;
        } else if (status === "running" && existing.status === "pending") {
          existing.status = status;
        }
      }
    } catch {
      // skip unparseable events
    }
  }

  for (const toolName of sequence) {
    if (toolStates.has(toolName)) {
      details.push(toolStates.get(toolName)!);
    }
  }

  return { sequence, details };
}

async function collectSessionEvents(
  sessionId: string,
  timeoutMs: number
): Promise<Record<string, unknown>[]> {
  const events: Record<string, unknown>[] = [];
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${OPENCODE_SERVER_URL}/event`, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      clearTimeout(timeout);
      return events;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.substring(6).trim();
        if (!jsonStr || jsonStr === "[DONE]") continue;

        try {
          const data = JSON.parse(jsonStr) as Record<string, unknown>;
          const properties = data.properties as Record<string, unknown> | undefined;
          const eventSessionId = properties?.sessionID as string | undefined;

          if (eventSessionId && eventSessionId !== sessionId) continue;

          events.push(data);

          if (data.type === "session.status") {
            const status = properties?.status as Record<string, unknown> | undefined;
            if (status?.type === "idle") {
              clearTimeout(timeout);
              controller.abort();
              return events;
            }
          }
        } catch {
          // skip unparseable events
        }
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      console.error("SSE stream error:", err.message);
    }
  }

  clearTimeout(timeout);
  return events;
}

/**
 * Fetch the final assistant response text from a completed session.
 * Calls GET /session/{id}/message and extracts text parts from the last assistant message.
 */
async function fetchResponseText(sessionId: string): Promise<string | null> {
  try {
    const res = await fetch(`${OPENCODE_SERVER_URL}/session/${sessionId}/message`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const messages = await res.json() as Array<{
      info: { role: string; id: string };
      parts: Array<{ type: string; text?: string }>;
    }>;

    if (!Array.isArray(messages) || messages.length === 0) return null;

    // Find the last assistant message
    const assistantMessages = messages.filter((m) => m.info?.role === "assistant");
    if (assistantMessages.length === 0) return null;

    const lastAssistant = assistantMessages[assistantMessages.length - 1];

    // Concatenate all text parts
    const textParts = (lastAssistant.parts ?? [])
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text as string);

    if (textParts.length === 0) return null;

    return textParts.join("\n").trim();
  } catch {
    return null;
  }
}

async function runTrial(
  artifact: ArtifactFile,
  trialNumber: number,
  promptIndex: number | null
): Promise<TestResult> {
  const startTime = Date.now();
  const isAgentTest = artifact.type === "agents";

  try {
    // Create session (no agentID here — agent is set on the prompt call)
    const sessionResponse = await fetch(`${OPENCODE_SERVER_URL}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!sessionResponse.ok) {
      throw new Error(`Failed to create session: ${sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json() as Record<string, unknown>;
    const sessionId = sessionData.id as string;

    // Start collecting SSE events before sending the message
    const eventsPromise = collectSessionEvents(sessionId, EVENT_TIMEOUT_MS);
    await new Promise((r) => setTimeout(r, 200));

    // Build the prompt
    let prompt: string;
    let actualPromptIndex: number | null = null;
    let promptText: string | null = null;

    if (isAgentTest && artifact.prompts && artifact.prompts.length > 0) {
      // Agent test: select from prompt pool
      const idx = promptIndex !== null ? Math.min(promptIndex, artifact.prompts.length - 1) : 0;
      actualPromptIndex = idx;
      prompt = artifact.prompts[idx];
      promptText = prompt;
    } else if (!isAgentTest) {
      // Node-library/catalogue: send the content with a generic instruction
      prompt = `You are being tested. The following is a prompt you will receive during execution. Read it and perform the actions it describes. Begin immediately.\n\n${artifact.content}`;
    } else {
      throw new Error(`Agent artifact ${artifact.name} has no prompts defined`);
    }

    // Set agent on the prompt call — this is where the API expects it
    const promptBody: Record<string, unknown> = {
      parts: [{ type: "text", text: prompt }],
    };
    if (isAgentTest && artifact.agentId) {
      promptBody.agent = artifact.agentId;
    }

    await fetch(`${OPENCODE_SERVER_URL}/session/${sessionId}/prompt_async`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptBody),
    });

    const events = await eventsPromise;
    const { sequence, details } = parseToolCallsFromEvents(events);

    // Fetch final response text
    const responseText = await fetchResponseText(sessionId);

    // Enforcement match only applies to node-library
    let enforcementMatch: boolean | null = null;
    if (artifact.enforcementArray && artifact.enforcementArray.length > 0) {
      enforcementMatch = JSON.stringify(sequence) === JSON.stringify(artifact.enforcementArray);
    }

    return {
      artifact_type: artifact.type,
      artifact_path: artifact.path,
      artifact_name: artifact.name,
      agent_id: artifact.agentId ?? null,
      trial_number: trialNumber,
      prompt_index: actualPromptIndex,
      prompt_text: promptText,
      tool_call_sequence: sequence,
      tool_call_details: details,
      response_text: responseText,
      enforcement_expected: artifact.enforcementArray ?? null,
      enforcement_match: enforcementMatch,
      success_description: artifact.successDescription ?? null,
      duration_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      raw_events_count: events.length,
    };
  } catch (error) {
    console.error(`Error in trial ${trialNumber} for ${artifact.name}:`, error);
    return {
      artifact_type: artifact.type,
      artifact_path: artifact.path,
      artifact_name: artifact.name,
      agent_id: artifact.agentId ?? null,
      trial_number: trialNumber,
      prompt_index: promptIndex,
      prompt_text: null,
      tool_call_sequence: [],
      tool_call_details: [],
      response_text: null,
      enforcement_expected: artifact.enforcementArray ?? null,
      enforcement_match: null,
      success_description: artifact.successDescription ?? null,
      duration_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      raw_events_count: 0,
    };
  }
}

async function storeResult(qdrant: QdrantClient, result: TestResult): Promise<void> {
  try {
    const zeroVector = new Array(384).fill(0) as number[];
    await qdrant.upsert(QDRANT_COLLECTION, {
      points: [{
        id: crypto.randomUUID(),
        vector: { "fast-all-minilm-l6-v2": zeroVector },
        payload: result as unknown as Record<string, unknown>,
      }],
    });
  } catch (error) {
    console.error("Error storing result to Qdrant:", error);
  }
}

async function verifyServer(): Promise<void> {
  try {
    const res = await fetch(`${OPENCODE_SERVER_URL}/session`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok && res.status !== 405) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    console.log("✅ OpenCode server reachable");
  } catch (err) {
    throw new Error(
      `OpenCode server not reachable at ${OPENCODE_SERVER_URL}. Run: bun run test:setup first\n${err}`
    );
  }
}

async function main() {
  const { artifactType, promptIndices, agentFilter, trials } = parseArgs();

  await verifyServer();

  console.log(`\n🚀 Starting test runner for type: ${artifactType}`);
  console.log(`📍 OpenCode server: ${OPENCODE_SERVER_URL}`);
  console.log(`📍 Qdrant: ${QDRANT_URL} / ${QDRANT_COLLECTION}`);
  if (promptIndices) {
    console.log(`📍 Prompt indices: ${promptIndices.join(", ")} (explicit)`);
  } else {
    console.log(`📍 Prompt indices: random selection per agent`);
  }
  if (agentFilter) {
    console.log(`📍 Agent filter: ${agentFilter}`);
  }
  console.log("");

  const qdrant = new QdrantClient({ url: QDRANT_URL });

  console.log(`🔍 Discovering ${artifactType} artifacts...`);
  let artifacts = await discoverArtifacts(artifactType);

  if (agentFilter && artifactType === "agents") {
    artifacts = artifacts.filter((a) => a.agentId === agentFilter);
    if (artifacts.length === 0) {
      console.error(`No agent found with id: ${agentFilter}`);
      process.exit(1);
    }
  }

  console.log(`✅ Found ${artifacts.length} artifacts\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const artifact of artifacts) {
    const label = artifact.agentId ? `${artifact.name} (agentID: ${artifact.agentId})` : artifact.name;
    console.log(`📦 Testing ${label}...`);

    // Determine which prompt indices to use for this artifact's trials
    const selectedIndices = artifact.prompts
      ? selectPromptIndices(artifact.prompts, promptIndices, trials)
      : Array(trials).fill(null);

    if (artifact.prompts) {
      console.log(`   Prompt pool size: ${artifact.prompts.length}, using indices: ${selectedIndices.join(", ")}`);
    }

    for (let trial = 1; trial <= trials; trial++) {
      const promptIndex = selectedIndices[trial - 1] ?? null;
      try {
        console.log(`  Trial ${trial}/${TRIALS_PER_ARTIFACT} (prompt index: ${promptIndex ?? "n/a"})...`);
        const result = await runTrial(artifact, trial, promptIndex);
        await storeResult(qdrant, result);

        const toolCount = result.tool_call_sequence.length;
        const matchStatus = result.enforcement_match === null
          ? ""
          : result.enforcement_match
            ? " ✓ enforcement match"
            : " ✗ enforcement mismatch";
        const responsePreview = result.response_text
          ? ` | response: "${result.response_text.substring(0, 60).replace(/\n/g, " ")}..."`
          : "";

        console.log(`    ✅ Done (${toolCount} tools called${matchStatus}${responsePreview})`);
        successCount++;
      } catch (error) {
        console.error(`    ❌ Failed:`, error);
        failureCount++;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("");
  }

  console.log("\n📊 Test Summary");
  console.log(`   Total trials: ${successCount + failureCount}`);
  console.log(`   ✅ Passed: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  const total = successCount + failureCount;
  console.log(`   Success rate: ${total > 0 ? ((successCount / total) * 100).toFixed(1) : "0.0"}%\n`);

  process.exit(failureCount > 0 ? 1 : 0);
}

main().catch(console.error);
