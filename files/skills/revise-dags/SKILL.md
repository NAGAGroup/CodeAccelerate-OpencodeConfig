---
name: revise-dags
description: Teaches how to revise an existing execution DAG — inserting nodes, extending retries, rerouting paths, and incorporating specialist components from the full catalogue.
---
<rules>
Your work is not done until the DAG addresses all reviewer critique points and validate_dag returns successfully.
Every verify node must have exactly 2 branches.
Every decision-gate and user-decision-gate must have exactly 2 branches.
You must set the entry point and exit points as the final step, where exit points are the failure/success writing-notes nodes.
Every exit node must be write-notes.
Use the get_compact_dag_draft and validate_dag tools frequently to check your work as you go. Do not wait until the end to find structural issues.
</rules>

<getting started>
1. Search the plan notes for any additional revision or planning info that wasn't provided already.
2. Plan ahead. Decide which tool calls are needed and in what order. Make your best effort, it doesn't need to be perfect. It just helps to have a roadmap before you start making changes. You can adjust as you go.
3. Once you've mapped out the tool call plan, begin working and do not stop until you have finished. After any connect_nodes call, immediately call get_compact_dag_draft and verify the edges flow in the correct direction before continuing.
</getting started>
