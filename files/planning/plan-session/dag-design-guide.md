# DAG Design Guide

## Node IDs

Unique and descriptive. Never `node-1`, `step-3`, or bare component names. Add suffixes when reusing a type: `verify-setup`, `verify-final`.

## Execution Model

All execution is sequential — one node at a time. Branches are mutually exclusive paths. When a decision-gate picks branch A, branch B is permanently unreachable. Never use branches for work that both needs to happen — that is sequential nodes on the same path.

## Construction Procedure

Think of the DAG as a directed graph. Build the complete adjacency list using sequential-thinking BEFORE calling any DAG tool.

**Step 1: Write the adjacency list.**

Every node maps to its children. Example:
```
execution-kickoff → [node-A]
node-A → [node-B]
node-B → [decision-gate-1]
decision-gate-1 → [node-C, node-D]
node-C → [plan-success]
node-D → [node-E]
node-E → [plan-fail]
```

Constraints for a valid adjacency list:
- Exactly one `plan-success` and one `plan-fail` in the entire graph
- Every path from `execution-kickoff` terminates at `plan-success` or `plan-fail` — no dead ends
- Every `decision-gate` has exactly 2 children
- `plan-fail` and `plan-success` have no children — they are terminals

**Step 2: Mark convergence nodes.**

A convergence node appears as a child of two different parents. Mark it — it needs `add_parent` for the second parent connection.

**Step 3: Execute DFS from execution-kickoff.**

For each edge in the adjacency list, traversing depth-first:
- Child does not yet exist → `add_node(parentId, nodeId, component_name)`
- Child already exists (convergence) → `add_parent(nodeId, new_parent_id)`

Example:
```
add_node(execution-kickoff, node-A, ...)
add_node(node-A, node-B, ...)
add_node(node-B, decision-gate-1, decision-gate)
add_node(decision-gate-1, node-C, ...)          ← happy path branch
add_node(node-C, plan-success, plan-success)
add_node(decision-gate-1, node-D, ...)          ← alternate branch
add_node(node-D, node-E, ...)
add_parent(plan-success, new_parent_id=node-E)  ← plan-success already exists, use add_parent
```

`add_parent` is called only when the target node already exists in the DAG.

**Step 4: Validate.**

Run `validate_dag` when construction is complete.

## Rules

- Write the full adjacency list in sequential-thinking before calling any DAG tool
- Every `decision-gate` must have exactly 2 children
- `plan-fail` and `plan-success` are terminals — never add children to them
- Retry paths are bounded — never chain multiple retry loops
