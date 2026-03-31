import * as fs from "fs";
import * as path from "path";
import type { PlanDag, DagSessionState } from "./types";
import { dagStatePath, writeState, readState, now } from "./state-io";
import { expandPath, readPrompt } from "./path-utils";
import { flattenTree, rewritePromptPaths } from "./dag-tree";
import { CONFIG_ROOT } from "./constants";

// ─── Copy planning DAG to local ──────────────────────────────────────────────

export function copyPlanningDag(
  planType: string,
  sessionId: string,
  worktree: string,
  configRoot: string = CONFIG_ROOT,
): { localPlanPath: string; dag: PlanDag } {
  const srcDir = path.join(configRoot, "planning", planType);
  const destDirName = `${planType}-${sessionId}`;
  const destDir = path.join(worktree, ".opencode", "session-plans", destDirName);
  const srcPromptsDir = path.join(srcDir, "prompts");
  const destPromptsDir = path.join(destDir, "prompts");

  fs.mkdirSync(destPromptsDir, { recursive: true });

  // Resolved session path used for placeholder substitution in prompt files
  const sessionPath = `.opencode/session-plans/${destDirName}`;

  // Helper: copy a directory recursively
  function copyDirRecursive(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcEntry = path.join(src, entry.name);
      const destEntry = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirRecursive(srcEntry, destEntry);
      } else {
        fs.copyFileSync(srcEntry, destEntry);
      }
    }
  }

  // Helper: copy a prompt file with {{SESSION_PATH}} substitution
  function copyPromptFile(src: string, dest: string): void {
    const content = fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, content.replaceAll("{{SESSION_PATH}}", sessionPath), "utf-8");
  }

  // Copy all prompt files (with substitution)
  if (fs.existsSync(srcPromptsDir)) {
    for (const file of fs.readdirSync(srcPromptsDir)) {
      copyPromptFile(path.join(srcPromptsDir, file), path.join(destPromptsDir, file));
    }
  }

  // Copy reference docs if present (with substitution)
  const refDir = path.join(configRoot, "planning", "reference");
  if (fs.existsSync(refDir)) {
    const destRefDir = path.join(destDir, "reference");
    fs.mkdirSync(destRefDir, { recursive: true });
    for (const file of fs.readdirSync(refDir)) {
      copyPromptFile(path.join(refDir, file), path.join(destRefDir, file));
    }
  }

  // Copy node-library if present (plain copy, no substitution needed)
  const srcNodeLibDir = path.join(srcDir, "node-library");
  if (fs.existsSync(srcNodeLibDir)) {
    copyDirRecursive(srcNodeLibDir, path.join(destDir, "node-library"));
  }

  // Read and rewrite DAG prompt paths
  const srcPlanPath = path.join(srcDir, "plan.json");
  const dag: PlanDag = JSON.parse(fs.readFileSync(srcPlanPath, "utf-8"));
  const localPrefix = `.opencode/session-plans/${destDirName}/prompts/`;
  rewritePromptPaths(dag.entry, localPrefix);

  const localPlanPath = path.join(destDir, "plan.json");
  fs.writeFileSync(localPlanPath, JSON.stringify(dag, null, 2), "utf-8");

  return { localPlanPath, dag };
}

// ─── Activation ──────────────────────────────────────────────────────────────

export function activateDag(
  dag: PlanDag,
  planPath: string,
  sessionId: string,
  worktree: string,
): string {
  const nodeMap = flattenTree(dag.entry);
  const entryNode = nodeMap[dag.entry.id];
  if (!entryNode) {
    return `Error: entry node "${dag.entry.id}" not found in DAG "${dag.id}"`;
  }

  const statePath = dagStatePath(worktree, sessionId);
  const state: DagSessionState = {
    dag_id: dag.id,
    plan_path: planPath,
    status: "running",
    current_node: dag.entry.id,
    todo_index: 0,
    started_at: now(),
    updated_at: now(),
    decisions: [],
    node_map: nodeMap,
  };
  writeState(statePath, state);

  const promptText = readPrompt(entryNode.prompt, worktree);
  let result = `DAG "${dag.id}" activated. Starting at node: ${dag.entry.id}.\n\n---\n\n${promptText}`;

   // If entry node has empty todo, set waiting_step status and ask for next_step
   if (entryNode.todo.length === 0) {
     const hasNext = entryNode.nextLinear || (entryNode.branches && entryNode.branches.length > 0);
     if (hasNext) {
       state.status = "waiting_step";
       writeState(statePath, state);
       result += `\n\n---\n\nNo todos for this node. When you're ready, call \`next_step()\` to advance.`;
    } else {
      // Terminal node with no todos
      const advanceResult = autoAdvance(state, statePath, worktree);
      if (advanceResult) {
        result += `\n\n---\n\n${advanceResult}`;
      }
    }
  }

  return result;
}

// ─── Auto-advance logic ──────────────────────────────────────────────────────

export function autoAdvance(
  state: DagSessionState,
  statePath: string,
  worktree: string,
): string | null {
  const node = state.node_map[state.current_node];
  if (!node) return null;

   // Linear next — do NOT auto-advance; require explicit next_step()
   if (node.nextLinear) {
     state.status = "waiting_step";
     state.updated_at = now();
     writeState(statePath, state);

     return `All todos complete. When you're ready, call \`next_step()\` to advance to the next node.`;
  }

  // Branching — present choices and require next_step()
  if (node.branches && node.branches.length > 0) {
    state.status = "waiting_step";
    state.updated_at = now();
    writeState(statePath, state);

     const choices = node.branches
       .map((b, i) => `${i + 1}. **${b.nodeId}** — ${b.when}`)
       .join("\n");

     return `All todos complete. Choose next path:\n\n${choices}\n\nWhen you're ready, call \`next_step({ next: "<node-id>" })\` to continue.`;
  }

  // Terminal — close session
  state.status = "complete";
  state.updated_at = now();
  writeState(statePath, state);

   return `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
     `---\n\n` +
     `**PLANNING SESSION COMPLETE.** Do NOT continue executing tasks. ` +
     `Present a summary of what was produced to the user. ` +
     `If a project DAG was written, tell the user they can activate it with \`/activate-plan {plan-name}\`.`;
}
