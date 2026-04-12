import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";

import * as fs from "fs";
import * as path from "path";
import type {
  DecisionEntry,
  DagSessionState,
  DagNodeV3,
  DagMetadataV3,
  PhaseRecord,
  PhaseDagMetadata,
  PhaseType,
  BRANCHING_PHASE_TYPES,
} from "./types";
import { exemptTools, isExempt, CONFIG_ROOT } from "./constants";
import { dagStatePath, writeState, readState, now } from "./state-io";
import { expandPath, readPrompt, resolveDagPath } from "./path-utils";
import { readDagV3, writeDagV3 } from "./dag-io";
import { flattenTreeV3 } from "./dag-tree";
import { copyPlanningDag } from "./dag-lifecycle";
import { ensureOpenCodeIgnore } from "./plugin-utils";
import {
  detectDivergence,
  suggestRecoveryActions,
} from "./divergence-detection";
import { readPhaseDag, writePhaseDag, detectSchemaVersion } from "./phase-io";
import { compilePhasesToNodes } from "./phase-expander";

// Valid phase types for schema validation
const VALID_PHASE_TYPES = new Set([
  "external-research", "internal-research", "project-survey",
  "work", "project-commands", "user-discussion",
  "agentic-decision-gate", "write-notes", "early-exit",
]);

// Phase types allowed to have multiple children
const BRANCHING_PHASE_TYPE_SET = new Set(["agentic-decision-gate", "user-discussion"]);

/** Validate phase_options for a given phase type. Throws with a clear message on failure. */
function validatePhaseOptions(phase_type: string, opts: Record<string, unknown>): void {
  const require = (field: string, expectedType?: string) => {
    if (!(field in opts) || opts[field] === null || opts[field] === undefined) {
      throw new Error(`Phase type '${phase_type}' requires '${field}' in phase_options.`);
    }
    if (expectedType === "string" && typeof opts[field] !== "string") {
      throw new Error(`'${field}' must be a string.`);
    }
    if (expectedType === "string[]" && !Array.isArray(opts[field])) {
      throw new Error(`'${field}' must be an array of strings.`);
    }
  };

  switch (phase_type) {
    case "external-research":
      require("questions", "string[]");
      if (opts["research-type"] && !["standard", "deep"].includes(opts["research-type"] as string)) {
        throw new Error(`Invalid value for 'research-type': '${opts["research-type"]}'. Expected: standard | deep.`);
      }
      break;
    case "internal-research":
      require("questions", "string[]");
      break;
    case "project-survey":
      require("topics", "string[]");
      break;
    case "work":
      require("goal", "string");
      require("work-type", "string");
      require("verify-description", "string");
      if (!["code", "docs"].includes(opts["work-type"] as string)) {
        throw new Error(`Invalid value for 'work-type': '${opts["work-type"]}'. Expected: code | docs.`);
      }
      break;
    case "project-commands":
      require("goal", "string");
      break;
    case "user-discussion":
      require("topic", "string");
      break;
    case "agentic-decision-gate":
      require("question", "string");
      require("branches", "string[]");
      break;
    case "write-notes":
    case "early-exit":
      // All fields optional
      break;
  }
}

/** Inject planner-authored description into the {{DESCRIPTION}} placeholder in the prompt. */
function withDescription(promptText: string, description?: string): string {
  if (!description) return promptText;
  return promptText.replace('{{DESCRIPTION}}', description);
}

export const PlanningEnforcementPlugin: Plugin = async (_ctx) => {
  const { client } = _ctx;

  // Helper to resolve worktree with fallback to cwd
  const resolveWorktree = (_ctx: { worktree?: string }) => process.cwd();

  // Per-turn cache: populated by chat.params (has sessionID), consumed by
  // experimental.chat.system.transform (input: {} — no sessionID available).
  let _dagActiveThisTurn = false;

  // Ensure .opencodeignore exists and includes !.opencode/ pattern
  ensureOpenCodeIgnore(resolveWorktree(_ctx));

  return {
    // ── Tools ──────────────────────────────────────────────────────────────

    tool: {
      plan_session: tool({
        description:
          "Start a /plan-session planning session. Copies the global planning DAG locally and activates it.",
        args: {},
        async execute(_args, context) {
          // State creation and prompt injection handled by tool.execute.before.
          const worktree = resolveWorktree(context);
          const statePath = dagStatePath(worktree, context.sessionID);
          const state = readState(statePath);
          if (!state) return "Failed to activate plan session.";
          return `DAG "${state.dag_id}" activated. Your next task, "${state.current_node}", will be presented in the following message.`;
        },
      }),

      activate_plan: tool({
        description:
          "Activate a project DAG produced by a planning session.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "The plan name.",
            ),
        },
        async execute({ plan_name }, context) {
          // State creation and prompt injection handled by tool.execute.before.
          const worktree = resolveWorktree(context);
          const statePath = dagStatePath(worktree, context.sessionID);
          const state = readState(statePath);
          if (!state) return `Failed to activate plan "${plan_name}".`;
          return `DAG "${state.dag_id}" activated. Your next task, "${state.current_node}", will be presented in the following message.`;
        },
      }),

      next_step: tool({
        description:
          "Call this after completing a node's todos to advance to the next node. Required on every node. Pass { next } to choose a branch; omit for linear advance or session completion.",
        args: {
          next: tool.schema
            .string()
            .optional()
            .describe(
              "The node ID of the branch to take (required for branching nodes, omit for linear advance).",
            ),
        },
        async execute({ next }, context) {
          // Validation and prompt injection already happened in tool.execute.before.
          // If we reach here, the call is valid. Do state transitions and return status.
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session.";

          const node = state.node_map[state.current_node];
          if (!node)
            return `Current node "${state.current_node}" not found in DAG.`;

          const children = node.children ?? [];

          // Terminal — end session
          if (children.length === 0) {
            state.status = "complete";
            state.updated_at = now();
            writeState(statePath, state);

            const isPlanningSession = state.dag_id.startsWith("plan-session");
            if (isPlanningSession) {
              return (
                `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
                `PLANNING SESSION COMPLETE. Do NOT continue executing tasks. ` +
                `Present the final plan to the user by calling present_plan_diagram with the plan name, then ` +
                `present a summary of what was produced. ` +
                `If a project plan was written, tell the user they can activate it with /activate-plan {plan-name}.`
              );
            } else {
              return (
                `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
                `EXECUTION COMPLETE. Do NOT continue executing tasks. ` +
                `Present a summary to the user of what was accomplished, any deferred items, and known limitations.`
              );
            }
          }

          // Branching — record decision
          if (children.length > 1) {
            state.decisions.push({
              node_id: state.current_node,
              timestamp: now(),
              summary: `Chose branch "${next}"`,
            });
          }

          // Advance to next node
          const nextId = children.length === 1 ? children[0] : next!;
          const nextNode = state.node_map[nextId];
          if (!nextNode)
            throw new Error(`Next node "${nextId}" not found in DAG`);

          state.current_node = nextId;
          state.todo_index = 0;
          state.status = "running";
          state.updated_at = now();
          writeState(statePath, state);

          // Handle zero-enforcement nodes (passthrough)
          if (nextNode.enforcement.length === 0) {
            const nextChildren = nextNode.children ?? [];
            if (nextChildren.length > 0) {
              state.status = "waiting_step";
            } else {
              state.status = "complete";
            }
            writeState(statePath, state);
          }

          // Build status message
          const { metadata } = readDagV3(state.plan_path);
          const isFromEntryNode = node.id === metadata.entry_node_id;

          let result = "";
          if (!isFromEntryNode) {
            result += `You have just completed "${node.id}". `;
          }
          result += `Please wait for your next task.`;

          return result;
        },
      }),

      get_branch_options: tool({
        description:
          "Returns the branch phase options available for next_step at the current branching node. Call this before making a routing decision to know the valid options.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session.";

          const node = state.node_map[state.current_node];
          if (!node)
            return `Current node "${state.current_node}" not found in DAG.`;

          const children = node.children ?? [];
          if (children.length !== 2) {
            return `Node "${state.current_node}" is not a branching node — it has ${children.length} child(ren).`;
          }

          return `Branch options for next_step: [${children.join(", ")}]`;
        },
      }),

      recover_context: tool({
        description:
          "Recover DAG session context after autocompaction or context loss. Returns current node, completed work, and decisions made. Also detects and reports any divergence between session state and DAG structure.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session found.";

          // Detect divergence between state and DAG
          const divergenceReport = detectDivergence(state);
          let divergenceWarning = "";
          if (divergenceReport.hasDivergence) {
            divergenceWarning = "DIVERGENCE DETECTED\n\n";
            for (const issue of divergenceReport.issues) {
              divergenceWarning += `[${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}\n\n`;
            }
            const suggestions = suggestRecoveryActions(divergenceReport);
            divergenceWarning += "Suggested Recovery Actions:\n";
            suggestions.forEach((s) => {
              divergenceWarning += `${s}\n`;
            });
            divergenceWarning += "\n";
          }

          // Resume an abandoned session from where it left off
          if (state.status === "abandoned") {
            const node = state.node_map[state.current_node];
            const remaining = node
              ? node.enforcement.length - state.todo_index
              : 0;
            // If all enforcement items were done, resume as waiting_step; otherwise resume as running
            state.status = remaining === 0 ? "waiting_step" : "running";
            state.updated_at = now();
            writeState(statePath, state);
          }

          const currentNode = state.node_map[state.current_node];
          const sessionPath = `.opencode/session-plans/${state.dag_id}`;
          const promptText = currentNode
            ? withDescription(
                readPrompt(
                  currentNode.prompt,
                  resolveWorktree(context),
                  sessionPath,
                  {
                    plan_name: state.plan_name,
                    planning_session_id: state.planning_session_id,
                  },
                ),
                currentNode.description,
              )
            : "(prompt not found)";

          const todoProgress = currentNode
            ? currentNode.enforcement
                .map((t, i) => `  ${i < state.todo_index ? "[x]" : "[ ]"} ${t}`)
                .join("\n")
            : "  (no enforcement items)";

          const decisionsLog =
            state.decisions.length > 0
              ? state.decisions
                  .map((d) => `- [${d.node_id}] ${d.summary}`)
                  .join("\n")
              : "None yet";

          let result = divergenceWarning + `DAG Session Recovery\n\n`;
          result += `DAG: ${state.dag_id}\n`;
          result += `Status: ${state.status}\n`;
          result += `Started: ${state.started_at}\n\n`;
          result += `Decisions Made:\n${decisionsLog}\n\n`;
          result += `Current Node: ${state.current_node}\n`;
          result += `Todo progress:\n${todoProgress}\n\n`;
          result += `Current Node Prompt:\n\n${promptText}\n`;

          if (currentNode?.children && currentNode.children.length > 1) {
            const choices = currentNode.children.join(", ");
            result += `\nPending Branch Choice: [${choices}]\n`;
          }

          return result;
        },
      }),

      exit_plan: tool({
        description:
          "Abandon the current DAG session. Sets status to 'abandoned' and saves state. Use when a session needs to be exited due to a bug, user cancellation, or scope change.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session found. Nothing to exit.";
          if (state.status === "complete") {
            return `DAG session "${state.dag_id}" is already complete. Nothing to abandon.`;
          }
          if (state.status === "abandoned") {
            return `DAG session "${state.dag_id}" is already abandoned. Call recover_context() to resume it.`;
          }

          state.status = "abandoned";
          state.updated_at = now();
          writeState(statePath, state);

          return (
            `DAG session "${state.dag_id}" has been abandoned. ` +
            `State saved at node "${state.current_node}". ` +
            `Call recover_context() to resume from where you left off.`
          );
        },
      }),

      add_first_phase: tool({
        description:
          "Add the first phase to a new plan. Creates the plan file and initializes it with the entry phase. Call this once before any add_phase calls.",
        args: {
          plan_name: tool.schema.string().describe("The plan name (set by choose_plan_name)."),
          phase_id: tool.schema
            .string()
            .describe(
              "Descriptive phase ID encoding position and intent, e.g. '1-research-tui-options'.",
            ),
          phase_type: tool.schema
            .string()
            .describe(
              "Phase type: external-research | internal-research | project-survey | work | project-commands | user-discussion | agentic-decision-gate | write-notes | early-exit",
            ),
          phase_options: tool.schema
            .string()
            .describe("JSON object with the phase's fields as defined in the planning schema."),
        },
        async execute({ plan_name, phase_id, phase_type, phase_options }, context) {
          const worktree = resolveWorktree(context);
          const planDir = path.join(worktree, ".opencode", "session-plans", plan_name);
          const planPath = path.join(planDir, "plan.jsonl");

          if (fs.existsSync(planPath)) {
            throw new Error(
              `Plan '${plan_name}' already has a first phase. Use add_phase to add subsequent phases.`,
            );
          }

          if (!VALID_PHASE_TYPES.has(phase_type)) {
            throw new Error(
              `Invalid phase_type '${phase_type}'. Valid types: ${[...VALID_PHASE_TYPES].join(", ")}.`,
            );
          }

          let opts: Record<string, unknown>;
          try {
            opts = JSON.parse(phase_options);
          } catch {
            throw new Error(`phase_options must be a valid JSON object.`);
          }

          validatePhaseOptions(phase_type, opts);

          fs.mkdirSync(planDir, { recursive: true });

          const metadata: PhaseDagMetadata = {
            schema_version: "4.0",
            id: plan_name,
            entry_phase_id: phase_id,
          };
          const firstPhase: PhaseRecord = {
            phase: phase_id,
            phase_type: phase_type as any,
            phase_options: opts,
            children: [],
          };
          writePhaseDag(planPath, metadata, [firstPhase]);

          return `Phase '${phase_id}' added as the first phase of plan '${plan_name}'.`;
        },
      }),

      add_phase: tool({
        description:
          "Add a phase to an existing plan and wire it to its parent phase(s). Call add_first_phase before this.",
        args: {
          plan_name: tool.schema.string().describe("The plan name."),
          phase_id: tool.schema
            .string()
            .describe(
              "Descriptive phase ID encoding position and intent, e.g. '2a-implement-auth'.",
            ),
          phase_type: tool.schema
            .string()
            .describe(
              "Phase type: external-research | internal-research | project-survey | work | project-commands | user-discussion | agentic-decision-gate | write-notes | early-exit",
            ),
          phase_options: tool.schema
            .string()
            .describe("JSON object with the phase's fields as defined in the planning schema."),
          from: tool.schema
            .string()
            .describe(
              "Parent phase ID, or JSON array of parent phase IDs for convergence, e.g. '[\"2a-impl\", \"2b-impl\"]'.",
            ),
        },
        async execute({ plan_name, phase_id, phase_type, phase_options, from }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree, ".opencode", "session-plans", plan_name, "plan.jsonl",
          );

          if (!fs.existsSync(planPath)) {
            throw new Error(`Plan '${plan_name}' not found. Call add_first_phase first.`);
          }

          const schemaVersion = detectSchemaVersion(planPath);
          if (schemaVersion !== "4.0") {
            throw new Error(`Plan '${plan_name}' is not a phase-based plan (schema 4.0).`);
          }

          if (!VALID_PHASE_TYPES.has(phase_type)) {
            throw new Error(
              `Invalid phase_type '${phase_type}'. Valid types: ${[...VALID_PHASE_TYPES].join(", ")}.`,
            );
          }

          let opts: Record<string, unknown>;
          try {
            opts = JSON.parse(phase_options);
          } catch {
            throw new Error(`phase_options must be a valid JSON object.`);
          }

          validatePhaseOptions(phase_type, opts);

          // Parse `from` — single ID string or JSON array
          let parentIds: string[];
          const trimmed = from.trim();
          if (trimmed.startsWith("[")) {
            try {
              parentIds = JSON.parse(trimmed);
            } catch {
              throw new Error(`'from' must be a phase ID or a JSON array of phase IDs.`);
            }
          } else {
            parentIds = [trimmed];
          }

          const { metadata, phases } = readPhaseDag(planPath);

          // Validate all parent phases exist
          const phaseIds = new Set(phases.map((p) => p.phase));
          for (const parentId of parentIds) {
            if (!phaseIds.has(parentId)) {
              throw new Error(`Parent phase '${parentId}' not found in plan '${plan_name}'.`);
            }
          }

          // Validate branching rules on each parent
          for (const parentId of parentIds) {
            const parent = phases.find((p) => p.phase === parentId)!;
            const isBranchingType = BRANCHING_PHASE_TYPE_SET.has(parent.phase_type);
            if (!isBranchingType && parent.children.length >= 1) {
              throw new Error(
                `Phase '${parentId}' (${parent.phase_type}) already has a child. ` +
                  `Only agentic-decision-gate and user-discussion may have multiple children.`,
              );
            }
          }

          // Add the new phase
          const newPhase: PhaseRecord = {
            phase: phase_id,
            phase_type: phase_type as any,
            phase_options: opts,
            children: [],
          };
          phases.push(newPhase);

          // Wire each parent to this new phase
          for (const parentId of parentIds) {
            const parent = phases.find((p) => p.phase === parentId)!;
            if (!parent.children.includes(phase_id)) {
              parent.children.push(phase_id);
            }
          }

          writePhaseDag(planPath, metadata, phases);

          const fromDisplay =
            parentIds.length === 1 ? `'${parentIds[0]}'` : `[${parentIds.map((id) => `'${id}'`).join(", ")}]`;
          return `Phase '${phase_id}' added to plan '${plan_name}', connected from ${fromDisplay}.`;
        },
      }),

    },

    // ── Hooks ────────────────────────────────────────────────────────────────

    // Validate arguments for tools that small models frequently misuse.
    // This runs before OpenCode's own zod validation to produce a clear,
    // actionable error instead of a raw schema dump.
    "tool.execute.before": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      // --- Intercept task tool with incorrect or missing arguments ---
      if (input.tool === "task") {
        const args = output.args as Record<string, unknown> | undefined;
        const hasCommand = args && "command" in args;
        const missingPrompt = !args?.prompt;
        const missingDescription = !args?.description;
        const missingSubagentType = !args?.subagent_type;

        if (hasCommand || missingPrompt || missingDescription || missingSubagentType) {
          const issues: string[] = [];
          if (hasCommand) issues.push('use "prompt" not "command" for the delegation text');
          if (missingPrompt) issues.push('"prompt" is required');
          if (missingDescription) issues.push('"description" is required (3-5 word UX label)');
          if (missingSubagentType) issues.push('"subagent_type" is required');

          throw new Error(
            `task called incorrectly — ${issues.join("; ")}.\n\n` +
            `Correct schema:\n` +
            `  task(description="...", prompt="...", subagent_type="...")\n\n` +
            `When re-delegating to an existing subagent instance:\n` +
            `  task(description="...", prompt="...", subagent_type="...", session_id="...")`
          );
        }
        // args are valid — fall through to enforcement tracking
      }

      // --- Handle plan_session: create state + inject entry prompt ---
      if (input.tool === "plan_session") {
        const worktree = resolveWorktree(_ctx);
        const { localPlanPath, metadata, nodes } = copyPlanningDag(
          "plan-session",
          input.sessionID,
          worktree,
        );
        const plan_name = `plan-session-${input.sessionID}`;
        const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
        for (const node of nodes) {
          if (!node.prompt.includes("/"))
            node.prompt = `${promptsPrefix}${node.prompt}`;
        }
        const nodeMap = flattenTreeV3(metadata, nodes);
        const entryNode = nodeMap[metadata.entry_node_id];
        if (!entryNode)
          throw new Error(
            `Entry node "${metadata.entry_node_id}" not found in DAG`,
          );

        const statePath = dagStatePath(worktree, input.sessionID);
        const state: DagSessionState = {
          dag_id: metadata.id,
          plan_path: localPlanPath,
          status: "running",
          current_node: metadata.entry_node_id,
          todo_index: 0,
          started_at: now(),
          updated_at: now(),
          decisions: [],
          node_map: nodeMap,
          planning_session_id: plan_name,
        };
        writeState(statePath, state);

        if (entryNode.enforcement.length === 0) {
          const hasNext = entryNode.children && entryNode.children.length > 0;
          state.status = hasNext ? "waiting_step" : "complete";
          writeState(statePath, state);
        }

        return;
      }

      // --- Handle activate_plan: create state ---
      if (input.tool === "activate_plan") {
        const plan_name = output.args?.plan_name as string;
        if (!plan_name) throw new Error("plan_name is required");

        const worktree = resolveWorktree(_ctx);
        const planPath = path.join(
          worktree,
          ".opencode",
          "session-plans",
          plan_name,
          "plan.jsonl",
        );

        // Detect schema version and compile if phase-based (4.0)
        const schemaVersion = detectSchemaVersion(planPath);
        let metadata: DagMetadataV3;
        let nodeMap: Record<string, import("./types").FlatNode>;

        if (schemaVersion === "4.0") {
          // Phase-based plan: compile phases → nodes at activation time
          const { metadata: phaseMeta, phases } = readPhaseDag(planPath);
          const compiled = compilePhasesToNodes(plan_name, phases, phaseMeta.entry_phase_id);
          metadata = compiled.metadata;
          nodeMap = flattenTreeV3(compiled.metadata, compiled.nodes);
        } else {
          // Node-based plan (schema 3.0): use directly
          const dagData = readDagV3(planPath);
          metadata = dagData.metadata;
          const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
          for (const node of dagData.nodes) {
            if (!node.prompt.includes("/")) {
              node.prompt = `${promptsPrefix}${node.prompt}`;
            }
          }
          nodeMap = flattenTreeV3(dagData.metadata, dagData.nodes);
        }

        const entryNode = nodeMap[metadata.entry_node_id];
        if (!entryNode) {
          throw new Error(
            `Entry node "${metadata.entry_node_id}" not found in DAG "${plan_name}"`,
          );
        }

        const statePath = dagStatePath(worktree, input.sessionID);
        const state: DagSessionState = {
          dag_id: metadata.id,
          plan_path: planPath,
          status: "running",
          current_node: metadata.entry_node_id,
          todo_index: 0,
          started_at: now(),
          updated_at: now(),
          decisions: [],
          node_map: nodeMap,
          plan_name: plan_name,
        };
        writeState(statePath, state);

        if (entryNode.enforcement.length === 0) {
          if (entryNode.children && entryNode.children.length > 0) {
            state.status = "waiting_step";
            writeState(statePath, state);
          } else {
            state.status = "complete";
            writeState(statePath, state);
          }
        }

        return;
      }

      // --- Handle present_plan_diagram: render phase-based plan for user ---
      if (input.tool === "present_plan_diagram") {
        const plan_name = output.args?.plan_name as string;
        if (!plan_name) throw new Error("plan_name is required");

        const worktree = resolveWorktree(_ctx);
        const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");

        const { metadata: phaseMeta, phases } = readPhaseDag(planPath);
        const lines = [`Plan: ${phaseMeta.id}`, ""];
        for (const phase of phases) {
          const childStr = phase.children.length === 0
            ? "(terminal)"
            : phase.children.length === 1
              ? `→ ${phase.children[0]}`
              : `→ [${phase.children.join(", ")}]`;
          lines.push(`(${phase.phase}) [${phase.phase_type}] ${childStr}`);
        }

        client.session.prompt({
          path: { id: input.sessionID },
          body: {
            parts: [{ type: "text", text: lines.join("\n") }],
            noReply: true,
          },
        });
        return;
      }

      // --- Handle next_step: validate + inject prompt ---
      // Throws on invalid calls so the tool never executes.
      // On valid calls: reads the next node prompt and injects it.
      // State transitions happen in execute.
      if (input.tool === "next_step") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);

        if (!state) {
          throw new Error(
            "No active DAG session. Start one with plan_session() or activate_plan().",
          );
        }
        if (state.status === "complete") {
          throw new Error("DAG session is already complete.");
        }
        if (state.status !== "waiting_step") {
          const currentNode = state.node_map[state.current_node];
          const remaining = currentNode
            ? currentNode.enforcement.length - state.todo_index
            : 0;
          const nextExpected = currentNode
            ? (currentNode.enforcement[state.todo_index] ?? "none")
            : "unknown";
          throw new Error(
            `Cannot call next_step — node "${state.current_node}" still has ${remaining} enforcement item(s) pending. ` +
              `Next expected tool: "${nextExpected}". Call "${nextExpected}" to continue, ` +
              `then call next_step when all enforcement items are complete.`,
          );
        }

        const node = state.node_map[state.current_node];
        if (!node) {
          throw new Error(
            `Current node "${state.current_node}" not found in DAG.`,
          );
        }

        const children = node.children ?? [];

        // Terminal — no prompt to inject, execute handles completion
        if (children.length === 0) {
          return;
        }

        // Branching — validate the `next` parameter
        const next = output.args?.next as string | undefined;
        if (children.length > 1) {
          if (!next) {
            throw new Error(
              `[BRANCH REQUIRED] Node "${state.current_node}" has multiple children.\n` +
                `Call next_step with the next parameter. Valid options: [${children.join(", ")}].`,
            );
          }
          if (!children.includes(next)) {
            throw new Error(
              `Invalid branch "${next}". Valid options: [${children.join(", ")}]`,
            );
          }
        }

        // Resolve the next node — validate it exists
        const nextId = children.length === 1 ? children[0] : next!;
        const nextNode = state.node_map[nextId];
        if (!nextNode)
          throw new Error(`Next node "${nextId}" not found in DAG`);

        return;
      }

      if (isExempt(input.tool)) return;

      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;
      if (state.status === "complete" || state.status === "abandoned") return;

      if (state.status === "waiting_step") {
        throw new Error(
          `[DAG BLOCKED] All required calls for node "${state.current_node}" are complete.\n` +
            `Call next_step to advance to the next node.`,
        );
      }

      // status === "running" from here
      const node = state.node_map[state.current_node];
      if (!node || node.enforcement.length === 0) return;

      const expectedTool = node.enforcement[state.todo_index];
      if (!expectedTool) return;

      if (input.tool !== expectedTool) {
        if (isExempt(input.tool)) return;
        throw new Error(
          `[DAG BLOCKED] Cannot call ${input.tool} — prerequisite not met.\n` +
            `Call ${expectedTool} first to continue.`,
        );
      }
    },

    // Track tool calls, auto-advance enforcement, and inject prompts after successful execution.
    "tool.execute.after": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      // Skip if the tool call failed.
      if (!output) return;
      if (output.error) return;

      // --- Prompt injection for DAG-driving tools ---
      // These run after successful tool execution. The before hook already
      // validated and created state; we just need to inject the prompt.

      if (input.tool === "plan_session") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);
        if (!state) return;

        const entryNode = state.node_map[state.current_node];
        if (!entryNode) return;

        const sessionPath = `.opencode/session-plans/${state.planning_session_id}`;
        const promptText = readPrompt(entryNode.prompt, worktree, sessionPath, {
          planning_session_id: state.planning_session_id,
        });

        client.session.prompt({
          path: { id: input.sessionID },
          body: { parts: [{ type: "text", text: promptText }] },
        });
        return;
      }

      if (input.tool === "activate_plan") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);
        if (!state) return;

        const entryNode = state.node_map[state.current_node];
        if (!entryNode) return;

        const sessionPath = `.opencode/session-plans/${state.plan_name}`;
        const promptText = withDescription(
          readPrompt(entryNode.prompt, worktree, sessionPath, {
            plan_name: state.plan_name,
          }),
          entryNode.description,
        );

        client.session.prompt({
          path: { id: input.sessionID },
          body: { parts: [{ type: "text", text: promptText }] },
        });
        return;
      }

      if (input.tool === "next_step") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);
        if (!state) return;

        // When status is "complete" after a next_step call, there are two cases:
        //   1. True terminal: next_step was called on a node with no children — the execute
        //      handler completed the session and already returned "PLANNING SESSION COMPLETE".
        //      No prompt injection needed.
        //   2. Passthrough terminal: next_step advanced to a zero-enforcement leaf node
        //      (e.g. plan-success). The execute handler set status="complete" immediately via
        //      the passthrough block, but the node's prompt has not been injected yet.
        //      We MUST inject it so the agent sees the node instructions.
        //
        // Distinguishing factor: in case (1) the current node has enforcement items (it just
        // exhausted them). In case (2) the current node has zero enforcement (passthrough).
        if (state.status === "complete") {
          const currentNode = state.node_map[state.current_node];
          // True terminal — no injection needed
          if (!currentNode || currentNode.enforcement.length > 0) return;
          // Passthrough terminal — fall through to inject its prompt below
        }

        const currentNode = state.node_map[state.current_node];
        if (!currentNode) return;

        const sessionPath = `.opencode/session-plans/${state.plan_name ?? state.planning_session_id ?? state.dag_id}`;
        const promptText = withDescription(
          readPrompt(currentNode.prompt, worktree, sessionPath, {
            plan_name: state.plan_name,
            planning_session_id: state.planning_session_id,
          }),
          currentNode.description,
        );

        client.session.prompt({
          path: { id: input.sessionID },
          body: { parts: [{ type: "text", text: promptText }] },
        });
        return;
      }

      // // --- Inject DAG draft diagram tip for DAG-editing tools ---
      // const DAG_EDITING_TOOLS = new Set([
      //   "connect_nodes",
      //   "delete_node",
      //   "delete_edge",
      //   "insert_between",
      //   "set_entry_point",
      //   "set_exit_point",
      //   "reset_entry_exit_points",
      // ]);
      // if (DAG_EDITING_TOOLS.has(input.tool)) {
      //   client.session.prompt({
      //     path: { id: input.sessionID },
      //     body: {
      //       parts: [
      //         {
      //           type: "text",
      //           text: "**Useful Tip!** Reload your DAG skills often as a refresher! (This message was auto generated.)",
      //         },
      //       ],
      //     },
      //   });
      // }

      // --- Enforcement tracking for all other tools ---
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;
      if (state.status === "complete" || state.status === "abandoned") return;

      const node = state.node_map[state.current_node];
      if (!node || node.enforcement.length === 0) return;

      // Check if this tool call matches the expected enforcement item
      const expectedTool = node.enforcement[state.todo_index];
      if (!expectedTool) return;

      // Exempt tools skip tracking unless they ARE the currently expected enforcement item.
      // This allows "question" in an enforcement[] to advance todo_index normally.
      const isExpectedTodo = expectedTool === input.tool;
      if (isExempt(input.tool) && !isExpectedTodo) return;

      if (input.tool === expectedTool) {
        state.todo_index += 1;
        state.updated_at = now();

        // Check if all enforcement items exhausted — flip to waiting_step so next_step() can run
        if (state.todo_index >= node.enforcement.length) {
          state.status = "waiting_step";
          state.updated_at = now();
          writeState(statePath, state);
        } else {
          writeState(statePath, state);
        }
      }
    },

    // Cache whether a DAG is active for this session turn.
    // Must run before experimental.chat.system.transform (which has no sessionID).
    "chat.params": async (input, _output) => {
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);
      _dagActiveThisTurn =
        state !== null &&
        state.status !== "complete" &&
        state.status !== "abandoned";
    },

    // Inject DAG state into compaction context for recovery.
    "experimental.session.compacting": async (input, output) => {
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;

      const node = state.node_map[state.current_node];
      const todoProgress = node
        ? node.enforcement
            .map(
              (t, i) => `${i < state.todo_index ? "[done]" : "[pending]"} ${t}`,
            )
            .join(", ")
        : "none";

      const decisionsLog =
        state.decisions.length > 0
          ? state.decisions.map((d) => `${d.node_id}: ${d.summary}`).join("; ")
          : "none";

      output.context.push(
        `ACTIVE DAG SESSION: ${state.dag_id} | ` +
          `Current node: ${state.current_node} | ` +
          `Status: ${state.status} | ` +
          `Todo: ${todoProgress} | ` +
          `Decisions: ${decisionsLog} | ` +
          `Call recover_context() to reload full state.`,
      );
    },
  };
};
