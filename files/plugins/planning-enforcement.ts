import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

// The config root is the directory that contains this plugin's parent folder.
// When installed via OCX the layout is:
//   {install_root}/plugins/planning-enforcement.js  ← this file
//   {install_root}/planning/plan-generic/plan.json  ← DAG files
// So CONFIG_ROOT = dirname of this file's directory = {install_root}.
const CONFIG_ROOT = path.dirname(import.meta.dirname);

// ─── Types ───────────────────────────────────────────────────────────────────

interface DagNode {
  id: string;
  type: "agent" | "gate";
  prompt: string;
  next?:
    | Record<string, { desc: string; choose_when: string }>
    | string
    | undefined;
  remaining_visits?: number;
  status?: "pending" | "in_progress" | "completed";
  completed_at?: string;
}

interface PlanDag {
  schema_version: "1.0";
  id: string;
  session_type: string;
  description?: string;
  goal?: string;
  entry: string;
  nodes: Record<string, DagNode>;
  progress?: {
    current_node: string;
    started_at: string;
    updated_at: string;
    completed_at?: string;
  };
}

interface DagSessionState {
  dag_id: string;
  plan_path: string; // absolute path to plan.json — set at activation, used by next_step
  status: "running" | "waiting_gate" | "complete" | "failed";
  current_node: string;
  started_at: string;
  updated_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dagStatePath(worktree: string, sessionId: string): string {
  return path.join(worktree, ".opencode", "dag-state", `${sessionId}.json`);
}

function readDag(dagPath: string): PlanDag {
  const content = fs.readFileSync(dagPath, "utf-8");
  return JSON.parse(content) as PlanDag;
}

function expandPath(p: string): string {
  if (p.startsWith("~/")) {
    const home = process.env.HOME || process.env.USERPROFILE || "";
    return path.join(home, p.slice(2));
  }
  return p;
}

function readPrompt(
  promptPath: string,
  worktree: string,
  configRoot: string = CONFIG_ROOT,
): string {
  // Prompt paths may be:
  //   - absolute (/foo/bar)
  //   - home-relative (~/foo/bar)               — legacy, still supported
  //   - config-root-relative (planning/...)      — OCX-installed DAG prompts
  //   - worktree-relative (foo/bar)              — session-plan prompts
  const expanded = expandPath(promptPath);
  if (path.isAbsolute(expanded)) {
    return fs.readFileSync(expanded, "utf-8");
  }
  if (expanded.startsWith("planning/") || expanded === "planning") {
    return fs.readFileSync(path.join(configRoot, expanded), "utf-8");
  }
  return fs.readFileSync(path.join(worktree, expanded), "utf-8");
}

function writeState(statePath: string, state: DagSessionState): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

function readState(statePath: string): DagSessionState | null {
  if (!fs.existsSync(statePath)) return null;
  return JSON.parse(fs.readFileSync(statePath, "utf-8")) as DagSessionState;
}

function now(): string {
  return new Date().toISOString();
}

// ─── Plan activation (shared logic for plan_* and activate_plan) ──────────────

function activateDag(
  dag: PlanDag,
  planPath: string, // absolute path to plan.json — stored in state for next_step
  sessionId: string,
  worktree: string,
  configRoot: string = CONFIG_ROOT,
): string {
  const entryNode = dag.nodes[dag.entry];
  if (!entryNode) {
    return `Error: entry node "${dag.entry}" not found in DAG "${dag.id}"`;
  }

  const statePath = dagStatePath(worktree, sessionId);

  const state: DagSessionState = {
    dag_id: dag.id,
    plan_path: planPath,
    status: entryNode.type === "gate" ? "waiting_gate" : "running",
    current_node: dag.entry,
    started_at: now(),
    updated_at: now(),
  };
  writeState(statePath, state);

  // Write initial progress into plan.json (session plans only)
  if (planPath.includes(".opencode/session-plans")) {
    dag.progress = {
      current_node: dag.entry,
      started_at: now(),
      updated_at: now(),
    };
    dag.nodes[dag.entry].status = "in_progress";
    fs.writeFileSync(planPath, JSON.stringify(dag, null, 2), "utf-8");
  }

  // Return prompt text as part of the tool result
  const promptText = readPrompt(entryNode.prompt, worktree, configRoot);
  let result = `DAG "${dag.id}" activated. Starting at node: ${dag.entry}. Status: ${state.status}.\n\n---\n\n${promptText}`;

  // Append Available Next Steps if the entry node has branching options (object format)
  if (
    typeof entryNode.next === "object" &&
    entryNode.next !== null &&
    !Array.isArray(entryNode.next)
  ) {
    const nextOptions = entryNode.next as Record<
      string,
      { desc: string; choose_when: string }
    >;
    const optionsList = Object.entries(nextOptions)
      .map(
        ([key, val]) =>
          `- **${key}**: ${val.desc} _(choose when: ${val.choose_when})_`,
      )
      .join("\n");
    result += `\n\n## Available Next Steps\n\n${optionsList}`;
  }

  return result;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const PlanningEnforcementPlugin: Plugin = async (_ctx) => {
  return {
    tool: {
      // ── plan_generic ──────────────────────────────────────────────────────
      plan_generic: tool({
        description:
          "Start a /plan-generic planning session. Reads the plan-generic DAG and activates the planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            CONFIG_ROOT,
            "planning",
            "plan-generic",
            "plan.json",
          );
          try {
            const dag = readDag(planPath);
            return activateDag(
              dag,
              planPath,
              context.sessionID,
              context.worktree,
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-generic: ${msg}`;
          }
        },
      }),

      // ── plan_debug ────────────────────────────────────────────────────────
      plan_debug: tool({
        description:
          "Start a /plan-debug planning session. Reads the plan-debug DAG and activates the debug planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            CONFIG_ROOT,
            "planning",
            "plan-debug",
            "plan.json",
          );
          try {
            const dag = readDag(planPath);
            return activateDag(
              dag,
              planPath,
              context.sessionID,
              context.worktree,
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-debug: ${msg}`;
          }
        },
      }),

      // ── plan_collaborative ────────────────────────────────────────────────
      plan_collaborative: tool({
        description:
          "Start a /plan-collaborative planning session. Reads the plan-collaborative DAG and activates the collaborative planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            CONFIG_ROOT,
            "planning",
            "plan-collaborative",
            "plan.json",
          );
          try {
            const dag = readDag(planPath);
            return activateDag(
              dag,
              planPath,
              context.sessionID,
              context.worktree,
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-collaborative: ${msg}`;
          }
        },
      }),

      // ── plan_deep_research ───────────────────────────────────────────────
      plan_deep_research: tool({
        description:
          "Start a /plan-deep-research planning session. Reads the plan-deep-research DAG and activates the research planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            CONFIG_ROOT,
            "planning",
            "plan-deep-research",
            "plan.json",
          );
          try {
            const dag = readDag(planPath);
            return activateDag(
              dag,
              planPath,
              context.sessionID,
              context.worktree,
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-deep-research: ${msg}`;
          }
        },
      }),

      // ── plan_deep_review ─────────────────────────────────────────────────
      plan_deep_review: tool({
        description:
          "Start a /plan-deep-review planning session. Reads the plan-deep-review DAG and activates the deep review planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            CONFIG_ROOT,
            "planning",
            "plan-deep-review",
            "plan.json",
          );
          try {
            const dag = readDag(planPath);
            return activateDag(
              dag,
              planPath,
              context.sessionID,
              context.worktree,
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-deep-review: ${msg}`;
          }
        },
      }),

      // ── activate_plan ─────────────────────────────────────────────────────
      activate_plan: tool({
        description:
          "Activate an execution plan produced by a planning session. Reads plan.json from the given session plan directory and starts execution at the entry node.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              'Name of the session plan to activate (matches directory name under .opencode/session-plans/). Example: "my-feature-plan"',
            ),
        },
        async execute({ plan_name }, context) {
          const planPath = path.join(
            context.worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.json",
          );
          try {
            const dag = readDag(planPath);
            return activateDag(
              dag,
              planPath,
              context.sessionID,
              context.worktree,
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan "${plan_name}": ${msg}`;
          }
        },
      }),

      // ── next_step ─────────────────────────────────────────────────────────
      next_step: tool({
        description:
          "Advance the current DAG session to the next node and inject that node's prompt. Call this when the current node's work is complete. If the current node has multiple possible next nodes, pass the chosen node ID via the 'next' argument.",
        args: {
          next: tool.schema
            .string()
            .optional()
            .describe(
              "The node ID to advance to. Required when the current node has multiple next options (array). Omit when there is only one next node.",
            ),
        },
        async execute({ next }, context) {
          const statePath = dagStatePath(context.worktree, context.sessionID);
          const state = readState(statePath);

          if (!state) {
            return "No active DAG session found for this session ID. Start a planning session first with plan_generic(), plan_debug(), or plan_collaborative().";
          }

          if (state.status === "complete" || state.status === "failed") {
            return `Session DAG is already in terminal state: ${state.status}.`;
          }

          // Load the plan from the path stored at activation time.
          // state.plan_path is set by activateDag and is always an absolute path.
          // For collaborative/debug sessions the agent may have rewritten plan.json in-place
          // (that's fine — we always re-read from the same path).
          if (!fs.existsSync(state.plan_path)) {
            return `plan.json not found at stored path "${state.plan_path}". Cannot advance.`;
          }
          const dag = readDag(state.plan_path);

          const currentNode = dag.nodes[state.current_node];
          if (!currentNode) {
            return `Current node "${state.current_node}" not found in DAG. DAG may have been modified.`;
          }

          // Decrement remaining_visits if applicable
          if (typeof currentNode.remaining_visits === "number") {
            currentNode.remaining_visits -= 1;
            if (currentNode.remaining_visits <= 0) {
              state.status = "failed";
              state.updated_at = now();
              writeState(statePath, state);
              return `Node "${state.current_node}" has exhausted its remaining_visits. DAG status set to "failed".`;
            }
            dag.nodes[state.current_node] = currentNode;
          }

          // Resolve next node
          let nextNodeId: string;
          if (typeof currentNode.next === "string") {
            nextNodeId = currentNode.next;
          } else if (Array.isArray(currentNode.next)) {
            if (!next) {
              return `Node "${state.current_node}" has multiple next options: [${currentNode.next.join(", ")}]. Call next_step with the 'next' argument specifying which node to advance to.`;
            }
            if (!currentNode.next.includes(next)) {
              return `Invalid next node "${next}". Valid options for "${state.current_node}": [${currentNode.next.join(", ")}]`;
            }
            nextNodeId = next;
          } else if (
            typeof currentNode.next === "object" &&
            currentNode.next !== null &&
            !Array.isArray(currentNode.next)
          ) {
            const nextOptions = currentNode.next as Record<
              string,
              { desc: string; choose_when: string }
            >;
            const validKeys = Object.keys(nextOptions);
            if (!next) {
              const optionsList = validKeys
                .map(
                  (key) =>
                    `- **${key}**: ${nextOptions[key].desc} _(choose when: ${nextOptions[key].choose_when})_`,
                )
                .join("\n");
              return `Node "${state.current_node}" has multiple next options. Call next_step with the 'next' argument specifying which node to advance to.\n\n## Available Next Steps\n\n${optionsList}`;
            }
            if (!validKeys.includes(next)) {
              return `Invalid next node "${next}". Valid options for "${state.current_node}": [${validKeys.join(", ")}]`;
            }
            nextNodeId = next;
          } else {
            // Terminal node — no next; mark departing node completed in plan.json
            if (state.plan_path.includes(".opencode/session-plans")) {
              dag.nodes[state.current_node].status = "completed";
              dag.nodes[state.current_node].completed_at = now();
              if (dag.progress) {
                dag.progress.updated_at = now();
              }
              fs.writeFileSync(
                state.plan_path,
                JSON.stringify(dag, null, 2),
                "utf-8",
              );
            }
            state.status = "complete";
            state.updated_at = now();
            writeState(statePath, state);
            return `Node "${state.current_node}" is a terminal node (no next). DAG complete. Call close_session() to clean up.`;
          }

          const nextNode = dag.nodes[nextNodeId];
          if (!nextNode) {
            return `Next node "${nextNodeId}" not found in DAG. DAG may be malformed.`;
          }

          // Update progress in plan.json (session plans only) — consolidated with remaining_visits write
          if (state.plan_path.includes(".opencode/session-plans")) {
            dag.nodes[state.current_node].status = "completed";
            dag.nodes[state.current_node].completed_at = now();
            dag.nodes[nextNodeId].status = "in_progress";
            if (dag.progress) {
              dag.progress.current_node = nextNodeId;
              dag.progress.updated_at = now();
            }
            fs.writeFileSync(
              state.plan_path,
              JSON.stringify(dag, null, 2),
              "utf-8",
            );
          } else if (typeof currentNode.remaining_visits === "number") {
            // Non-session plan: still need to write remaining_visits
            fs.writeFileSync(
              state.plan_path,
              JSON.stringify(dag, null, 2),
              "utf-8",
            );
          }

          // Update state
          state.current_node = nextNodeId;
          state.status = nextNode.type === "gate" ? "waiting_gate" : "running";
          state.updated_at = now();
          writeState(statePath, state);

          // Return next node's prompt as part of the tool result
          const promptText = readPrompt(
            nextNode.prompt,
            context.worktree,
            CONFIG_ROOT,
          );
          let result = `Advanced to node "${nextNodeId}" (type: ${nextNode.type}). Status: ${state.status}.\n\n---\n\n${promptText}`;

          // Append Available Next Steps if the newly active node has branching options (object format)
          if (
            typeof nextNode.next === "object" &&
            nextNode.next !== null &&
            !Array.isArray(nextNode.next)
          ) {
            const nextOptions = nextNode.next as Record<
              string,
              { desc: string; choose_when: string }
            >;
            const optionsList = Object.entries(nextOptions)
              .map(
                ([key, val]) =>
                  `- **${key}**: ${val.desc} _(choose when: ${val.choose_when})_`,
              )
              .join("\n");
            result += `\n\n## Available Next Steps\n\n${optionsList}`;
          }

          return result;
        },
      }),

      // ── close_session ─────────────────────────────────────────────────────
      close_session: tool({
        description:
          "Close the current DAG session. Marks the session as complete and removes the runtime dag-state file. Call this when all DAG work is finished.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(context.worktree, context.sessionID);

          if (!fs.existsSync(statePath)) {
            return "No active DAG session found for this session. Nothing to close.";
          }

          try {
            const state = readState(statePath);

            // Write final progress into plan.json (session plans only)
            if (
              state &&
              state.plan_path &&
              state.plan_path.includes(".opencode/session-plans") &&
              fs.existsSync(state.plan_path)
            ) {
              const dag = readDag(state.plan_path);

              // Guard: only allow close_session on terminal nodes
              const currentNodeForClose = dag.nodes[state.current_node];
              if (
                currentNodeForClose &&
                currentNodeForClose.next !== undefined
              ) {
                return `close_session() may only be called on terminal nodes. Current node '${state.current_node}' has a next field.`;
              }

              if (dag.progress) {
                dag.nodes[state.current_node].status = "completed";
                dag.nodes[state.current_node].completed_at = now();
                dag.progress.completed_at = now();
                dag.progress.updated_at = now();
                fs.writeFileSync(
                  state.plan_path,
                  JSON.stringify(dag, null, 2),
                  "utf-8",
                );
              }
            }

            fs.unlinkSync(statePath);

            if (state?.plan_path?.includes(".opencode/session-plans")) {
              const sessionName = state.plan_path
                .split(".opencode/session-plans/")[1]
                ?.split("/")[0];
              if (sessionName) {
                return `DAG session closed. State file removed.\n\nTo complete archival: move the session plan "${sessionName}" from .opencode/session-plans/ to .opencode/archived-plans/ and commit the change as a chore.`;
              }
            }
            return "DAG session closed. State file removed.";
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error closing session: ${msg}`;
          }
        },
      }),

      // ── reset_counters ────────────────────────────────────────────────────
      reset_counters: tool({
        description:
          "Reset all exhausted remaining_visits counters (those at 0 or below) in the active DAG plan to the given count (default: 3), and set session status back to 'running'. Call this when a loop node has exhausted its counter and the DAG has entered 'failed' state, to resume the session.",
        args: {
          visits: tool.schema
            .number()
            .optional()
            .describe(
              "The number of visits to restore each exhausted counter to. Defaults to 3 if not provided.",
            ),
        },
        async execute({ visits }, context) {
          const statePath = dagStatePath(context.worktree, context.sessionID);
          const state = readState(statePath);

          if (!state) {
            return "No active DAG session found for this session ID.";
          }

          if (!fs.existsSync(state.plan_path)) {
            return `plan.json not found at stored path "${state.plan_path}". Cannot reset counters.`;
          }

          const dag = readDag(state.plan_path);
          const restoreTo =
            typeof visits === "number" && visits > 0 ? visits : 3;

          // Reset any remaining_visits that are exhausted (<= 0) back to restoreTo.
          // Original values are not recoverable after in-place decrement, so we
          // restore to the caller-specified count or the default of 3.
          let resetCount = 0;
          for (const node of Object.values(dag.nodes)) {
            if (
              typeof node.remaining_visits === "number" &&
              node.remaining_visits <= 0
            ) {
              node.remaining_visits = restoreTo;
              resetCount++;
            }
          }

          // Write updated plan.json
          fs.writeFileSync(
            state.plan_path,
            JSON.stringify(dag, null, 2),
            "utf-8",
          );

          // Restore session status to running
          state.status = "running";
          state.updated_at = now();
          writeState(statePath, state);

          return `Counters reset. ${resetCount} node(s) had their remaining_visits restored to ${restoreTo}. Session status set back to "running". Call next_step() to continue.`;
        },
      }),
    },
  };
};
