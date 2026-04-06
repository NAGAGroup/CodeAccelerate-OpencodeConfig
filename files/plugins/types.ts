// === OLD FORMAT (nested JSON) — deprecated, schema_version "2.0" ===
export interface DagNode {
  id: string;
  prompt: string;
  todo: string[];
  next?: DagNode | BranchOption[];
}

export interface BranchOption {
  when: string;
  node: DagNode;
}

export interface PlanDag {
  schema_version: "2.0";
  id: string;
  entry: DagNode;
}

// === NEW FORMAT (JSONL) — schema_version "3.0" ===
// Each line is a valid DagNodeV3 JSON object
export interface DagNodeV3 {
  id: string;
  prompt: string;
  todo: string[];
  children?: string[]; // node IDs: absent/empty = terminal, length 1 = linear, length 2+ = branching
}

// DAG metadata (stored as first line or separate metadata file)
export interface DagMetadataV3 {
  schema_version: "3.0";
  id: string;
  entry_node_id: string;
}

// Flattened representation for O(1) lookup during execution.
export interface FlatNode {
  id: string;
  prompt: string;
  todo: string[];
  children?: string[]; // node IDs: absent/empty = terminal, length 1 = linear, length 2+ = branching
}

export interface ProgressEntry {
  node_id: string;
  todo_index: number; // how many todos completed for this node when stepped
  timestamp: string;
}

export interface DecisionEntry {
  node_id: string;
  timestamp: string;
  summary: string;
}

// Old format: session state stored in separate file
export interface DagSessionState {
  dag_id: string;
  plan_path: string; // absolute path to local plan.json
  status: "running" | "waiting_step" | "complete" | "abandoned";
  current_node: string;
  todo_index: number; // how many todo items have been completed for current node
  started_at: string;
  updated_at: string;
  decisions: DecisionEntry[];
  node_map: Record<string, FlatNode>;
  plan_name?: string; // set by choose_plan_name; substituted into {{PLAN_NAME}} in prompts
  planning_session_id?: string; // set by plan_session; substituted into {{PLANNING_SESSION_ID}} in prompts
}

// New format: session state embedded in JSONL DAG file
export interface DagSessionStateV3 {
  dag_id: string;
  status: "running" | "waiting_step" | "complete" | "abandoned";
  current_node: string;
  todo_index: number; // progress within current node's todo array
  started_at: string;
  updated_at: string;
  decisions: DecisionEntry[];
  progress_log: ProgressEntry[]; // history of progress for divergence detection
}
