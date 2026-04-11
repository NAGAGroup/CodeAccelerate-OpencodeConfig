**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** present_dag_diagram, question
**Optional Tools:** None
**Questions Allowed?:** Yes

<goal>
Present the finalized plan to the user and provide instructions for what to do next.
</goal>

<rules>
Present the full finalized plan document verbatim. Do not summarize, abbreviate, or paraphrase it.
Both the plan document and the DAG diagram must be presented to the user. Neither may be omitted.
Do not activate the plan unless the user explicitly confirms via the question tool.
</rules>

<instructions>
1. Confirm the execution plan is complete and ready.
2. Present the full finalized plan document you stored via qdrant earlier to the user.
3. Call present_dag_diagram with the plan name {{PLAN_NAME}} to display the finalized DAG diagram to the user.
4. Note any important constraints, decisions, or known limitations captured during planning.
5. Tell the user to run /activate-plan {{PLAN_NAME}} to execute
6. Use the question tool to ask the user if they would like to activate now. If so, you should activate the plan yourself, which will initiate exection. If not, instruct them to run the activation command in this session or a new one when they are ready.
</instructions>
