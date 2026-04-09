---
name: dag-revision-example
description: Worked example of DAG revision — inserting nodes mid-chain, extending retry paths, rerouting edges, and avoiding orphans.
---
<overview>
This is a reference artifact. You are modifying an existing DAG, not building from scratch. Before making any changes, identify which pattern below applies to each critique point and write your target adjacency list. Then execute.
</overview>

<example name="starting-state">
The examples below operate on this first-pass DAG.

(research-framework: project-search-and-analysis) → (select-framework: work-item) → (plan-blueprint: work-item) → (verify-blueprint: verify) → [fix-blueprint, implement]
(fix-blueprint: work-item) → (verify-blueprint-retry: verify) → [implement, notes-blueprint-failure]
(implement: work-item) → (verify-hookup: verify) → [notes-hookup-success, fix-hookup]
(fix-hookup: work-item) → (verify-hookup-retry: verify) → [notes-hookup-success, notes-hookup-failure]
(notes-hookup-success: write-notes)
(notes-blueprint-failure: write-notes)
(notes-hookup-failure: write-notes)
</example>

<example name="pattern-1-insert-mid-chain">
Goal: insert external-scout between select-framework and plan-blueprint.

Use insert_between — it atomically removes the old edge and wires the new path in one call.
Never use delete_edge + connect_nodes for mid-chain insertions — that creates intermediate orphan states.

  add_node(plan_name="my-plan", nodeId="scout-framework", component_name="external-scout")
  insert_between(plan_name="my-plan", from="select-framework", to="plan-blueprint", new_node="scout-framework")

Result:
(select-framework: work-item) → (scout-framework: external-scout) → (plan-blueprint: work-item)
</example>

<example name="pattern-2-insert-decision-gate">
Goal: insert user-decision-gate after scout-framework. The gate needs exactly 2 children — insert_between gives it 1, so the second branch must be wired manually.

  add_node(plan_name="my-plan", nodeId="gate-framework-choice", component_name="user-decision-gate")
  insert_between(plan_name="my-plan", from="scout-framework", to="plan-blueprint", new_node="gate-framework-choice")
  connect_nodes(plan_name="my-plan", edges={"gate-framework-choice": "research-framework"})
  get_compact_dag_draft(target="my-plan")

Result:
(scout-framework: external-scout) → (gate-framework-choice: user-decision-gate) → [plan-blueprint, research-framework]
</example>

<example name="pattern-3-extend-retry-chain">
Goal: increase hookup retry depth from 1 to 2.

Current chain:
(verify-hookup: verify) → [notes-hookup-success, fix-hookup]
(fix-hookup: work-item) → (verify-hookup-retry: verify) → [notes-hookup-success, notes-hookup-failure]

Step 1: create new retry nodes.
  add_nodes_to_dag(plan_name="my-plan", nodes={"fix-hookup-2": "work-item", "verify-hookup-retry-2": "verify", "notes-hookup-failure-2": "write-notes"})

Step 2: remove old failure edge.
  delete_edge(plan_name="my-plan", from="verify-hookup-retry", to="notes-hookup-failure")

Step 3: wire new retry cycle and delete orphaned node.
  connect_nodes(plan_name="my-plan", edges={"verify-hookup-retry": "fix-hookup-2", "fix-hookup-2": "verify-hookup-retry-2", "verify-hookup-retry-2": ["notes-hookup-success", "notes-hookup-failure-2"]})
  delete_node(plan_name="my-plan", nodeId="notes-hookup-failure")
  get_compact_dag_draft(target="my-plan")

Result:
(verify-hookup-retry: verify) → [notes-hookup-success, fix-hookup-2]
(fix-hookup-2: work-item) → (verify-hookup-retry-2: verify) → [notes-hookup-success, notes-hookup-failure-2]
</example>

<example name="pattern-4-reroute-failure-path">
Goal: route the blueprint failure through user-discussion before terminating instead of exiting immediately.

  add_nodes_to_dag(plan_name="my-plan", nodes={"discuss-blueprint-failure": "user-discussion", "notes-blueprint-failure-final": "write-notes"})
  delete_edge(plan_name="my-plan", from="verify-blueprint-retry", to="notes-blueprint-failure")
  connect_nodes(plan_name="my-plan", edges={"verify-blueprint-retry": "discuss-blueprint-failure", "discuss-blueprint-failure": "notes-blueprint-failure-final"})
  delete_node(plan_name="my-plan", nodeId="notes-blueprint-failure")
  get_compact_dag_draft(target="my-plan")

Result:
(verify-blueprint-retry: verify) → [implement, discuss-blueprint-failure]
(discuss-blueprint-failure: user-discussion) → (notes-blueprint-failure-final: write-notes)
</example>

<example name="pattern-5-insert-prerequisite-multiple-parents">
Goal: insert run-project-commands before implement. implement has two parents (verify-blueprint pass path and verify-blueprint-retry pass path) — use insert_between once per parent edge.

  add_node(plan_name="my-plan", nodeId="install-deps", component_name="run-project-commands")
  insert_between(plan_name="my-plan", from="verify-blueprint", to="implement", new_node="install-deps")
  insert_between(plan_name="my-plan", from="verify-blueprint-retry", to="implement", new_node="install-deps")
  get_compact_dag_draft(target="my-plan")

Result:
(verify-blueprint: verify) → [fix-blueprint, install-deps]
(verify-blueprint-retry: verify) → [implement, install-deps]
(install-deps: run-project-commands) → (implement: work-item)
</example>

<rules>
Always clean up orphaned nodes immediately after delete_edge makes them unreachable. Never accumulate orphans.
Always call get_compact_dag_draft after each structural change — verify incrementally, not at the end.
Use insert_between for all mid-chain insertions. Never substitute delete_edge + connect_nodes.
Decision gates and user-decision-gates must have exactly 2 children after every change.
All leaf nodes must be write-notes after every change.
</rules>
