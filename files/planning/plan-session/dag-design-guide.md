# DAG Design Guide

## Node IDs

Unique and descriptive. Never `node-1`, `step-3`, or bare component names. Add suffixes when reusing a type: `verify-setup`, `verify-final`.

## Execution Model

**All execution is strictly sequential — one node at a time. There is no parallelism.** Branches are mutually exclusive paths: when a decision-gate picks branch A, branch B is permanently unreachable in that execution. Branches are not concurrent — they are alternative futures, only one of which ever runs. Never use branches for work that both needs to happen — that is sequential nodes on the same path.

## Construction Procedure

Think of the DAG as a directed graph. Build the complete adjacency list using sequential-thinking BEFORE calling any DAG tool.

**Step 1: Write the adjacency list.**

Every node maps to its children. Example:
```
execution-kickoff → [node-A]
node-A → [node-B]
node-B → [decision-gate-1]
decision-gate-1 → [node-C, plan-fail]       ← decision-gate always has exactly 2 children
node-C → [decision-gate-2]
decision-gate-2 → [node-D, plan-fail]       ← plan-fail appears again (shared terminal)
node-D → [plan-success]
```

Constraints for a valid adjacency list:
- Exactly one `plan-success` and one `plan-fail` in the entire graph
- Every path from `execution-kickoff` terminates at `plan-success` or `plan-fail` — no dead ends
- Every `decision-gate` has exactly 2 children
- `plan-fail` and `plan-success` have no children — they are terminals

**Step 2: Mark convergence nodes.**

A convergence node appears as a child of two different parents. In the example above, `plan-fail` is a child of both `decision-gate-1` and `decision-gate-2` — mark it.

**Step 3: Create all nodes first, then wire all edges.**

First create every node with `add_node`:
```
add_node(plan_name, node-A, work-item)
add_node(plan_name, node-B, verify)
add_node(plan_name, decision-gate-1, decision-gate)
add_node(plan_name, node-C, work-item)
add_node(plan_name, plan-fail, plan-fail)
add_node(plan_name, decision-gate-2, decision-gate)
add_node(plan_name, node-D, commit)
add_node(plan_name, plan-success, plan-success)
```

Then wire every edge with `add_child`:
```
add_child(plan_name, execution-kickoff, node-A)
add_child(plan_name, node-A, node-B)
add_child(plan_name, node-B, decision-gate-1)
add_child(plan_name, decision-gate-1, node-C)
add_child(plan_name, decision-gate-1, plan-fail)     ← plan-fail wired like any other child
add_child(plan_name, node-C, decision-gate-2)
add_child(plan_name, decision-gate-2, node-D)
add_child(plan_name, decision-gate-2, plan-fail)     ← plan-fail already exists, same call pattern
add_child(plan_name, node-D, plan-success)
```

`add_child` works whether the child already exists or not — no special cases for shared terminals.

**Step 4: Validate.**

Run `validate_dag` when construction is complete.

## Verify-Retry Pattern

Every verify node must be followed by a decision-gate with exactly 2 children: the next step (pass) and a bounded retry path (fail). The retry path fixes the issue, re-verifies once, then either converges back to the next step (pass) or terminates at plan-fail (fail). Never wire a verify node directly to plan-fail without a retry opportunity, and never chain more than one retry loop.

```
work-A
  └─ verify-A
       └─ decision-gate-A
            ├─ (pass) → work-B                    ← continues main path
            └─ (fail) → fix-A
                          └─ verify-A-retry
                               ├─ (pass) → work-B ← converges back to main path
                               └─ (fail) → plan-fail

work-B
  └─ verify-B
       └─ decision-gate-B
            ├─ (pass) → commit                    ← continues main path
            └─ (fail) → plan-fail                 ← no retry needed here (designer's choice)

commit → plan-success
```

`work-B` is a convergence node — it has two parents: `decision-gate-A` (pass) and `verify-A-retry` (pass). Wire it with `add_child` from both parents.

**With two retries (one work item gets two fix attempts):**
```
work-C
  └─ verify-C
       └─ decision-gate-C
            ├─ (pass) → next-step
            └─ (fail) → fix-C-1
                          └─ verify-C-retry-1
                               ├─ (pass) → next-step   ← converges
                               └─ (fail) → fix-C-2
                                             └─ verify-C-retry-2
                                                  ├─ (pass) → next-step  ← converges again
                                                  └─ (fail) → plan-fail
```

`next-step` is a convergence node with three parents: `decision-gate-C`, `verify-C-retry-1`, and `verify-C-retry-2`.

## Revision Procedure

When revising an existing DAG (e.g. after a review):

1. Call `show_dag` to read the current structure
2. Write the target adjacency list in sequential-thinking — what the DAG should look like after revision
3. Identify the diff: what nodes to add, delete, or rewire
4. Execute changes:
   - New nodes → `add_node` then `add_child`
   - Remove an edge → `delete_child(plan_name, parentId, childId)`
   - Remove a node → `delete_node(plan_name, nodeId)` (children become orphaned — rewire with `add_child` immediately)
5. After each `delete_node`, immediately rewire orphaned nodes before continuing
6. Call `show_compact_dag` after each structural change to verify
7. Run `validate_dag` when done

## Rules

- Write the full adjacency list in sequential-thinking before calling any DAG tool
- Create all nodes with `add_node` first, then wire all edges with `add_child`
- Every `decision-gate` must have exactly 2 children
- `plan-fail` and `plan-success` are terminals — never add children to them
- `plan-fail` and `plan-success` are shared — wire them to multiple parents with `add_child`, same as any other node
- Retry paths are bounded — never chain multiple retry loops
- After `delete_node`, rewire orphaned nodes immediately before any other operation
