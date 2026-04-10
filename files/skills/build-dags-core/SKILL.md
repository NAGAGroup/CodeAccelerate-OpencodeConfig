---
name: build-dags-core
description: Teaches how to build a structurally valid MVP execution DAG from the core component catalogue using the staged construction procedure.
---
<rules>
Only use the core catalogue — call get_planning_components_catalogue with variant="core". Never design from memory.
Every path terminates at a write-notes leaf — no dead ends.
Every verify node has exactly 2 children: pass path and fail path.
Every decision-gate has exactly 2 children.
Branches are mutually exclusive — no parallel work.
Node IDs must be descriptive. Never use node-1 or step-3.
Default to 1 retry per verify-retry structure — the reviewer adjusts if needed.
Build and wire all work nodes first, then set entry and exit points last.
</rules>

<example>
Stage 1 — Build phase clusters.
For each phase: call add_nodes_to_dag to create all phase nodes, then call connect_nodes to wire internal edges, then call get_compact_dag_draft to confirm the cluster is correct. Orphaned clusters at this stage are expected and normal.

Stage 2 — Wire clusters together.
Call connect_nodes for all inter-phase connections. Call get_compact_dag_draft to confirm all clusters are connected. Call get_dag_draft_diagram to see the full visual structure.

Stage 3 — Set entry and exit points.
Verify: every terminal path is accounted for (success and failure), every verify-retry structure is correct, all phases are wired into a single connected graph, every leaf is a write-notes node.
Call set_entry_point with the first work node.
Call set_exit_point for every leaf node — success for happy-path, failure for retry-exhaustion.
</example>
