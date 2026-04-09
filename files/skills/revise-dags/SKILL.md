---
name: revise-dags
description: Teaches how to revise an existing execution DAG — inserting nodes, extending retries, rerouting paths, and incorporating specialist components from the full catalogue.
---
<overview>
You are modifying an existing DAG based on reviewer feedback, not building from scratch. Plan all changes as a target adjacency list before touching anything. Execute against the plan.
</overview>

<procedure name="how-to-start">
1. Call get_planning_components_catalogue without variant to load the full catalogue including specialist nodes.
2. Call get_compact_dag_draft to read the current structure.
3. Map each critique point to a specific structural change.
4. Write your target adjacency list before making any changes.
5. Execute changes using the patterns from dag-revision-example, verifying with get_compact_dag_draft after each change.
6. Call set_entry_point on the first work node and set_exit_point on every write-notes leaf. Call validate_dag.
</procedure>

<rules>
Every verify node must have exactly 2 children after every change.
Every decision-gate and user-decision-gate must have exactly 2 children after every change.
Every leaf node must be write-notes after every change.
No cycles, no dead ends, no orphaned nodes.
Address every reviewer critique point. If you identify additional issues the reviewer missed, fix those too.
</rules>

<procedure name="planning-your-changes">
Before touching the DAG, write out:
nodes to add with their component types
insertions — which node goes between which existing pair
retry extensions — which verify chains need more depth
edge removals — which connections must change
edge additions — which new connections are needed
convergence points — where multiple paths meet

Commit to this plan before executing. Do not improvise mid-revision.
</procedure>
