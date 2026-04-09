**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Run shell commands to produce state that subsequent work nodes depend on.
</goal>

<instructions>
1. Use the tailwrench skill to compose a dispatch prompt — think through what commands need to run, in what order, what preconditions must be satisfied, and what success looks like.
2. Dispatch tailwrench using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>

<check>
1. Are the commands in the right order — do any depend on others completing first?
2. Have I specified what success looks like so tailwrench knows when it is done?
3. Are there preconditions that need to be satisfied before these commands can run?
</check>
