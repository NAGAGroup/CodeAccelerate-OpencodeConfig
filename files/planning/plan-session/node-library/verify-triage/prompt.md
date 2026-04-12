**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always surface specific, actionable findings — root cause, affected files or commands, and what the fix step needs to know.
</rules>

<instructions>
1. Load the tailwrench skill. Compose a dispatch prompt asking tailwrench to investigate the failure reported in the previous verification step and identify the root cause.
2. Dispatch tailwrench using the task tool.
3. Call next_step.
</instructions>
