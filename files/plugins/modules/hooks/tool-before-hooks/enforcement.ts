import type { PluginDeps } from "../../deps";
import { dagStatePath, readState } from "../../../state-io";
import { isExempt } from "../../../constants";
import { isOptional, getToolName, allRemainingOptional } from "../../dag_engine/enforcement-utils";

/**
 * Generic enforcement handler — runs FIRST in the before-hook pipeline.
 * Blocks tools that aren't the currently expected enforcement item.
 * Supports "optional:" prefixed items which can be called or skipped.
 */
export async function handleEnforcementBefore(
  input: any,
  _output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (isExempt(input.tool)) return false;

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  const statePath = dagStatePath(worktree, input.sessionID);
  const state = readState(statePath);

  if (!state) return false;
  if (state.status === "complete" || state.status === "abandoned") return false;

  const node = state.node_map[state.current_node];
  if (!node || node.enforcement.length === 0) return false;

  if (state.status === "waiting_step") {
    // In waiting_step, only allow calling optional items still pending at todo_index.
    // Any other non-exempt tool should be blocked.
    const pendingItem = node.enforcement[state.todo_index];
    if (
      pendingItem &&
      isOptional(pendingItem) &&
      getToolName(pendingItem) === input.tool
    ) {
      return false; // allow calling the optional item
    }
    throw new Error(
      `[DAG BLOCKED] All required calls for node "${state.current_node}" are complete.\n` +
        `Call next_step to advance to the next node.`,
    );
  }

  // status === "running"
  const currentItem = node.enforcement[state.todo_index];
  if (!currentItem) return false;

  const currentToolName = getToolName(currentItem);

  // Direct match at current position (optional or mandatory)
  if (input.tool === currentToolName) return false;

  if (isOptional(currentItem)) {
    // Current item is optional and the called tool isn't it — find the next mandatory item.
    let nextMandatoryIdx = state.todo_index + 1;
    while (
      nextMandatoryIdx < node.enforcement.length &&
      isOptional(node.enforcement[nextMandatoryIdx])
    ) {
      nextMandatoryIdx++;
    }

    if (nextMandatoryIdx >= node.enforcement.length) {
      // All remaining are optional — nothing mandatory left to call.
      // next_step handles this via allRemainingOptional check; non-exempt others are blocked.
      throw new Error(
        `[DAG BLOCKED] All required calls for node "${state.current_node}" are complete.\n` +
          `Call next_step to advance to the next node.`,
      );
    }

    const nextMandatoryTool = getToolName(node.enforcement[nextMandatoryIdx]);
    if (input.tool === nextMandatoryTool) return false; // skipping the optional item
  }

  throw new Error(
    `[DAG BLOCKED] Cannot call ${input.tool} — prerequisite not met.\n` +
      `Call ${currentToolName} first to continue.`,
  );
}
