---
name: build-dags-core
description: Teaches how to build a structurally valid MVP execution DAG from the core component catalogue using the staged construction procedure.
---
<rules>
Your work is not done until validate_dag returns successfully.
Only use the core catalogue — call get_planning_components_catalogue with variant="core".
Every verify node must have exactly 2 branches.
Every decision-gate and user-decision-gate must have exactly 2 branches.
Branches are mutually exclusive — no parallel work.
Node IDs must be descriptive. Never use generic names like node-1 or step-3.
You must set the entry point and exit points as the final step, where exit points are the failure/success writing-notes nodes.
Every exit node must be write-notes.
Use get_compact_dag_draft frequently to check your work as you go. Do not wait until the end to find structural issues.
</rules>

<getting started>
1. Search session notes for design goals, constraints, and planning context.
2. Plan ahead. Decide what phases you need and what the key structural decisions are. Make your best effort, it doesn't need to be perfect — you can adjust as you go.
3. Once you've mapped out your approach, begin working and do not stop until you have finished. After your first connect_nodes call, immediately call get_compact_dag_draft and verify the edges flow in the correct direction before continuing. Build in stages, checking frequently with get_compact_dag_draft and adjusting as needed until validate_dag returns successfully.
</getting started>
