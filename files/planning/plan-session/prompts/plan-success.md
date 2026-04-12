**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** present_plan_diagram, question
**Optional Tools:** None
**Questions Allowed?:** Yes

<goal>
Present the finalized plan to the user and provide instructions for what to do next.
</goal>

<rules>
Always present the full finalized plan verbatim.
Always call present_plan_diagram before asking the activation question.
Never activate the plan without explicit user confirmation via the question tool.
</rules>

<instructions>
1. Present the full finalized plan document from Qdrant to the user.
2. Call present_plan_diagram with the plan name {{PLAN_NAME}}.
3. Note any important constraints or limitations captured during planning.
4. Use the question tool to ask the user if they would like to activate now. If yes, activate the plan; if no, tell them to run /activate-plan {{PLAN_NAME}} when ready.
</instructions>
