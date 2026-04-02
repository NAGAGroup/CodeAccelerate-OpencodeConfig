import * as fs from "fs";
import * as path from "path";
import type { DagMetadataV3, DagNodeV3 } from "./types";
import { readDagV3, writeDagV3 } from "./dag-io";
import { CONFIG_ROOT } from "./constants";

// ─── Copy planning DAG to local ──────────────────────────────────────────────

export function copyPlanningDag(
  planType: string,
  sessionId: string,
  worktree: string,
  configRoot: string = CONFIG_ROOT,
): { localPlanPath: string; metadata: DagMetadataV3; nodes: DagNodeV3[] } {
  const srcDir = path.join(configRoot, "planning", planType);
  const destDirName = `${planType}-${sessionId}`;
  const destDir = path.join(worktree, ".opencode", "session-plans", destDirName);
  const srcPromptsDir = path.join(srcDir, "prompts");
  const destPromptsDir = path.join(destDir, "prompts");

  fs.mkdirSync(destPromptsDir, { recursive: true });

  // Resolved session path used for placeholder substitution in prompt files
  const sessionPath = `.opencode/session-plans/${destDirName}`;

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

  // NOTE: node-library is NOT copied here. It is read directly from CONFIG_ROOT
  // at runtime via get_planning_components_catalogue / get_node_requirements_for_component.

  // Copy plan.jsonl to local session directory
  const srcPlanPath = path.join(srcDir, "plan.jsonl");
  const localPlanPath = path.join(destDir, "plan.jsonl");
  const { metadata, nodes } = readDagV3(srcPlanPath);
  writeDagV3(localPlanPath, metadata, nodes);

  return { localPlanPath, metadata, nodes };
}
