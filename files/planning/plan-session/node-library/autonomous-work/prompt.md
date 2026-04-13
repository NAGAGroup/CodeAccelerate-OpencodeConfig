**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}

This node is reached only after all retry attempts in a fix→verify sequence have failed.
</goal>

<rules>
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Compose a dispatch prompt that includes full context of what was attempted, what failed, and what needs to be resolved. Then dispatch autonomous-agent using the task tool.
2. Call next_step.
</instructions>
