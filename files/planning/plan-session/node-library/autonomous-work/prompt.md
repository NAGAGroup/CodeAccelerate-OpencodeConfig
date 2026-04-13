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
Always provide full context of what was attempted, what failed, and what needs to be resolved.
</rules>

<instructions>
1. Dispatch autonomous-agent using the task tool.
2. Call next_step.
</instructions>
