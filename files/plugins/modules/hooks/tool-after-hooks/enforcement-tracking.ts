import type { PluginDeps } from "../../deps";
import { dagStatePath, readState, writeState, now } from "../../../state-io";
import { isExempt } from "../../../constants";
import { getToolName, isOptional } from "../../dag_engine/enforcement-utils";

/**
 * Tracks enforcement progress for all tool calls not handled by a specific after-hook.
 * Advances todo_index when the expected enforcement tool is called, including support for
 * skipping optional items when a mandatory item further in the sequence is called.
 */
export async function handleEnforcementTrackingAfter(
  input: any,
  _output: any,
  deps: PluginDeps,
): Promise<boolean> {
  const worktree = deps.resolveWorktree(deps.pluginCtx);
  const statePath = dagStatePath(worktree, input.sessionID);
  const state = readState(statePath);

  if (!state) return false;
  if (state.status === "complete" || state.status === "abandoned") return false;

  const node = state.node_map[state.current_node];
  if (!node || node.enforcement.length === 0) return false;

  // Check if this tool matches the expected item at todo_index (accounting for "optional:" prefix).
  const expectedToolName = getToolName(node.enforcement[state.todo_index] ?? "");
  const isExpectedTodo = expectedToolName === input.tool;

  // Exempt tools skip tracking unless they ARE the currently expected enforcement item.
  if (isExempt(input.tool) && !isExpectedTodo) return false;

  // Scan forward from todo_index to find where this tool matches in the enforcement list.
  // This handles the case where optional items were skipped.
  let matchIndex = state.todo_index;
  while (
    matchIndex < node.enforcement.length &&
    getToolName(node.enforcement[matchIndex]) !== input.tool
  ) {
    matchIndex++;
  }

  if (matchIndex < node.enforcement.length && getToolName(node.enforcement[matchIndex]) === input.tool) {
    state.todo_index = matchIndex + 1;
    state.updated_at = now();

    if (state.todo_index >= node.enforcement.length) {
      state.status = "waiting_step";
    }
    writeState(statePath, state);
  }

  return false; // never short-circuits — tracking is always passive
}
