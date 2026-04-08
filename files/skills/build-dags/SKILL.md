---
name: build-dags
description: Teaches how to design and build execution DAGs from the component library, including construction procedure, verify-retry patterns, and revision workflow.
---
# What does this skill teach?

In this skill, you learn how to design and build structurally correct execution DAGs — from planning phases through cluster construction, wiring, verification, and revision.

## How to start every DAG session

1. Call `get_planning_components_catalogue` to load the available node types — never design from memory
2. Decompose the goal into sequential phases, then plan each phase's internal structure before calling any DAG tool

## How to design a DAG

Break the work into phases. Each phase is a self-contained cluster of nodes. Plan each cluster independently, then define how clusters connect.

**Phase planning example:**

```
Phase 1 — decision-gate with immediate convergence:
  work-A → decision-gate-A
    ├─ → work-A-option-1 → work-B (converge)
    └─ → work-A-option-2 → work-B (converge)

Phase 2 — sequential work with early success check:
  work-B → work-C → decision-gate-early-check
    ├─ → plan-success (early exit — goal already satisfied)
    └─ → decision-gate-routing
           ├─ → [Phase 3a entry]
           └─ → [Phase 3b entry]

Phase 3a — single retry, converges to Phase 4:
  work-D → verify-D
    ├─ (pass) → work-F (converge with Phase 3b)
    └─ (fail) → fix-D → verify-D-retry
                           ├─ (pass) → work-F (converge)
                           └─ (fail) → plan-fail

Phase 3b — two retries, converges to Phase 4:
  work-E → verify-E
    ├─ (pass) → work-F (converge with Phase 3a)
    └─ (fail) → fix-E-1 → verify-E-retry-1
                             ├─ (pass) → work-F (converge)
                             └─ (fail) → fix-E-2 → verify-E-retry-2
                                                     ├─ (pass) → work-F (converge)
                                                     └─ (fail) → plan-fail

Phase 4 — sequential to success:
  work-F → plan-success
```

**Then define the wiring between phases:**
```
execution-kickoff → work-A
work-B connects Phase 1 exit to Phase 2 entry (convergence node)
decision-gate-early-check routes to plan-success (early exit) or decision-gate-routing
decision-gate-routing routes to work-D (Phase 3a) or work-E (Phase 3b)
work-F connects Phase 3a/3b exits to Phase 4 entry (convergence node)
work-F → plan-success
```

Rules for a valid DAG:
- Every path from `execution-kickoff` terminates at `plan-success` or `plan-fail` — no dead ends
- Every `verify` node has exactly 2 children: a pass path and a fail path
- Every `decision-gate` has exactly 2 children
- `plan-fail` and `plan-success` are terminals — never add children to them
- There is exactly one of each terminal node — these two nodes are shared targets among every node immediately preceding failure or success
- Branches are mutually exclusive paths — parallel work is unsupported

## How to build a DAG

Construction happens in three stages: create nodes, build phase clusters, then wire clusters together.

### Stage 1: Create all nodes

1. You will be presented with a plan name for which `init_dag` has already been called — `execution-kickoff`, `plan-success`, and `plan-fail` already exist and must not be added again
2. Create every remaining node with a single `add_nodes_to_dag` call — organized by phase, all nodes at once, no wiring yet
3. Call `get_compact_dag_draft` to confirm all nodes exist before wiring

### Stage 2: Build phase clusters

Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.

For each phase:
1. Wire the internal edges within the phase using `connect_dag_nodes`
2. Wire the verify-retry loop within the phase
3. Wire the phase's failure terminal to `plan-fail`
4. Call `get_compact_dag_draft` to confirm the cluster is internally correct — it will appear as a grouped orphan cluster, which is expected

Do not attempt to connect phases to each other yet. Focus on getting each cluster's internal structure right first.

### Stage 3: Wire clusters together

Once all phase clusters are internally complete:
1. Connect `execution-kickoff` to the first phase's entry node
2. Connect each phase's success exit to the next phase's entry node
3. Connect the final phase's success exit to `plan-success`
4. Call `get_dag_draft_diagram` to visually verify the complete structure — all orphans should now be resolved
5. Call `validate_dag` — fix any issues before finishing

## How to revise an existing DAG

1. Call `get_compact_dag_draft` to read the grouped cluster representation and `get_dag_draft_diagram` to view the visual structure
2. Write the target adjacency list — what the DAG should look like after revision
3. Identify the diff: nodes to add, edges to add, edges to remove, nodes to remove
4. Execute: `add_nodes_to_dag` for new nodes, `connect_dag_nodes` for new edges, `delete_dag_edge` to remove an edge, `delete_node` to remove a node — after any `delete_node`, immediately rewire its orphaned children before continuing
5. Call `get_dag_draft_diagram` after each structural change, `validate_dag` when done

## How to name nodes

Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.

## How to think through this skill

<|think|>
- Have I called `get_planning_components_catalogue` — am I working from the actual available components, not memory?
- Have I decomposed the goal into distinct phases — does each phase have a clear entry, exit, and internal verify-retry structure?
- Within each phase cluster, is the internal wiring complete — work → verify (pass → exit, fail → fix → verify-retry → plan-fail)?
- Have I kept phase clusters independent during Stage 2 — am I resisting the urge to wire between phases before each cluster is internally correct?
- When wiring clusters together in Stage 3, does every phase exit connect to the next phase entry?
- Does every path from `execution-kickoff` reach `plan-success` or `plan-fail` — are there any dead ends?
- Does every `decision-gate` have exactly 2 children?
- Does every `verify` node have exactly 2 children — a pass path and a fail path?
- For each verify node, is there a bounded retry path — and does the retry's pass path converge back to the same next step as the original verify's pass path?
- After any `delete_node`, have I immediately rewired the orphaned children before doing anything else?
- Am I using `get_compact_dag_draft` during building (Stages 1-2) and `get_dag_draft_diagram` during wiring and verification (Stage 3)?
