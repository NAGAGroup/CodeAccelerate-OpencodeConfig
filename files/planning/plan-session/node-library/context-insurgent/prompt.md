**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Dispatch context-insurgent using the task tool with plan name {{PLAN_NAME}}.
2. Call next_step.
</instructions>
