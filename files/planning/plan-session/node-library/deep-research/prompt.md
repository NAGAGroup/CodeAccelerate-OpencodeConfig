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
1. Compose a structured dispatch prompt based on the goal above and your delegation guidelines.
2. Dispatch deep-researcher using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>
