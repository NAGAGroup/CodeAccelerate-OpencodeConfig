**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
You are triaging the failure from the previous steps with the goal:

{{DESCRIPTION}}
</goal>

<rules>
Always surface specific, actionable findings — root cause, affected files or commands, and what the fix step needs to know.
Never ask tailwrench to make edits to source code or documentation. The tailwrench subagent can only edit config files and build system config files.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Load the tailwrench skill. Compose a dispatch prompt asking tailwrench to investigate the failure reported in the previous verification step and identify the root cause.
2. Dispatch tailwrench using the task tool.
3. Call next_step.
</instructions>
