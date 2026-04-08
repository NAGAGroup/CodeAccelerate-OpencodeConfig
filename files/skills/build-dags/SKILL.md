---
name: build-dags
description: Teaches how to design and build execution DAGs from the component library, including construction procedure, verify-retry patterns, and revision workflow.
---

# What does this skill teach?

In this skill, you learn how to design and build structurally correct execution DAGs — from planning the adjacency list through construction, verification, and revision.

## How to start every DAG session

1. Call `get_planning_components_catalogue` to load the available node types — never design from memory
2. Plan the complete adjacency list in your reasoning before calling any DAG tool

## How to design a DAG

Every node maps to its children. Write the full adjacency list before touching any tool:

```
execution-kickoff → [node-A]
node-A → [node-B]
node-B → [decision-gate-1]
decision-gate-1 → [node-C, plan-fail]
node-C → [plan-success]
```

Rules for a valid adjacency list:
- Every path from `execution-kickoff` terminates at `plan-success` or `plan-fail` — no dead ends
- Every `decision-gate` has exactly 2 children
- `plan-fail` and `plan-success` are terminals — never add children to them
- There is exactly one of each terminal node, `plan-fail` and `plan-success` — these two nodes are shared children among every node immediately preceding failure or success
- Branches are mutually exclusive paths and therefore cannot be used for parallel work in a DAG — parallel work is unsupported

## How to build a DAG

> [!IMPORTANT]
> Use the `get_dag_draft_diagram` frequently to visualize your current progress and identify orphaned pathways that need connected or deleted

1. You will be presented with a plan name for which `init_dag` has already been called — you do not need to call it, the `execution-kickoff` node will have already been created and should be your starting point
2. Create every remaining node with `add_node` — all nodes first, no wiring yet
3. Wire every edge with `add_child` — follow each path from entry to terminals
5. Call `validate_dag` — fix any issues before finishing

## How to use the verify-retry pattern

Every verify node is followed by a decision-gate with exactly 2 children: the pass path (continues) and the fail path (bounded retry). Never wire a verify directly to plan-fail without a retry opportunity. Never chain more than one retry loop per work item.

**Single retry:**
```
work-A → verify-A → decision-gate-A
  ├─ (pass) → work-B
  └─ (fail) → fix-A → verify-A-retry → decision-gate-A-retry
                         ├─ (pass) → work-B   ← converges back
                         └─ (fail) → plan-fail
```

`work-B` is a convergence node — wire it with `add_child` from both `decision-gate-A` (pass) and `verify-A-retry` (pass).

**Two retries:**
```
work-C → verify-C → decision-gate-C
  ├─ (pass) → next-step
  └─ (fail) → fix-C-1 → verify-C-retry-1 → decision-gate-C-retry-1
                           ├─ (pass) → next-step   ← converges
                           └─ (fail) → fix-C-2 → verify-C-retry-2 → decision-gate-C-retry-2
                                                     ├─ (pass) → next-step  ← converges again
                                                     └─ (fail) → plan-fail
```

`next-step` has three parents: `decision-gate-C`, `decision-gate-C-retry-1`, and `decision-gate-C-retry-2`.

## How to revise an existing DAG

1. Call `show_dag_jsonl` to read the flattened representation and/or `get_dag_draft_diagram` to view the current state of the DAG structure visually
2. Write the target adjacency list — what the DAG should look like after revision
3. Identify the diff: nodes to add, edges to add, edges to remove, nodes to remove
4. Execute: `add_node` for new nodes, `add_child` for new edges, `delete_child` to remove an edge, `delete_node` to remove a node — after any `delete_node`, immediately rewire its orphaned children before continuing
5. Call `get_dag_draft_diagram` after each structural change, `validate_dag` when done

## How to name nodes

Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.

## How to think through this skill

<|think|>
- Have I called `get_planning_components_catalogue` — am I working from the actual available components, not memory?
- Have I written the complete adjacency list before calling any tool — do I know every node and every edge?
- Does every path from `execution-kickoff` reach `plan-success` or `plan-fail` — are there any dead ends?
- Does every `decision-gate` have exactly 2 children?
- Are my branches truly mutually exclusive, or is there work that both paths need — if so, it should be sequential nodes?
- For each verify node, is there a bounded retry path — and does it converge back to the main path on pass?
- After any `delete_node`, have I immediately rewired the orphaned children before doing anything else?
- How do the `get_dag_jsonl` and `get_dag_draft_diagram` help me when I'm stuck building the DAG or revising an existing DAG?
