import type { PluginDeps } from "../deps";
import { dagStatePath, readState } from "../../state-io";

export function createSessionHooks(deps: PluginDeps) {
  return {
    "chat.params": async (input: any, _output: any) => {
      const worktree = deps.resolveWorktree(deps.pluginCtx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);
      deps.setDagActiveThisTurn(
        state !== null &&
          state.status !== "complete" &&
          state.status !== "abandoned",
      );
    },

    "experimental.session.compacting": async (input: any, output: any) => {
      const worktree = deps.resolveWorktree(deps.pluginCtx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;

      const node = state.node_map[state.current_node];
      const todoProgress = node
        ? node.enforcement
            .map((t, i) => `${i < state.todo_index ? "[done]" : "[pending]"} ${t}`)
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
}
