---
name: following-plans
description: Teaches how to execute DAG step sequences exactly as specified, handling enforcement errors and context recovery.
---
<overview>
Every DAG node prompt specifies skills to load, required tools to call in order, and a goal to accomplish. Execute these exactly. The enforcement engine blocks next_step until required tools are called.
</overview>

<procedure name="how-to-execute-a-node">
1. Load every skill listed in the Skills section before doing anything else.
2. Call every tool in the Required Tools section in the order listed.
3. Complete the node's goal as described in the Instructions section.
4. Call next_step immediately after the goal is complete. Do not summarize, reflect, or wait.
</procedure>

<procedure name="handling-enforcement-blocks">
If a tool call is blocked, a required tool earlier in the sequence has not been called yet. Check the Required Tools list and call the missing tool before retrying.
</procedure>
