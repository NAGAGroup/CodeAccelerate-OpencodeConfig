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

// Tools that bypass DAG blocking, regardless of current node's todos
export const exemptTools = ["plan_session", "activate_plan", "next_step", "recover_context", "question", "exit_plan", "validate_dag", "todowrite", "sequential-thinking_sequentialthinking", "show_dag", "init_dag", "add_node", "delete_node", "modify_node", "present_dag_to_user"];

// Re-exports for downstream consumers
export { tool };
export type { Plugin };
export { renderMermaidASCII };
