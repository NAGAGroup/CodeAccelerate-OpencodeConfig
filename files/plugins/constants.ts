import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import * as path from "path";
import { renderMermaidASCII } from 'beautiful-mermaid';

// The config root is the directory that contains this plugin's parent folder.
// When installed via OCX the layout is:
//   {install_root}/plugins/planning-enforcement.js  ← this file
//   {install_root}/planning/plan-generic/plan.json  ← DAG files
// So CONFIG_ROOT = dirname of this file's directory = {install_root}.
export const CONFIG_ROOT = path.dirname(import.meta.dirname);

// Tools that bypass DAG blocking, regardless of current node's enforcement
export const exemptTools = ["sequential-thinking_sequentialthinking", "question", "qdrant_qdrant-store", "qdrant_qdrant-find", "recover_context", "next_step", "exit_plan", "skill"];

// Check if a tool name is exempt (exact match only)
export function isExempt(toolName: string): boolean {
  return exemptTools.includes(toolName);
}

// Re-exports for downstream consumers
export { tool };
export type { Plugin };
export { renderMermaidASCII };
