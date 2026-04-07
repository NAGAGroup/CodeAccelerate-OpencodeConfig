import { discoverArtifacts, type ArtifactType, type ArtifactFile } from "./manifest";
import { QdrantClient } from "@qdrant/js-client-rest";

interface ToolCallEvent {
  name: string;
  // Key parameter extracted per tool type (e.g. skill name, file path, query text)
  args_summary: string;
  status: "pending" | "running" | "completed" | "failed";
  // Unique invocation ID from the event — allows tracking repeated calls to the same tool
  invocation_id: string;
}

/**
 * Extract the most meaningful parameter from a tool call's input for evaluation.
 * Generic heuristic: prefer well-known primary-intent keys, then fall back to
 * the longest string value in the input. Works for any tool without hardcoding names.
 */
function extractArgsSummary(_toolName: string, input: unknown): string {
  if (!input || typeof input !== "object") return "";
  const args = input as Record<string, unknown>;

  // Ordered list of keys that typically carry the primary intent of a tool call.
  // First match wins.
  const preferredKeys = [
    "name",       // skill name, agent name
    "query",      // search queries, qdrant queries
    "command",    // shell commands
    "symbol",     // trace targets
    "filePath",   // file operations
    "path",       // file operations (alternate key)
    "thought",    // sequential thinking
    "information",// qdrant store content
    "description",// task descriptions
    "text",       // text content
  ];

  for (const key of preferredKeys) {
    const val = args[key];
    if (val && typeof val === "string" && val.trim().length > 0) {
      return val.substring(0, 120);
    }
  }

  // Fallback: pick the longest string value among all top-level keys
  let longest = "";
  for (const val of Object.values(args)) {
    if (typeof val === "string" && val.length > longest.length) {
      longest = val;
    }
  }
  if (longest) return longest.substring(0, 120);

  // Last resort: compact JSON
  return JSON.stringify(args).substring(0, 120);
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

// Project directory the server runs in — reset git state between agent trials
// to prevent file changes from one trial bleeding into the next.
const PROJECT_DIR = process.env.OPENCODE_PROJECT_DIR ?? process.cwd();

/**
 * Reset the project directory to a clean git state between trials.
 * Discards all uncommitted changes and removes untracked files.
 * Only called for agent tests where the agent may modify files.
 */
async function resetProjectDir(): Promise<void> {
  try {
    // Stash any changes (tracked + untracked) so they're recoverable, not just nuked
    const stash = Bun.spawnSync(["git", "stash", "--include-untracked", "-m", "test-runner-reset"], { cwd: PROJECT_DIR });
    if (stash.exitCode !== 0) {
      console.warn(`  ⚠️  git stash in ${PROJECT_DIR} exited with non-zero code`);
    } else {
      console.log(`  🔄 Stashed changes in ${PROJECT_DIR} (recoverable with git stash pop)`);
    }
  } catch (err) {
    console.warn(`  ⚠️  Could not stash project dir: ${err}`);
  }
}

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
  // Track by invocation ID (part.id) so repeated calls to the same tool
  // are recorded as separate entries rather than collapsed into one.
  const invocationOrder: string[] = []; // ordered list of invocation IDs
  const invocationMap = new Map<string, ToolCallEvent>(); // id → event

  for (const event of events) {
    try {
      if (event.type !== "message.part.updated") continue;

      const properties = event.properties as Record<string, unknown> | undefined;
      if (!properties) continue;

      const part = properties.part as Record<string, unknown> | undefined;
      if (!part || part.type !== "tool") continue;

      const toolName = (part.tool as string) || "unknown";
      const invocationId = (part.id as string) || `${toolName}-${invocationOrder.length}`;
      const state = part.state as Record<string, unknown> | undefined;
      const stateStatus = state?.status as string | undefined;

      let status: ToolCallEvent["status"] = "pending";
      if (stateStatus === "running") status = "running";
      else if (stateStatus === "completed") status = "completed";
      else if (stateStatus === "error" || stateStatus === "failed") status = "failed";

      if (!invocationMap.has(invocationId)) {
        // New invocation — record it
        // Only extract args if input has actual keys (pending events have empty input)
        const inputHasKeys = state?.input && typeof state.input === "object" && Object.keys(state.input as object).length > 0;
        const detail: ToolCallEvent = {
          name: toolName,
          args_summary: inputHasKeys ? extractArgsSummary(toolName, state!.input) : "",
          status,
          invocation_id: invocationId,
        };
        invocationMap.set(invocationId, detail);
        invocationOrder.push(invocationId);
      } else {
        // Status update for existing invocation
        const existing = invocationMap.get(invocationId)!;
        if (status === "completed" || status === "failed") {
          existing.status = status;
        } else if (status === "running" && existing.status === "pending") {
          existing.status = status;
        }
        // Update args_summary when input becomes available (pending event has empty input,
        // running/completed events have the actual args populated)
        if (state?.input && typeof state.input === "object" && Object.keys(state.input as object).length > 0) {
          const newSummary = extractArgsSummary(toolName, state.input);
          if (newSummary) existing.args_summary = newSummary;
        }
      }
    } catch {
      // skip unparseable events
    }
  }

  const sequence = invocationOrder.map((id) => invocationMap.get(id)!.name);
  const details = invocationOrder.map((id) => invocationMap.get(id)!);

  return { sequence, details };
}

// How long the session must stay idle before we consider it truly done.
// Multi-turn agents (e.g. junior-dev) can go idle briefly between tool calls
// before becoming busy again. We wait this long after the last idle event
// to confirm the session has actually settled.
const IDLE_SETTLE_MS = 15000;

async function collectSessionEvents(
  sessionId: string,
  timeoutMs: number
): Promise<Record<string, unknown>[]> {
  const events: Record<string, unknown>[] = [];
  const controller = new AbortController();

  // Hard deadline — abort the whole stream if nothing finishes in time
  const hardTimeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  // Settle timer — fires IDLE_SETTLE_MS after the last idle event if no
  // busy event arrives in the meantime. Cleared whenever busy is seen.
  let settleTimer: ReturnType<typeof setTimeout> | null = null;
  let resolveSettle: (() => void) | null = null;
  const settlePromise = new Promise<void>((resolve) => {
    resolveSettle = resolve;
  });

  function onIdle() {
    // Cancel any existing settle timer and start a fresh one
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      // Session has been idle for IDLE_SETTLE_MS with no busy event — truly done
      clearTimeout(hardTimeout);
      controller.abort();
      resolveSettle?.();
    }, IDLE_SETTLE_MS);
  }

  function onBusy() {
    // Session became active again — cancel the settle timer
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  const streamDone = (async () => {
    try {
      const response = await fetch(`${OPENCODE_SERVER_URL}/event`, {
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        return;
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

            // Only process events that belong to our session — skip events with no sessionID
            // or a different sessionID (could be stale events from previous sessions)
            if (eventSessionId !== sessionId) continue;

            events.push(data);

            if (data.type === "session.status") {
              const status = properties?.status as Record<string, unknown> | undefined;
              if (status?.type === "idle") {
                onIdle();
              } else if (status?.type === "busy" || status?.type === "running") {
                onBusy();
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
  })();

  // Wait for either the stream to end (aborted) or settle promise to resolve
  await Promise.race([streamDone, settlePromise]);

  if (settleTimer) clearTimeout(settleTimer);
  clearTimeout(hardTimeout);
  controller.abort(); // ensure stream is closed if settle fired first

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

/**
 * Verify that the installed global profile agent files match the source files.
 * Compares a key line (e.g. temperature) between source and installed file.
 * Warns if they differ — means deploy/update-profiles hasn't propagated yet.
 */
async function verifyAgentPropagation(agentIds: string[]): Promise<void> {
  const home = process.env.HOME ?? "/home/jack";
  const profileDir = `${home}/.config/opencode/profiles/naga-ollama/agents`;
  const sourceDir = `${import.meta.dir}/../files/agents`;

  let allMatch = true;
  for (const agentId of agentIds) {
    const sourcePath = `${sourceDir}/${agentId}.md`;
    const installedPath = `${profileDir}/${agentId}.md`;

    try {
      const sourceFile = Bun.file(sourcePath);
      const installedFile = Bun.file(installedPath);

      if (!(await installedFile.exists())) {
        console.warn(`  ⚠️  No installed file for agent: ${agentId} (${installedPath})`);
        allMatch = false;
        continue;
      }

      const sourceText = await sourceFile.text();
      const installedText = await installedFile.text();

      // Compare full content — if they differ, changes haven't propagated
      if (sourceText !== installedText) {
        console.warn(`  ⚠️  Agent ${agentId}: installed file differs from source — run deploy + update-profiles`);
        // Show first differing line for quick diagnosis
        const srcLines = sourceText.split("\n");
        const instLines = installedText.split("\n");
        for (let i = 0; i < Math.min(srcLines.length, instLines.length); i++) {
          if (srcLines[i] !== instLines[i]) {
            console.warn(`     First diff at line ${i + 1}:`);
            console.warn(`     source:    ${srcLines[i]}`);
            console.warn(`     installed: ${instLines[i]}`);
            break;
          }
        }
        allMatch = false;
      } else {
        console.log(`  ✅ Agent ${agentId}: installed matches source`);
      }
    } catch {
      console.warn(`  ⚠️  Could not verify agent ${agentId}`);
    }
  }

  if (!allMatch) {
    console.warn("\n  ⚠️  Some agents may not have propagated. Consider: bun run build && bun run deploy && bash scripts/update-profiles.sh\n");
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

  // Verify that agent files have propagated to the installed global profile
  if (artifactType === "agents") {
    const agentIds = artifacts.map((a) => a.agentId).filter(Boolean) as string[];
    console.log("🔍 Verifying agent propagation...");
    await verifyAgentPropagation(agentIds);
    console.log("");
  }

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
        // Reset project dir before each agent trial so file changes don't bleed across trials
        if (artifact.type === "agents") {
          await resetProjectDir();
        }
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
