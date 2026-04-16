import type { PluginDeps } from "../../deps";
import { dagStatePath, readState } from "../../../state-io";
import { readPrompt } from "../../../path-utils";

export async function handlePlanSessionAfter(
  input: any,
  _output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "plan_session") return false;

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  const statePath = dagStatePath(worktree, input.sessionID);
  const state = readState(statePath);
  if (!state) return true;

  const entryNode = state.node_map[state.current_node];
  if (!entryNode) return true;

  const sessionPath = `.opencode/session-plans/${state.planning_session_id}`;
  const promptText = readPrompt(entryNode.prompt, worktree, sessionPath, {
    planning_session_id: state.planning_session_id,
  });

  deps.client.session.prompt({
    path: { id: input.sessionID },
    body: { parts: [{ type: "text", text: promptText }] },
  });

  return true;
}
