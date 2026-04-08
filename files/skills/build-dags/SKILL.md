---
name: build-dags
description: Teaches how to design and build execution DAGs from the component library, including construction procedure, verify-retry patterns, and revision workflow.
---
# What does this skill teach?

In this skill, you learn how to design and build structurally correct execution DAGs — from planning phases through cluster construction, wiring, verification, and revision.

## How to start every DAG session

1. Call `get_planning_components_catalogue` to load the available node types — never design from memory
2. Decompose the goal into chunked phases
3. Proceed with the design guidance below

## How to design a DAG

Break the work into phases. Each phase is a self-contained cluster of nodes. Plan each cluster independently. Only after you've planned each cluster independently, consider the structure of inter-phase connections.

**Phase planning example:**

```
Phase 1 — decision-gate with immediate convergence:
  work-A → decision-gate-A
    ├─ → work-A-option-1 → work-B (converge)
    └─ → work-A-option-2 → work-B (converge)

Phase 2 — sequential work with early success check:
  work-B → work-C → decision-gate-early-check
    ├─ → plan-success (early exit example — goal already satisfied) (wired up at the end, leave success paths dangling until then)
    └─ → decision-gate-routing
           ├─ → [Phase 3a entry]
           └─ → [Phase 3b entry]

Phase 3a — single retry, converges to Phase 4:
  work-D → verify-D
    ├─ (pass) → work-F (converge with Phase 3b)
    └─ (fail) → fix-D → verify-D-retry
                           ├─ (pass) → work-F (converge)
                           └─ (fail) → plan-fail (wired up at the end, leave failure paths dangling until then)

Phase 3b — two retries, converges to Phase 4:
  work-E → verify-E
    ├─ (pass) → work-F (converge with Phase 3a)
    └─ (fail) → fix-E-1 → verify-E-retry-1
                             ├─ (pass) → work-F (converge)
                             └─ (fail) → fix-E-2 → verify-E-retry-2
                                                     ├─ (pass) → work-F (converge)
                                                     └─ (fail) → plan-fail (wired up at the end, leave failure paths dangling until then)

Phase 4 — sequential to success:
  work-F → plan-success (wired up at the end, leave success paths dangling until then)
```

**Then define the wiring between phases:**
```
work-B connects Phase 1 exit to Phase 2 entry (convergence node)
decision-gate-early-check routes to plan-success (early exit, wired up at the end) or decision-gate-routing
decision-gate-routing routes to work-D (Phase 3a) or work-E (Phase 3b)
work-F connects Phase 3a/3b exits to Phase 4 entry (convergence node)
```

## How to build a DAG

### Stage 1: Build phase clusters

> [!IMPORTANT]
> Ignore the `execution-kickoff`, `plan-fail` and `plan-success` nodes. You will wire these up last.

Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.

For each phase:
1. Call `add_nodes_to_dag` to create all the nodes needed for the phase
1. Wire the internal edges within the phase using `connect_nodes`
4. Call `get_compact_dag_draft` to confirm the cluster is internally correct — it will appear as a grouped orphan cluster, which is expected

> [!IMPORTANT]
> At the end of this stage, you have have `p` orphaned sections of the DAG in `get_compact_dag_draft`, where `p` is the number of phases you designed.

### Stage 2: Wire clusters together

Once all phase clusters are internally complete:
- Create inter-phase connections
- After each call to `connect_nodes`, call `get_compact_dag_draft` to visually confirm the wiring is correct and that every path from kickoff leads to success or fail with no dead ends
- After all inter-phase wiring is complete call `get_dag_draft_diagram` to see the full visual structure. Your wired up phase clusters should be a single, orphaned block, alongside the kickoff node and orphaned terminal nodes

### Stage 3: Connect kickoff and terminal nodes

Finally, connect the kickoff node to the entry of the first phase, and connect all paths leading to success or failure to their respective terminal nodes. Call `get_dag_draft_diagram` after each change, and `validate_dag` when done.

## How to revise an existing DAG

1. Call `get_compact_dag_draft` to read the grouped cluster representation and `get_dag_draft_diagram` to view the visual structure
2. Write the target adjacency list — what the DAG should look like after revision
3. Identify the diff: nodes to add, edges to add, edges to remove, nodes to remove
4. Execute: `add_nodes_to_dag` for new nodes, `connect_nodes` for new edges, `delete_edge` to remove an edge, `delete_node` to remove a node — after any `delete_node`, immediately rewire its orphaned children before continuing
5. Call `get_dag_draft_diagram` after each structural change, `validate_dag` when done

## Rules for a valid DAG

- Every path from `execution-kickoff` terminates at `plan-success` or `plan-fail` — no dead ends
- Every `verify` node has exactly 2 children: a pass path and a fail path
- Every `decision-gate` has exactly 2 children
- `plan-fail` and `plan-success` are terminals — never add children to them
- There is exactly one of each terminal node — these two nodes are shared targets among every node immediately preceding failure or success
- Branches are mutually exclusive paths — parallel work is unsupported

## How to name nodes

Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.

## DAG Building Steps Refresher

> [!IMPORTANT]
> Ignore kickoff and terminal nodes until all phases are built and wired up to one another

1. build each phase cluster independently, using `get_compact_dag_draft` to check work after each cluster
2. wire clusters together, using `get_compact_dag_draft` after each connection and `get_dag_draft_diagram` after all wiring is done
3. connect kickoff and terminal nodes, using `get_dag_draft_diagram` after each change and `validate_dag` when done

## DAG Building Constraints

- Always leave the `execution-kickoff`, `plan-success`, and `plan-fail` nodes until the end — they are the anchors of the DAG and should be wired in last
- Always build and wire each phase independently before connecting them together — this keeps the work manageable and prevents structural errors from propagating across phases
- Be comfortable with orphaned groups throughout the build process, this is expected behavior until you finish wiring up the DAG completely. It is used to guide you, not correct you.

## How to think through this skill

<|think|>
- Am I following the constraints on building a DAG
- Have I called `get_planning_components_catalogue` and am I working from the actual available components, not memory?
- Have I decomposed the goal into distinct phases, with each phase having a clear entry, exit, and internal verify-retry structure, and kept phase clusters independent until each is internally correct?
- Does every `decision-gate` have exactly 2 children, and does every `verify` node have exactly 2 children (pass and fail), with a bounded retry path that converges correctly?
- Am I using `get_compact_dag_draft` during building (Stages 1-2) and `get_dag_draft_diagram` during wiring and verification (Stage 3)?
