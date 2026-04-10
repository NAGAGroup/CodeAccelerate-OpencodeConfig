---
name: revise-dags
description: Teaches how to revise an existing execution DAG — inserting nodes, extending retries, rerouting paths, and incorporating specialist components from the full catalogue.
---
<rules>
Plan all changes before touching the DAG — write your target adjacency list first. Never improvise mid-revision.
Use the full catalogue — call get_planning_components_catalogue without variant.
Every verify node must have exactly 2 children after every change.
Every decision-gate and user-decision-gate must have exactly 2 children after every change.
Every leaf node must be write-notes after every change.
Address every reviewer critique point. Fix additional issues you identify beyond the critique.
</rules>

<example>
How to start:
  get_planning_components_catalogue()  // full catalogue, no variant
  get_compact_dag_draft(target="plan-name")  // read current structure

Plan your changes before touching the DAG. Write out:
  nodes to add with their component types
  insertions — which node goes between which existing pair
  retry extensions — which verify chains need more depth
  edge removals — which connections must change
  edge additions — which new connections are needed
  convergence points — where multiple paths meet

Execute against your plan using the patterns from dag-revision-example.
Verify with get_compact_dag_draft after each structural change.

Finalize:
  Set entry point and exit points
  validate_dag(plan_name="plan-name") // if it fails, you are not done

Handling invalid DAG:
Call get_compact_dag_draft to identify structural issues. Address all issues — not just the one that caused validation to fail. Repeat until get_compact_dag_draft shows no issues, then call validate_dag again to confirm.
</example>
