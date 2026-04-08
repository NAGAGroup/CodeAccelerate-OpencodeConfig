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

For a complete worked example of phase decomposition, inter-phase wiring, and the full tool call sequence, load the `dag-design-example` skill.

## Rules for a valid DAG

- Every path terminates at a leaf node — no dead ends
- Every `verify` node has exactly 2 children: a pass path and a fail path
- Every `decision-gate` has exactly 2 children
- Every leaf node must be a `write-notes` node that captures context before exit
- Branches are mutually exclusive paths — parallel work is unsupported

## How to build a DAG

### How to name nodes

Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.

### DAG Building Constraints

- Build and wire all work nodes first (Stages 1-2), then set entry and exit points last (Stage 3)
- Always build and wire each phase independently before connecting them together — this keeps the work manageable and prevents structural errors from propagating across phases
- Be comfortable with orphaned groups throughout the build process, this is expected behavior until you finish wiring up the DAG completely. It is used to guide you, not correct you.
- Every leaf node should be a `write-notes` node — this ensures context is captured before any exit, whether success or failure

### Procedural Overview

1. build each phase cluster independently, using `get_compact_dag_draft` to check work after each cluster
2. wire clusters together, using `get_compact_dag_draft` after each connection
3. `get_dag_draft_diagram` after all wiring is done to check your work
4. set entry and exit points using `set_entry_point` and `set_exit_point`
5. call `validate_dag` when done to ensure the DAG is valid

### Stage 1: Build phase clusters

<|think|>
Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.

For each phase:
1. Call `add_nodes_to_dag` to create all the nodes needed for the phase
2. Wire all internal edges for the phase in a single `connect_nodes` call — pass a dictionary mapping each parent to its child (or array of children for fan-out nodes like decision gates and verify nodes)
3. Call `get_compact_dag_draft` to confirm the cluster is internally correct — it will appear as a grouped orphan cluster, which is expected

> [!IMPORTANT]
> At the end of this stage, you should have `p` orphaned sections of the DAG in `get_compact_dag_draft`, where `p` is the number of phases you designed.

### Stage 2: Wire clusters together

<|think|>
Once all phase clusters are internally complete:
1. Wire all inter-phase connections in a single `connect_nodes` call
2. Call `get_compact_dag_draft` to visually confirm the wiring is correct and that all phase clusters are connected together
3. Call `get_dag_draft_diagram` to see the full visual structure — all work nodes should form a single connected block

### Stage 3: Set entry and exit points

<|think|>
1. Before setting entry/exit points, call `get_dag_draft_diagram` if you haven't already
2. Verify that everything matches your expectations. If they do not, see the revising strategies in the next section below. To verify, consider:
    - Are all terminal pathways accounted for, for both success and failure modes?
    - Are your verify-retry structures correct, with the correct number of retries you originally planned?
    - Are all of your phases wired together into a single, monolithic cluster, with no orphaned phase clusters remaining?
    - Is every leaf node a `write-notes` node?
3. Call `set_entry_point` with the first node that should execute
4. Call `set_exit_point` for every leaf node — use type `success` for happy-path leaves and type `failure` for retry-exhaustion/error leaves

## How to revise an existing DAG

1. Call `get_compact_dag_draft` to read the grouped cluster representation and `get_dag_draft_diagram` to view the visual structure
2. Write the target adjacency list — what the DAG should look like after revision
3. Identify the diff: nodes to add, edges to add, edges to remove, nodes to remove
4. Execute: `add_nodes_to_dag` for new nodes, `connect_nodes` for new edges (batch all new edges in one call), `delete_edge` to remove an edge, `delete_node` to remove a node — after any `delete_node`, immediately rewire its orphaned children before continuing
5. Call `get_dag_draft_diagram` after each structural change, `validate_dag` when done

## How to think through this skill

<|think|>
- Am I following the constraints on building a DAG
- Have I called `get_planning_components_catalogue` and am I working from the actual available components, not memory?
- Have I loaded the `dag-design-example` skill and studied how the staged workflow applies to a concrete example?
- Have I decomposed the goal into distinct phases, with each phase having a clear entry, exit, and internal verify-retry structure, and kept phase clusters independent until each is internally correct?
- Does every `decision-gate` have exactly 2 children, and does every `verify` node have exactly 2 children (pass and fail), with a bounded retry path that converges correctly?
- Is every leaf node a `write-notes` node that captures context before exit?
- Am I using `get_compact_dag_draft` during building (Stages 1-2) and `get_dag_draft_diagram` during wiring and verification (Stage 3)?
