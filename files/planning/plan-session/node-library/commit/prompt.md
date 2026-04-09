**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Stage and commit changes at a meaningful save point.
</goal>

<instructions>
1. Use the tailwrench skill to compose a dispatch prompt — think through what changed since the last commit, whether the project is in a stable committable state, and what the commit message should convey.
2. Dispatch tailwrench using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>

<check>
1. Is the project in a stable state — would committing now leave things in a broken or incomplete state?
2. Does the commit message accurately describe what changed and why?
3. Are there any files that should be excluded from the commit?
</check>
