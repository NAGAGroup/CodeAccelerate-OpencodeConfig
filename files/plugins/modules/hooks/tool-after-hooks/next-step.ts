import type { PluginDeps } from "../../deps";
import { dagStatePath, readState } from "../../../state-io";
import { readPrompt } from "../../../path-utils";

export async function handleNextStepAfter(
  input: any,
  _output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "next_step") return false;

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  const statePath = dagStatePath(worktree, input.sessionID);
  const state = readState(statePath);
  if (!state) return true;

  // When status is "complete" after next_step, two cases:
  //   1. True terminal: next_step was called on a node with no children — execute completed the
  //      session and already returned the COMPLETE message. No prompt injection needed.
  //   2. Passthrough terminal: next_step advanced to a zero-enforcement leaf node. The execute
  //      handler set status="complete" immediately, but the node's prompt has not been injected.
  //      We MUST inject it so the agent sees the node instructions.
  //
  // Distinguishing factor: in case (1) the current node has enforcement items (it just exhausted
  // them). In case (2) the current node has zero enforcement (passthrough).
  if (state.status === "complete") {
    const currentNode = state.node_map[state.current_node];
    if (!currentNode || currentNode.enforcement.length > 0) return true;
    // Passthrough terminal — fall through to inject its prompt
  }

  const currentNode = state.node_map[state.current_node];
  if (!currentNode) return true;

  const sessionPath = `.opencode/session-plans/${state.plan_name ?? state.planning_session_id ?? state.dag_id}`;
  const promptText = readPrompt(currentNode.prompt, worktree, sessionPath, {
    plan_name: state.plan_name,
    planning_session_id: state.planning_session_id,
    inject: currentNode.inject,
  });

  deps.client.session.prompt({
    path: { id: input.sessionID },
    body: { parts: [{ type: "text", text: promptText }] },
  });

  return true;
}
