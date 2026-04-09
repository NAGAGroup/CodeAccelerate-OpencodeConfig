---
name: dag-tools
description: Teaches how to build, modify, review, and validate execution DAGs using DAG manipulation and design tools.
---

<tools>
get_planning_components_catalogue — returns the component catalogue. Use variant="core" for the first-pass design. Omit variant or use variant="full" for all components including specialist nodes.

init_dag — creates a new empty DAG. plan_name must be lowercase with hyphens only.

add_nodes_to_dag — creates multiple nodes in one call. nodes is a JSON object mapping nodeId to component_name.

add_node — creates a single node. Prefer add_nodes_to_dag when creating multiple nodes.

connect_nodes — wires multiple directed edges in one call. edges is a JSON object mapping from-nodeId to to-nodeId or an array of to-nodeIds for fan-out.

insert_between — atomically inserts a node between two connected nodes. Removes the from→to edge and adds from→new_node→to in one operation. Use this for all mid-chain insertions. Never use manual delete_edge + connect_nodes instead.

delete_edge — removes a directed edge without deleting either node. The child node becomes orphaned.

delete_node — removes a node and all its edges. Children become orphaned.

set_entry_point — marks the first work node as the plan entry. Call once as the final construction step.

set_exit_point — marks a write-notes leaf as a plan exit. type is "success" for happy-path exits and "failure" for retry-exhaustion exits. Call for every write-notes leaf as the final construction step.

get_compact_dag_draft — returns connected node chains, orphaned groups, and entry/exit status. Call after each structural change to verify incrementally.

get_dag_draft_diagram — returns a visual ASCII diagram of the full DAG structure.

present_dag_diagram — validates the DAG and injects the diagram as a system message. Throws if the DAG has structural errors.

validate_dag — throws on any structural issue. Call when all construction or revision is complete.
</tools>
