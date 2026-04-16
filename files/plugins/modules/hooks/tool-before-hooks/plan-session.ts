import type { PluginDeps } from "../../deps";
import { dagStatePath, writeState, now } from "../../../state-io";
import { copyPlanningDag } from "../../../dag-lifecycle";
import { flattenTreeV3 } from "../../../dag-tree";
import type { DagSessionState } from "../../../types";
import { ensureGrepai } from "./grepai-lifecycle";

export async function handlePlanSessionBefore(
  input: any,
  _output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "plan_session") return false;

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  ensureGrepai(worktree);
  const { localPlanPath, metadata, nodes } = copyPlanningDag(
    "plan-session",
    input.sessionID,
    worktree,
  );
  const plan_name = `plan-session-${input.sessionID}`;
  const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
  for (const node of nodes) {
    if (!node.prompt.includes("/")) node.prompt = `${promptsPrefix}${node.prompt}`;
  }
  const nodeMap = flattenTreeV3(metadata, nodes);
  const entryNode = nodeMap[metadata.entry_node_id];
  if (!entryNode) throw new Error(`Entry node "${metadata.entry_node_id}" not found in DAG`);

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

  return true;
}
