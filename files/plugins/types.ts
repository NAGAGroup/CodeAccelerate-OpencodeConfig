// === Phase-based plan format (JSONL, schema_version "4.0") ===

export type PhaseType =
  | "web-search"
  | "deep-project-search-and-analysis"
  | "project-survey"
  | "work"
  | "project-setup"
  | "user-discussion"
  | "user-decision-gate"
  | "agentic-decision-gate"
  | "write-notes"
  | "early-exit";

export const BRANCHING_PHASE_TYPES = new Set<PhaseType>([
  "agentic-decision-gate",
  "user-decision-gate",
]);

export interface PhaseRecord {
  phase: string;        // descriptive phase ID, e.g. "2a-implement-auth"
  phase_type: PhaseType;
  phase_options: Record<string, unknown>;
  children: string[];   // child phase IDs — length 0 = terminal, length 1 = sequential, length N = branching
}

export interface PhaseDagMetadata {
  schema_version: "4.0";
  id: string;
  entry_phase_id: string;
}

// === DAG format (JSONL, schema_version "3.0") ===

export interface DagNodeV3 {
  id: string;
  prompt: string;
  enforcement: string[];
  children?: string[]; // absent/empty = terminal, length 1 = linear, length 2+ = branching
  inject?: Record<string, string>; // placeholder → value substitutions applied to the prompt at runtime
  component?: string; // component type from node library (e.g., 'work-item', 'write-notes')
}

export interface DagMetadataV3 {
  schema_version: "3.0";
  id: string;
  entry_node_id: string;
}

// Flattened representation for O(1) lookup during execution.
export interface FlatNode {
  id: string;
  prompt: string;
  enforcement: string[];
  children?: string[];
  inject?: Record<string, string>;
}

export interface DecisionEntry {
  node_id: string;
  timestamp: string;
  summary: string;
}

export interface DagSessionState {
  dag_id: string;
  plan_path: string; // worktree-relative path to plan.jsonl
  status: "running" | "waiting_step" | "complete" | "abandoned";
  current_node: string;
  todo_index: number;
  started_at: string;
  updated_at: string;
  decisions: DecisionEntry[];
  node_map: Record<string, FlatNode>;
  plan_name?: string;           // set by choose_plan_name; substituted into {{PLAN_NAME}}
  planning_session_id?: string; // set by plan_session; substituted into {{PLANNING_SESSION_ID}}
}
