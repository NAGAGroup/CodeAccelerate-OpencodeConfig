import * as path from "path";

// The config root is the directory that contains this plugin's parent folder.
// When installed via OCX the layout is:
//   {install_root}/plugins/planning-enforcement.js  ← this file
//   {install_root}/planning/plan-generic/plan.json  ← DAG files
// So CONFIG_ROOT = dirname of this file's directory = {install_root}.
export const CONFIG_ROOT = path.dirname(import.meta.dirname);

// Tools that bypass DAG blocking regardless of current node's enforcement sequence.
export const exemptTools = [
  "question",
  "qdrant_qdrant-store",
  "qdrant_qdrant-find",
  "recover_context",
  "next_step",
  "exit_plan",
  "skill",
];

export function isExempt(toolName: string): boolean {
  return exemptTools.includes(toolName);
}
