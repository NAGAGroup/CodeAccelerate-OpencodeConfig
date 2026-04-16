import { tool } from "@opencode-ai/plugin";
import type { PluginDeps } from "../deps";
import { dagStatePath, readState, writeState, now } from "../../state-io";
import { readPrompt } from "../../path-utils";
import { readDagV3 } from "../../dag-io";
import { detectDivergence, suggestRecoveryActions } from "../../divergence-detection";

export function createNavigationTools(deps: PluginDeps) {
  const { resolveWorktree } = deps;

  return {
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
        const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
        const state = readState(statePath);

        if (!state) return "No active DAG session.";

        const node = state.node_map[state.current_node];
        if (!node) return `Current node "${state.current_node}" not found in DAG.`;

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
        if (!nextNode) throw new Error(`Next node "${nextId}" not found in DAG`);

        state.current_node = nextId;
        state.todo_index = 0;
        state.status = "running";
        state.updated_at = now();
        writeState(statePath, state);

        // Handle zero-enforcement nodes (passthrough)
        if (nextNode.enforcement.length === 0) {
          const nextChildren = nextNode.children ?? [];
          state.status = nextChildren.length > 0 ? "waiting_step" : "complete";
          writeState(statePath, state);
        }

        // Build status message
        const { metadata } = readDagV3(state.plan_path);
        const isFromEntryNode = node.id === metadata.entry_node_id;

        let result = "";
        if (!isFromEntryNode) result += `You have just completed "${node.id}". `;
        result += `Please wait for your next task.`;

        return result;
      },
    }),

    get_branch_options: tool({
      description:
        "Returns the branch phase options available for next_step at the current branching node. Call this before making a routing decision to know the valid options.",
      args: {},
      async execute(_args, context) {
        const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
        const state = readState(statePath);

        if (!state) return "No active DAG session.";

        const node = state.node_map[state.current_node];
        if (!node) return `Current node "${state.current_node}" not found in DAG.`;

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
        const worktree = resolveWorktree(context);
        const statePath = dagStatePath(worktree, context.sessionID);
        const state = readState(statePath);

        if (!state) return "No active DAG session found.";

        // Detect divergence
        const divergenceReport = detectDivergence(state);
        let divergenceWarning = "";
        if (divergenceReport.hasDivergence) {
          divergenceWarning = "DIVERGENCE DETECTED\n\n";
          for (const issue of divergenceReport.issues) {
            divergenceWarning += `[${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}\n\n`;
          }
          const suggestions = suggestRecoveryActions(divergenceReport);
          divergenceWarning += "Suggested Recovery Actions:\n";
          suggestions.forEach((s) => { divergenceWarning += `${s}\n`; });
          divergenceWarning += "\n";
        }

        // Resume abandoned session
        if (state.status === "abandoned") {
          const node = state.node_map[state.current_node];
          const remaining = node ? node.enforcement.length - state.todo_index : 0;
          state.status = remaining === 0 ? "waiting_step" : "running";
          state.updated_at = now();
          writeState(statePath, state);
        }

        const currentNode = state.node_map[state.current_node];
        const sessionPath = `.opencode/session-plans/${state.dag_id}`;
        const promptText = currentNode
          ? readPrompt(currentNode.prompt, worktree, sessionPath, {
              plan_name: state.plan_name,
              planning_session_id: state.planning_session_id,
              inject: currentNode.inject,
            })
          : "(prompt not found)";

        const todoProgress = currentNode
          ? currentNode.enforcement
              .map((t, i) => `  ${i < state.todo_index ? "[x]" : "[ ]"} ${t}`)
              .join("\n")
          : "  (no enforcement items)";

        const decisionsLog =
          state.decisions.length > 0
            ? state.decisions.map((d) => `- [${d.node_id}] ${d.summary}`).join("\n")
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
          result += `\nPending Branch Choice: [${currentNode.children.join(", ")}]\n`;
        }

        return result;
      },
    }),

    exit_plan: tool({
      description:
        "Abandon the current DAG session. Sets status to 'abandoned' and saves state. Use when a session needs to be exited due to a bug, user cancellation, or scope change.",
      args: {},
      async execute(_args, context) {
        const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
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
  };
}
