import type { DagSessionState } from "./types";

export interface DivergenceReport {
  hasDivergence: boolean;
  issues: DivergenceIssue[];
}

export interface DivergenceIssue {
  type: "node_missing" | "progress_mismatch" | "state_corrupted";
  severity: "warning" | "error";
  description: string;
}

export function detectDivergence(state: DagSessionState): DivergenceReport {
  const report: DivergenceReport = { hasDivergence: false, issues: [] };

  if (!state.node_map[state.current_node]) {
    report.issues.push({
      type: "node_missing",
      severity: "error",
      description:
        `Current node "${state.current_node}" not found in DAG node_map. ` +
        `The DAG may have been modified externally while the session was active.`,
    });
    report.hasDivergence = true;
    return report;
  }

  const currentNode = state.node_map[state.current_node];
  if (state.todo_index > currentNode.enforcement.length) {
    report.issues.push({
      type: "progress_mismatch",
      severity: "error",
      description:
        `todo_index (${state.todo_index}) exceeds enforcement items in node ` +
        `"${state.current_node}" (${currentNode.enforcement.length}). State may be corrupted.`,
    });
    report.hasDivergence = true;
  }

  return report;
}

export function suggestRecoveryActions(report: DivergenceReport): string[] {
  if (!report.hasDivergence) return ["No divergence detected. Session state is consistent."];

  const actions: string[] = [];
  for (const issue of report.issues) {
    switch (issue.type) {
      case "node_missing":
        actions.push("Call activate_plan() to reload the DAG and reset to the entry node.");
        break;
      case "progress_mismatch":
        actions.push("Call recover_context() to inspect the full session state.");
        break;
      case "state_corrupted":
        actions.push("Start a new session with plan_session() or activate_plan().");
        break;
    }
  }
  return [...new Set(actions)];
}
