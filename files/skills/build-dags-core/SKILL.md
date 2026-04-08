---
name: build-dags-core
description: Teaches how to build a structurally valid MVP execution DAG from the core component catalogue using the staged construction procedure.
---
# What does this skill teach?

In this skill, you learn how to build a structurally correct first-pass execution DAG — an MVP that captures the essential work phases, verification, and convergence structure. You are building a foundation that a second pass will improve.

## Your job

Build a clean, structurally valid DAG that captures the essential work phases. Do not overthink node selection — use only the core catalogue (`variant="core"`). A reviewer and reviser will add specialist nodes and refine the structure afterward. Your goal is a solid skeleton, not a final product.

## How to start

1. Call `get_planning_components_catalogue` with `variant="core"` — never design from memory, and never use the full catalogue
2. Decompose the goal into chunked phases
3. Follow the staged construction procedure below

## Rules for a valid DAG

- Every path terminates at a leaf node — no dead ends
- Every `verify` node has exactly 2 children: a pass path and a fail path
- Every `decision-gate` has exactly 2 children
- Every leaf node must be a `write-notes` node that captures context before exit
- Branches are mutually exclusive paths — parallel work is unsupported

## How to name nodes

Node IDs must be unique and descriptive. Never use generic names like `node-1` or `step-3`, and never use bare component names like `verify` or `work-item`. Add context: `verify-setup`, `verify-auth`, `fix-build-errors`, `decision-gate-auth-check`.

## Building Constraints

- Build and wire all work nodes first (Stages 1-2), then set entry and exit points last (Stage 3)
- Build and wire each phase independently before connecting them — this prevents structural errors from propagating across phases
- Be comfortable with orphaned groups throughout the build process — this is expected until you finish wiring completely
- Every leaf node should be a `write-notes` node
- Use 1 retry for each verify-retry structure unless the planning context indicates higher complexity — the reviewer will adjust retry counts if needed

## Staged Construction Procedure

### Stage 1: Build phase clusters

<|think|>
Build each phase as an independent cluster. It is expected and normal for clusters to be orphaned at this stage.

For each phase:
1. Call `add_nodes_to_dag` to create all the nodes needed for the phase
2. Wire all internal edges for the phase in a single `connect_nodes` call
3. Call `get_compact_dag_draft` to confirm the cluster is internally correct

### Stage 2: Wire clusters together

<|think|>
Once all phase clusters are internally complete:
1. Wire all inter-phase connections in a single `connect_nodes` call
2. Call `get_compact_dag_draft` to confirm all clusters are connected
3. Call `get_dag_draft_diagram` to see the full visual structure

### Stage 3: Set entry and exit points

<|think|>
1. Call `get_dag_draft_diagram` if you haven't already
2. Verify:
    - Are all terminal pathways accounted for, success and failure?
    - Are your verify-retry structures correct?
    - Are all phases wired into a single connected graph?
    - Is every leaf node a `write-notes` node?
3. Call `set_entry_point` with the first node
4. Call `set_exit_point` for every leaf node — `success` for happy-path, `failure` for retry-exhaustion

## How to think through this skill

<|think|>
- Am I using only the core catalogue, not the full one?
- Have I decomposed the goal into distinct phases with clear boundaries?
- Am I defaulting to 1 retry per verify-retry structure and not overthinking retry counts?
- Am I following the staged procedure: build clusters → wire clusters → set entry/exit?
- Is every leaf node a `write-notes` node?
