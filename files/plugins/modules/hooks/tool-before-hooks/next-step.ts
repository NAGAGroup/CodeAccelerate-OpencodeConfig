import type { PluginDeps } from "../../deps";
import { dagStatePath, readState } from "../../../state-io";
import { allRemainingOptional } from "../../dag_engine/enforcement-utils";

export async function handleNextStepBefore(
  input: any,
  output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "next_step") return false;

  const worktree = deps.resolveWorktree(deps.pluginCtx);
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

  // Allow next_step if status is waiting_step OR all remaining enforcement items are optional.
  const currentNode = state.node_map[state.current_node];
  const canProceed =
    state.status === "waiting_step" ||
    (currentNode
      ? allRemainingOptional(currentNode.enforcement, state.todo_index)
      : true);

  if (!canProceed) {
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
    throw new Error(`Current node "${state.current_node}" not found in DAG.`);
  }

  const children = node.children ?? [];

  // Terminal — no prompt to inject, execute handles completion
  if (children.length === 0) return true;

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
  if (!nextNode) throw new Error(`Next node "${nextId}" not found in DAG`);

  return true;
}
