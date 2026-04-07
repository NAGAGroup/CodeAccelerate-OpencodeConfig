// test/e2e-runner.ts
// E2E test runner for the planning DAG (plan-session).
//
// Simulates a /plan-session invocation by sending the slash command expansion
// as the first message to headwrench. Monitors the full multi-turn session
// across all DAG nodes, capturing per-node tool sequences and evaluating:
//   - Skill loading at each node
//   - Node instruction adherence (enforcement satisfaction)
//   - Delegation prompt quality (subjective — captured for human review)
//   - DAG quality (captured for human review)
//   - Completion without nudging
//
// Usage:
//   bun run test/e2e-runner.ts [--test=<id>] [--trials=N]
//
// Results are stored to Qdrant collection "e2e-test-harness".

import { QdrantClient } from "@qdrant/js-client-rest";
import { E2E_TESTS, type E2ETest } from "./e2e-prompts";

const OPENCODE_SERVER_URL = "http://localhost:4096";
const QDRANT_URL = "http://localhost:6333";
const QDRANT_COLLECTION = "e2e-test-harness";
const STATUS_FILE = "/tmp/e2e-status.json";

/** Write live progress to a status file so it can be monitored externally. */
function writeStatus(status: Record<string, unknown>): void {
  try {
    Bun.write(STATUS_FILE, JSON.stringify({ ...status, updated_at: new Date().toISOString() }, null, 2));
  } catch { /* non-fatal */ }
}

// How long to wait for the session to go idle between turns (model is slow)
const TURN_TIMEOUT_MS = 300_000; // 5 min per turn
// How long to wait for the entire session to complete
const SESSION_TIMEOUT_MS = 3_600_000; // 60 min total

// The planning DAG node sequence (in order) from plan.jsonl
const PLAN_SESSION_NODES = [
  "session-overview",
  "orientation-scout",
  "external-research",
  "write-notes",
  "compress",
  "session-overview-refresher",
  "retrieve-notes",
  "dag-design",
  "dag-review",
  "dag-revision",
  "plan-success",
] as const;

// Enforcement lists per node (from plan.jsonl)
const NODE_ENFORCEMENT: Record<string, string[]> = {
  "session-overview": ["choose_plan_name"],
  "orientation-scout": ["sequential-thinking_sequentialthinking", "task"],
  "external-research": ["sequential-thinking_sequentialthinking", "task"],
  "write-notes": ["qdrant_qdrant-store"],
  "compress": ["compress"],
  "session-overview-refresher": [],
  "retrieve-notes": ["sequential-thinking_sequentialthinking", "qdrant_qdrant-find", "sequential-thinking_sequentialthinking"],
  "dag-design": ["init_dag", "sequential-thinking_sequentialthinking", "task"],
  "dag-review": ["sequential-thinking_sequentialthinking", "task"],
  "dag-revision": ["sequential-thinking_sequentialthinking", "task"],
  "plan-success": [],
};

// Skills expected at each node (from Skills header in prompt files)
const NODE_EXPECTED_SKILLS: Record<string, string[]> = {
  "session-overview": ["following-plans"],
  "orientation-scout": ["context-scout-delegation", "sequential-thinking"],
  "external-research": ["external-scout-delegation", "sequential-thinking"],
  "write-notes": ["qdrant-notes"],
  "compress": [],
  "session-overview-refresher": ["following-plans"],
  "retrieve-notes": ["sequential-thinking", "qdrant-notes"],
  "dag-design": ["dag-design", "sequential-thinking"],
  "dag-review": ["dag-review", "sequential-thinking"],
  "dag-revision": ["dag-design", "sequential-thinking"],
  "plan-success": [],
};

interface ToolCall {
  name: string;
  args_summary: string;
  status: "pending" | "running" | "completed" | "failed";
}

interface NodeResult {
  node_id: string;
  // Tools called during this node's turn (in order of first appearance)
  tool_sequence: string[];
  tool_details: ToolCall[];
  // Skills loaded during this turn
  skills_loaded: string[];
  // Whether all enforcement tools were called (in order)
  enforcement_satisfied: boolean;
  enforcement_expected: string[];
  // Whether all expected skills were loaded
  skills_satisfied: boolean;
  skills_expected: string[];
  // The assistant's response text for this turn
  response_text: string | null;
  // How long this node took
  duration_ms: number;
  // Did the node advance (next_step called)?
  advanced: boolean;
  // Did enforcement block and require recovery?
  had_enforcement_error: boolean;
}

interface E2EResult {
  test_id: string;
  trial_number: number;
  prompt_text: string;
  session_id: string;
  // Results per node (in order of execution)
  node_results: NodeResult[];
  // Which nodes were reached
  nodes_reached: string[];
  // Did the session reach plan-success?
  completed: boolean;
  // Did it complete without any user nudging?
  completed_without_nudging: boolean;
  // Total duration
  total_duration_ms: number;
  // Final plan name (extracted from plan-success response)
  plan_name: string | null;
  // Whether headwrench needed to be nudged (extra prompts sent)
  nudge_count: number;
  timestamp: string;
}

// ─── Argument parsing ────────────────────────────────────────────────────────

interface ParsedArgs {
  testFilter: string | null;
  trials: number;
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const testArg = args.find((a) => a.startsWith("--test="));
  const trialsArg = args.find((a) => a.startsWith("--trials="));
  return {
    testFilter: testArg ? testArg.split("=")[1] : null,
    trials: trialsArg ? parseInt(trialsArg.split("=")[1], 10) : 1,
  };
}

// ─── SSE event collection ─────────────────────────────────────────────────────

/**
 * Collect SSE events for a session until it goes idle or times out.
 * Returns all events received during this turn.
 */
async function collectTurnEvents(
  sessionId: string,
  timeoutMs: number
): Promise<Record<string, unknown>[]> {
  const events: Record<string, unknown>[] = [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${OPENCODE_SERVER_URL}/event`, {
      headers: { Accept: "text/event-stream", "Cache-Control": "no-cache" },
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

          // Filter to our session
          if (eventSessionId && eventSessionId !== sessionId) continue;

          events.push(data);

          // Stop when session goes idle
          if (data.type === "session.status") {
            const status = properties?.status as Record<string, unknown> | undefined;
            if (status?.type === "idle") {
              clearTimeout(timeout);
              controller.abort();
              return events;
            }
          }
        } catch {
          // skip unparseable
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

// ─── Event parsing ────────────────────────────────────────────────────────────

function parseToolsFromEvents(events: Record<string, unknown>[]): {
  sequence: string[];
  details: ToolCall[];
  skillsLoaded: string[];
  hadEnforcementError: boolean;
  advanced: boolean;
} {
  const sequence: string[] = [];
  const details: ToolCall[] = [];
  const toolStates = new Map<string, ToolCall>();
  const skillsLoaded: string[] = [];
  let hadEnforcementError = false;
  let advanced = false;

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

      let status: ToolCall["status"] = "pending";
      if (stateStatus === "running") status = "running";
      else if (stateStatus === "completed") status = "completed";
      else if (stateStatus === "error" || stateStatus === "failed") status = "failed";

      // Track first appearance
      if (!toolStates.has(toolName)) {
        const argsRaw = state?.input ?? {};
        const detail: ToolCall = {
          name: toolName,
          args_summary: JSON.stringify(argsRaw).substring(0, 200),
          status,
        };
        toolStates.set(toolName, detail);
        sequence.push(toolName);

        // Detect skill loads — skill tool called with a name arg
        if (toolName === "skill") {
          const input = state?.input as Record<string, unknown> | undefined;
          const skillName = input?.name as string | undefined;
          if (skillName) skillsLoaded.push(skillName);
        }

        // Detect next_step (node advanced)
        if (toolName === "next_step") advanced = true;
      } else {
        const existing = toolStates.get(toolName)!;
        if (status === "completed" || status === "failed") existing.status = status;
        else if (status === "running" && existing.status === "pending") existing.status = status;
      }

      // Detect enforcement errors in tool output
      if (stateStatus === "completed") {
        const output = state?.output as string | undefined;
        if (output && (output.includes("EnforcementError") || output.includes("enforcement"))) {
          hadEnforcementError = true;
        }
      }
    } catch {
      // skip
    }
  }

  for (const name of sequence) {
    const d = toolStates.get(name);
    if (d) details.push(d);
  }

  return { sequence, details, skillsLoaded, hadEnforcementError, advanced };
}

function extractResponseText(events: Record<string, unknown>[]): string | null {
  // Collect all text parts from assistant messages in this batch of events
  const textParts: string[] = [];

  for (const event of events) {
    try {
      if (event.type !== "message.part.updated") continue;
      const properties = event.properties as Record<string, unknown> | undefined;
      if (!properties) continue;
      const part = properties.part as Record<string, unknown> | undefined;
      if (!part || part.type !== "text") continue;
      const state = part.state as Record<string, unknown> | undefined;
      const text = state?.value as string | undefined;
      if (text) textParts.push(text);
    } catch {
      // skip
    }
  }

  if (textParts.length === 0) return null;
  // Return the last/longest text part (most complete)
  return textParts.reduce((a, b) => (b.length > a.length ? b : a), "").trim() || null;
}

// ─── Enforcement checking ─────────────────────────────────────────────────────

/**
 * Check whether the enforcement sequence was satisfied.
 * The enforcement list is an ordered sequence — each tool must appear
 * in the tool_sequence in order (but other tools may appear between them).
 */
function checkEnforcement(toolSequence: string[], enforcement: string[]): boolean {
  if (enforcement.length === 0) return true;

  let enfIdx = 0;
  for (const tool of toolSequence) {
    if (tool === enforcement[enfIdx]) {
      enfIdx++;
      if (enfIdx === enforcement.length) return true;
    }
  }
  return false;
}

/**
 * Check whether all expected skills were loaded.
 */
function checkSkills(skillsLoaded: string[], expectedSkills: string[]): boolean {
  if (expectedSkills.length === 0) return true;
  return expectedSkills.every((s) => skillsLoaded.includes(s));
}

// ─── Plan name extraction ─────────────────────────────────────────────────────

function extractPlanName(responseText: string | null): string | null {
  if (!responseText) return null;
  // Look for /activate-plan <name> pattern
  const match = responseText.match(/\/activate-plan\s+([\w-]+)/);
  if (match) return match[1];
  // Or "plan name is X" pattern
  const match2 = responseText.match(/plan name[:\s]+`?([\w-]+)`?/i);
  if (match2) return match2[1];
  return null;
}

// ─── Session management ───────────────────────────────────────────────────────

async function createSession(): Promise<string> {
  const res = await fetch(`${OPENCODE_SERVER_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`Failed to create session: ${res.statusText}`);
  const data = await res.json() as Record<string, unknown>;
  return data.id as string;
}

async function sendPrompt(sessionId: string, text: string, agentId = "headwrench"): Promise<void> {
  await fetch(`${OPENCODE_SERVER_URL}/session/${sessionId}/prompt_async`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agent: agentId,
      parts: [{ type: "text", text }],
    }),
  });
}

// ─── Node tracking ────────────────────────────────────────────────────────────

/**
 * Infer which DAG node is currently active based on tools called.
 * Uses heuristics: the first enforcement tool seen that matches a node.
 */
function inferCurrentNode(toolSequence: string[], alreadyCompleted: string[]): string | null {
  // Find the first node whose enforcement tools appear in the sequence
  // and that hasn't been completed yet
  for (const nodeId of PLAN_SESSION_NODES) {
    if (alreadyCompleted.includes(nodeId)) continue;
    const enforcement = NODE_ENFORCEMENT[nodeId];
    if (enforcement.length === 0) {
      // Empty enforcement — infer from context (skill loads or position)
      return nodeId;
    }
    if (enforcement.some((tool) => toolSequence.includes(tool))) {
      return nodeId;
    }
  }
  return null;
}

// ─── Main E2E trial ───────────────────────────────────────────────────────────

async function runE2ETrial(test: E2ETest, trialNumber: number): Promise<E2EResult> {
  const startTime = Date.now();
  console.log(`\n  [Trial ${trialNumber}] Starting session...`);

  const sessionId = await createSession();
  console.log(`  Session: ${sessionId}`);

  const nodeResults: NodeResult[] = [];
  const nodesReached: string[] = [];
  let completed = false;
  let planName: string | null = null;
  let nudgeCount = 0;

  writeStatus({ phase: "starting", test_id: test.id, trial: trialNumber, session_id: sessionId, nodes_reached: [], current_turn: 0 });

  // ── Turn 1: initial prompt ──────────────────────────────────────────────────
  const eventsPromise = collectTurnEvents(sessionId, TURN_TIMEOUT_MS);
  await new Promise((r) => setTimeout(r, 300)); // brief delay before sending
  await sendPrompt(sessionId, test.prompt);
  console.log(`  Sent initial prompt, waiting for first turn...`);

  let turnEvents = await eventsPromise;
  let completedNodes: string[] = [];

  // ── Process turns until session completes or times out ──────────────────────
  const sessionDeadline = Date.now() + SESSION_TIMEOUT_MS;
  let turnNumber = 1;

  while (true) {
    const turnStart = Date.now();
    const { sequence, details, skillsLoaded, hadEnforcementError, advanced } =
      parseToolsFromEvents(turnEvents);
    const responseText = extractResponseText(turnEvents);

    console.log(`  Turn ${turnNumber}: tools=[${sequence.join(", ")}] skills=[${skillsLoaded.join(", ")}] advanced=${advanced}`);

    // Infer which node this turn belongs to
    const nodeId = inferCurrentNode(sequence, completedNodes) ??
      (PLAN_SESSION_NODES.find((n) => !completedNodes.includes(n)) ?? "unknown");

    const enforcement = NODE_ENFORCEMENT[nodeId] ?? [];
    const expectedSkills = NODE_EXPECTED_SKILLS[nodeId] ?? [];
    const enforcementSatisfied = checkEnforcement(sequence, enforcement);
    const skillsSatisfied = checkSkills(skillsLoaded, expectedSkills);

    const nodeResult: NodeResult = {
      node_id: nodeId,
      tool_sequence: sequence,
      tool_details: details,
      skills_loaded: skillsLoaded,
      enforcement_satisfied: enforcementSatisfied,
      enforcement_expected: enforcement,
      skills_satisfied: skillsSatisfied,
      skills_expected: expectedSkills,
      response_text: responseText,
      duration_ms: Date.now() - turnStart,
      advanced,
      had_enforcement_error: hadEnforcementError,
    };

    nodeResults.push(nodeResult);

    if (!nodesReached.includes(nodeId)) nodesReached.push(nodeId);
    if (advanced) completedNodes.push(nodeId);

    // Write live status after every turn
    writeStatus({
      phase: "running",
      test_id: test.id,
      trial: trialNumber,
      session_id: sessionId,
      current_turn: turnNumber,
      current_node: nodeId,
      nodes_reached: nodesReached,
      last_tools: sequence,
      last_skills: skillsLoaded,
      enforcement_satisfied: enforcementSatisfied,
      elapsed_ms: Date.now() - startTime,
    });

    // Check if we reached plan-success
    if (nodeId === "plan-success" || sequence.includes("plan_session") && nodesReached.length === 1) {
      // plan_session itself is the kickoff — not a node completion
    }

    if (nodesReached.includes("plan-success") && advanced) {
      completed = true;
      planName = extractPlanName(responseText);
      console.log(`  ✅ Reached plan-success! Plan name: ${planName ?? "(not extracted)"}`);
      writeStatus({ phase: "complete", test_id: test.id, trial: trialNumber, session_id: sessionId, nodes_reached: nodesReached, plan_name: planName, elapsed_ms: Date.now() - startTime });
      break;
    }

    // Check if session is done (no more turns expected)
    if (turnEvents.length === 0) {
      console.log(`  ⚠️  No events received — session may have stalled`);
      break;
    }

    // Check deadline
    if (Date.now() > sessionDeadline) {
      console.log(`  ⏰ Session deadline exceeded`);
      break;
    }

    // Wait for the next turn (DAG advances automatically via next_step)
    turnNumber++;
    console.log(`  Waiting for turn ${turnNumber}...`);
    const nextEventsPromise = collectTurnEvents(sessionId, TURN_TIMEOUT_MS);
    await new Promise((r) => setTimeout(r, 500));
    turnEvents = await nextEventsPromise;

    // If no events, session is done or stalled
    if (turnEvents.length === 0) {
      console.log(`  ⚠️  No events on turn ${turnNumber} — session ended or stalled`);
      break;
    }
  }

  return {
    test_id: test.id,
    trial_number: trialNumber,
    prompt_text: test.prompt,
    session_id: sessionId,
    node_results: nodeResults,
    nodes_reached: nodesReached,
    completed,
    completed_without_nudging: completed && nudgeCount === 0,
    total_duration_ms: Date.now() - startTime,
    plan_name: planName,
    nudge_count: nudgeCount,
    timestamp: new Date().toISOString(),
  };
}

// ─── Qdrant storage ───────────────────────────────────────────────────────────

async function ensureCollection(qdrant: QdrantClient): Promise<void> {
  try {
    await qdrant.getCollection(QDRANT_COLLECTION);
  } catch {
    await qdrant.createCollection(QDRANT_COLLECTION, {
      vectors: { "fast-all-minilm-l6-v2": { size: 384, distance: "Cosine" } },
    });
    console.log(`✅ Created Qdrant collection: ${QDRANT_COLLECTION}`);
  }
}

async function storeResult(qdrant: QdrantClient, result: E2EResult): Promise<void> {
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

// ─── Summary printing ─────────────────────────────────────────────────────────

function printNodeSummary(result: E2EResult): void {
  console.log(`\n  📋 Node-by-node breakdown:`);
  for (const nr of result.node_results) {
    const enfStatus = nr.enforcement_expected.length === 0
      ? "✅ (no enforcement)"
      : nr.enforcement_satisfied ? "✅" : "❌";
    const skillStatus = nr.skills_expected.length === 0
      ? "✅ (no skills)"
      : nr.skills_satisfied ? "✅" : "❌";
    const errorFlag = nr.had_enforcement_error ? " ⚠️ enforcement error (recovered)" : "";
    console.log(`    [${nr.node_id}]`);
    console.log(`      Tools:  ${nr.tool_sequence.join(" → ") || "(none)"}`);
    console.log(`      Skills: ${nr.skills_loaded.join(", ") || "(none)"}`);
    console.log(`      Enforcement: ${enfStatus}  Skills: ${skillStatus}${errorFlag}`);
    if (nr.response_text) {
      const preview = nr.response_text.substring(0, 120).replace(/\n/g, " ");
      console.log(`      Response: "${preview}..."`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function verifyServer(): Promise<void> {
  try {
    const res = await fetch(`${OPENCODE_SERVER_URL}/session`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok && res.status !== 405) throw new Error(`Status ${res.status}`);
    console.log("✅ OpenCode server reachable");
  } catch (err) {
    throw new Error(
      `OpenCode server not reachable at ${OPENCODE_SERVER_URL}.\nRun: bun run test:setup first\n${err}`
    );
  }
}

async function main() {
  const { testFilter, trials } = parseArgs();

  await verifyServer();

  const qdrant = new QdrantClient({ url: QDRANT_URL });
  await ensureCollection(qdrant);

  let tests = E2E_TESTS;
  if (testFilter) {
    tests = tests.filter((t) => t.id === testFilter);
    if (tests.length === 0) {
      console.error(`No E2E test found with id: ${testFilter}`);
      console.error(`Available: ${E2E_TESTS.map((t) => t.id).join(", ")}`);
      process.exit(1);
    }
  }

  console.log(`\n🚀 E2E Planning DAG Test Runner`);
  console.log(`📍 OpenCode: ${OPENCODE_SERVER_URL}  Qdrant: ${QDRANT_URL}/${QDRANT_COLLECTION}`);
  console.log(`📋 Tests: ${tests.map((t) => t.id).join(", ")}`);
  console.log(`🔁 Trials per test: ${trials}\n`);

  let totalCompleted = 0;
  let totalRuns = 0;

  for (const test of tests) {
    console.log(`\n🧪 Test: ${test.id}`);
    console.log(`   Success criteria: ${test.successDescription.substring(0, 120)}...`);

    for (let trial = 1; trial <= trials; trial++) {
      totalRuns++;
      try {
        const result = await runE2ETrial(test, trial);
        await storeResult(qdrant, result);
        printNodeSummary(result);

        const completionStatus = result.completed
          ? result.completed_without_nudging ? "✅ completed (no nudging)" : "⚠️ completed (nudged)"
          : "❌ did not complete";

        console.log(`\n  Result: ${completionStatus}`);
        console.log(`  Nodes reached: ${result.nodes_reached.join(" → ")}`);
        console.log(`  Plan name: ${result.plan_name ?? "(none)"}`);
        console.log(`  Duration: ${(result.total_duration_ms / 1000).toFixed(1)}s`);

        if (result.completed) totalCompleted++;
      } catch (error) {
        console.error(`  ❌ Trial ${trial} failed:`, error);
      }

      // Brief pause between trials
      if (trial < trials) {
        console.log(`\n  Pausing 5s before next trial...`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  console.log(`\n\n📊 E2E Summary`);
  console.log(`   Total runs: ${totalRuns}`);
  console.log(`   Completed:  ${totalCompleted}/${totalRuns}`);
  console.log(`   Results stored to Qdrant collection: ${QDRANT_COLLECTION}\n`);

  process.exit(totalCompleted === totalRuns ? 0 : 1);
}

main().catch(console.error);
