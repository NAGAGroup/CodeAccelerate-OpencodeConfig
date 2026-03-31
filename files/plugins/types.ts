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

// Flattened representation for O(1) lookup during execution.
export interface FlatNode {
  id: string;
  prompt: string;
  todo: string[];
  nextLinear?: string; // id of single child (linear)
  branches?: Array<{ when: string; nodeId: string }>; // branching children
  // undefined nextLinear + undefined branches = terminal
}

export interface DecisionEntry {
  node_id: string;
  timestamp: string;
  summary: string;
}

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
}
