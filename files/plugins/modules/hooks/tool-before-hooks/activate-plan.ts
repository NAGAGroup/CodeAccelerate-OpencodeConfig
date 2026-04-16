import type { PluginDeps } from "../../deps";
import { dagStatePath, writeState, now } from "../../../state-io";
import { recompilePlan } from "../../dag_engine/compiler";
import type { DagSessionState } from "../../../types";
import { ensureGrepai } from "./grepai-lifecycle";

export async function handleActivatePlanBefore(
  input: any,
  output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "activate_plan") return false;

  const plan_name = output.args?.plan_name as string;
  if (!plan_name) throw new Error("plan_name is required");

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  ensureGrepai(worktree);
  const { compiledPlanPath, metadata, nodeMap } = recompilePlan(plan_name, worktree);

  const entryNode = nodeMap[metadata.entry_node_id];
  if (!entryNode) {
    throw new Error(
      `Entry node "${metadata.entry_node_id}" not found in DAG "${plan_name}"`,
    );
  }

  const statePath = dagStatePath(worktree, input.sessionID);
  const state: DagSessionState = {
    dag_id: metadata.id,
    plan_path: compiledPlanPath,
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
    state.status =
      entryNode.children && entryNode.children.length > 0
        ? "waiting_step"
        : "complete";
    writeState(statePath, state);
  }

  return true;
}
