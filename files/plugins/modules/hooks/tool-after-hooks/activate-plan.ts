import type { PluginDeps } from "../../deps";
import { dagStatePath, readState } from "../../../state-io";
import { readPrompt } from "../../../path-utils";

export async function handleActivatePlanAfter(
  input: any,
  _output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "activate_plan") return false;

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  const statePath = dagStatePath(worktree, input.sessionID);
  const state = readState(statePath);
  if (!state) return true;

  const entryNode = state.node_map[state.current_node];
  if (!entryNode) return true;

  const sessionPath = `.opencode/session-plans/${state.plan_name}`;
  const promptText = readPrompt(entryNode.prompt, worktree, sessionPath, {
    plan_name: state.plan_name,
    inject: entryNode.inject,
  });

  deps.client.session.prompt({
    path: { id: input.sessionID },
    body: { parts: [{ type: "text", text: promptText }] },
  });

  return true;
}
