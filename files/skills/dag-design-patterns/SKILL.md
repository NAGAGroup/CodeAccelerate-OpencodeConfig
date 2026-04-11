---
name: dag-design-patterns
description: Patterns for DAG construction — sequential phases, verify-retry structures, decision branches, cluster wiring, and finalization.
---

<example>
// connect_nodes edges format: {from: to} — left node runs before right node
// {A: B} means A → B in execution order, matching the compact draft notation (A) → (B)
//
// CRITICAL: JSON objects do not allow duplicate keys. To wire two children from one parent,
// you MUST use an array: {A: [B, C]} — NOT {A: B, A: C} (the second key silently overwrites the first).
// This is the most common wiring mistake. Always use arrays for branching nodes.

Building a sequential phase:
add_nodes_to_dag(plan_name=[plan name], nodes={[A]: [component], [B]: [component], [C]: [component]})
connect_nodes(plan_name=[plan name], edges={[A]: [B], [B]: [C]}) // A runs first, then B, then C
get_compact_dag_draft(target=[plan name]) // expected: (A) → (B) → (C)

Building a verify-retry structure (default 1 retry):
add_nodes_to_dag(plan_name=[plan name], nodes={[work]: "work-item", [verify]: "verify", [fix]: "work-item", [verify-retry]: "verify", [exit-fail]: "write-notes"})
connect_nodes(plan_name=[plan name], edges={[work]: [verify], [verify]: [[exit-success], [fix]], [fix]: [verify-retry], [verify-retry]: [[exit-success], [exit-fail]]})
get_compact_dag_draft(target=[plan name])

Building a decision branch (mutually exclusive paths — parallel work is not supported):
add_nodes_to_dag(plan_name=[plan name], nodes={[gate]: "decision-gate", [branch-a]: [component], [branch-b]: [component]})
connect_nodes(plan_name=[plan name], edges={[before-gate]: [gate], [gate]: [[branch-a], [branch-b]]})
get_compact_dag_draft(target=[plan name])

Connecting clusters (wiring phases together):
get_compact_dag_draft(target=[plan name]) // check current orphaned clusters before wiring
connect_nodes(plan_name=[plan name], edges={[end-of-phase-1]: [start-of-phase-2]})
get_compact_dag_draft(target=[plan name])

Finalization:
get_compact_dag_draft(target=[plan name]) // confirm structure matches intended design
set_entry_point(plan_name=[plan name], node_id=[first work node])
set_exit_point(plan_name=[plan name], node_id=[success leaf], type="success") // call this for every success pathway
set_exit_point(plan_name=[plan name], node_id=[failure leaf], type="failure") // call this for every failure pathway
validate_dag(plan_name=[plan name]) // if this fails, identify structural issues and fix them until it passes
</example>
