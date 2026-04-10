---
name: dag-revision-patterns
description: Patterns for DAG revision — inserting nodes mid-chain, replacing nodes, creating pathways, extending from leaves.
---

<example>
// connect_nodes edges format: {from: to} — left node runs before right node
// {A: B} means A → B in execution order, matching the compact draft notation (A) → (B)

Inserting nodes mid-chain:
add_node(plan_name=[plan name], nodeId=[C], component_name=[component type from the catalogue]) // add the node being inserted if it doesn't exist already
insert_between(plan_name=[plan name], from=[A], new_node=[C], to=[B]) // A->B becomes A->C->B

Replacing a node:
add_node(plan_name=[plan name], nodeId=[C], component_name=[component type from the catalogue]) // add the replacement node if it doesn't exist already
get_compact_dag_draft(target=[plan name]) // identify the nodes connected to the node you want to replace
delete_node(plan_name=[plan name], nodeId=[B]) // remove the node being replaced
connect_nodes(plan_name=[plan name], edges={[A]: [C], [C]: [D, E]}) // {from: to} — A runs before C, C runs before D and E
get_compact_dag_draft(target=[plan name]) // verify edges flow in the correct direction

Creating new execution pathways(remember, this isn't parallel work but alternative work as parallel work isn't supported):
add_nodes_to_dag(plan_name=[plan name], nodes={[X]: [component], [Y]: [component]}) // add new nodes if needed
get_compact_dag_draft(target=[plan name]) // remind yourself of where you want to extend
connect_nodes(plan_name=[plan name], edges={[B]: [X], [X]: [Y], [Y]: [C]}) // creates new path from B to C via X and Y

Extending from leaf nodes:
add_nodes_to_dag(plan_name=[plan name], nodes={[X]: [component], [Y1]: [component], [Y2]: [component]}) // add new nodes if needed
get_compact_dag_draft(target=[plan name]) // identify the leaf node you want to extend from
connect_nodes(plan_name=[plan name], edges={[leaf node]: [X], [X]: [Y1, Y2]}) // creates new path from the leaf node to the new leaf nodes via X

Inserting a sub-DAG to replace an edge with a more complex structure:
// Use this when a single edge A → B needs to become a full sub-graph with branching, verification, or multiple nodes.
// Build the sub-DAG as an orphaned group first, then splice it in by deleting the replaced edge and rewiring.

// Step 1: build the sub-DAG as an orphaned group
add_nodes_to_dag(plan_name=[plan name], nodes={[X]: [component], [Y]: [component], [Z1]: [component], [Z2]: [component]})
connect_nodes(plan_name=[plan name], edges={[X]: [Y], [Y]: [[Z1], [Z2]]}) // wire the sub-DAG internally
get_compact_dag_draft(target=[plan name]) // verify the sub-DAG is correctly wired as an orphaned group

// Step 2: delete the edge(s) being replaced
delete_edge(plan_name=[plan name], from=[A], to=[B]) // disconnect A from B to open the insertion point
get_compact_dag_draft(target=[plan name]) // verify the edge is removed and B is now reachable only through the sub-DAG

// Step 3: splice the sub-DAG into the main chain
connect_nodes(plan_name=[plan name], edges={[A]: [X], [Z1]: [B]}) // A → sub-DAG entry, sub-DAG success exit → B
// Z2 is a new leaf — set it as an exit point during finalization
get_compact_dag_draft(target=[plan name]) // verify the sub-DAG is integrated and no orphaned groups remain

Finalization of a DAG:
get_compact_dag_draft(target=[plan name]) // confirm the structure is correct and matches your intended revisions
set_entry_point(plan_name=[plan name], node_id=[first work node])
set_exit_point(plan_name=[plan name], node_id=[success leaf], type="success") // call this for every success pathway
set_exit_point(plan_name=[plan name], node_id=[failure leaf], type="failure") // call this for every failure pathway
validate_dag(plan_name=[plan name]) // if this fails, identify the structural issues and fix them using the appropriate tools until it passes validation
</example>
