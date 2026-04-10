---
name: dag-revision-example
description: Worked example of DAG revision — inserting nodes mid-chain, extending retry paths, rerouting edges, and avoiding orphans.
---
<rules>
Always plan changes as a target adjacency list before touching the DAG.
Use insert_between for all mid-chain insertions — never delete_edge + connect_nodes.
Clean up orphaned nodes immediately after any delete_edge.
Call get_compact_dag_draft after each structural change.
Every leaf must be write-notes after every change.
</rules>

<example>
Starting state — all patterns below operate on this DAG:

(research-framework: project-search-and-analysis) → (select-framework: work-item) → (plan-blueprint: work-item) → (verify-blueprint: verify) → [fix-blueprint, implement]
(fix-blueprint: work-item) → (verify-blueprint-retry: verify) → [implement, notes-blueprint-failure]
(implement: work-item) → (verify-hookup: verify) → [notes-hookup-success, fix-hookup]
(fix-hookup: work-item) → (verify-hookup-retry: verify) → [notes-hookup-success, notes-hookup-failure]
(notes-hookup-success: write-notes)
(notes-blueprint-failure: write-notes)
(notes-hookup-failure: write-notes)


Pattern 1 — Insert mid-chain (single parent, single child):
Goal: insert external-scout between select-framework and plan-blueprint.

  add_node(plan_name="my-plan", nodeId="scout-framework", component_name="external-scout")
  insert_between(plan_name="my-plan", from="select-framework", to="plan-blueprint", new_node="scout-framework")

Result: (select-framework) → (scout-framework) → (plan-blueprint)


Pattern 2 — Insert decision-gate (needs second branch wired manually):
Goal: insert user-decision-gate after scout-framework.

  add_node(plan_name="my-plan", nodeId="gate-framework-choice", component_name="user-decision-gate")
  insert_between(plan_name="my-plan", from="scout-framework", to="plan-blueprint", new_node="gate-framework-choice")
  connect_nodes(plan_name="my-plan", edges={"gate-framework-choice": "research-framework"})
  get_compact_dag_draft(target="my-plan")

Result: (scout-framework) → (gate-framework-choice) → [plan-blueprint, research-framework]


Pattern 3 — Extend retry chain (1 retry → 2):
Goal: increase hookup retry depth from 1 to 2.

  add_nodes_to_dag(plan_name="my-plan", nodes={"fix-hookup-2": "work-item", "verify-hookup-retry-2": "verify", "notes-hookup-failure-2": "write-notes"})
  delete_edge(plan_name="my-plan", from="verify-hookup-retry", to="notes-hookup-failure")
  connect_nodes(plan_name="my-plan", edges={"verify-hookup-retry": "fix-hookup-2", "fix-hookup-2": "verify-hookup-retry-2", "verify-hookup-retry-2": ["notes-hookup-success", "notes-hookup-failure-2"]})
  delete_node(plan_name="my-plan", nodeId="notes-hookup-failure")  // clean up orphaned node immediately
  get_compact_dag_draft(target="my-plan")


Pattern 4 — Reroute failure path:
Goal: route blueprint failure through user-discussion before terminating.

  add_nodes_to_dag(plan_name="my-plan", nodes={"discuss-blueprint-failure": "user-discussion", "notes-blueprint-failure-final": "write-notes"})
  delete_edge(plan_name="my-plan", from="verify-blueprint-retry", to="notes-blueprint-failure")
  connect_nodes(plan_name="my-plan", edges={"verify-blueprint-retry": "discuss-blueprint-failure", "discuss-blueprint-failure": "notes-blueprint-failure-final"})
  delete_node(plan_name="my-plan", nodeId="notes-blueprint-failure")  // clean up orphaned node immediately
  get_compact_dag_draft(target="my-plan")


Pattern 5 — Insert prerequisite before node with multiple parents:
Goal: insert run-project-commands before implement (implement has two parents).

  add_node(plan_name="my-plan", nodeId="install-deps", component_name="run-project-commands")
  insert_between(plan_name="my-plan", from="verify-blueprint", to="implement", new_node="install-deps")
  insert_between(plan_name="my-plan", from="verify-blueprint-retry", to="implement", new_node="install-deps")
  get_compact_dag_draft(target="my-plan")
</example>
