**Plan Name:** {{PLAN_NAME}}
**Required Skills:** autonomous-agent
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
1. Load the autonomous-agent skill. Use it to compose a dispatch prompt with full context so the autonomous agent can resolve the issue independently.
2. Dispatch autonomous-agent using the task tool.
3. Call next_step.
</instructions>
