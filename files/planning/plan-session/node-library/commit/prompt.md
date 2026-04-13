**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always commit only the work described in the goal.
Never stage or commit unrelated changes.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Dispatch tailwrench using the task tool.
2. Call next_step.
</instructions>
