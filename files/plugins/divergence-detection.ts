import type { DagSessionState, ProgressEntry } from "./types";

/**
 * Divergence detection: compares session state with DAG progress log to identify mismatches.
 * Returns a report of any discrepancies found.
 */
export interface DivergenceReport {
  hasDivergence: boolean;
  issues: DivergenceIssue[];
  suggestion?: string;
}

export interface DivergenceIssue {
  type: "progress_mismatch" | "node_missing" | "state_corrupted";
  severity: "warning" | "error";
  description: string;
  lastKnownState?: { node_id: string; todo_index: number; timestamp: string };
}

/**
 * Detect divergence between session state and DAG progress log.
 * This runs when recovering context after potential corruption or context loss.
 */
export function detectDivergence(state: DagSessionState): DivergenceReport {
  const report: DivergenceReport = {
    hasDivergence: false,
    issues: [],
  };

  // No progress log in old state format — cannot detect
  if (!state) {
    report.issues.push({
      type: "state_corrupted",
      severity: "error",
      description: "Session state is missing or unreadable.",
    });
    report.hasDivergence = true;
    return report;
  }

  // Basic check: current_node must be in node_map
  if (!state.node_map[state.current_node]) {
    report.issues.push({
      type: "node_missing",
      severity: "error",
      description: `Current node "${state.current_node}" not found in DAG node_map. ` +
        `The DAG may have been modified externally while the session was active.`,
    });
    report.hasDivergence = true;
    report.suggestion = "Reset to the DAG entry point with activate_plan(), or manually correct the DAG.";
  }

  // Check todo_index validity
  const currentNode = state.node_map[state.current_node];
  if (currentNode && state.todo_index > currentNode.todo.length) {
    report.issues.push({
      type: "progress_mismatch",
      severity: "error",
      description: `todo_index (${state.todo_index}) exceeds the number of todos in node ` +
        `"${state.current_node}" (${currentNode.todo.length}). This suggests the DAG was modified ` +
        `or state was corrupted.`,
    });
    report.hasDivergence = true;
  }

  return report;
}

/**
 * Suggest recovery actions based on divergence report.
 */
export function suggestRecoveryActions(report: DivergenceReport): string[] {
  if (!report.hasDivergence) {
    return ["No divergence detected. Session state is consistent."];
  }

  const actions: string[] = [];

  for (const issue of report.issues) {
    switch (issue.type) {
      case "node_missing":
        actions.push(
          "Call activate_plan() to reload the DAG and reset to the entry node.",
          "Or manually verify the DAG file has not been corrupted."
        );
        break;
      case "progress_mismatch":
        actions.push(
          "Call next_step() to see the current node and expected todo.",
          "If necessary, call recover_context() to inspect the full session state."
        );
        break;
      case "state_corrupted":
        actions.push(
          "The session state file may have been deleted or corrupted.",
          "Start a new session with plan_session() or activate_plan()."
        );
        break;
    }
  }

  return [...new Set(actions)]; // Deduplicate
}
