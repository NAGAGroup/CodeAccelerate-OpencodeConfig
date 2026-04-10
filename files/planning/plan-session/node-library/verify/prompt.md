**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Verify the most recent change meets its acceptance criteria.
</goal>

<instructions>
1. Load the tailwrench skill. Use it to compose a dispatch prompt — think through what was just implemented, what the acceptance criteria are, and what a passing verification looks like.
2. Dispatch tailwrench using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>

<check>
1. What was actually implemented in the prior step — am I verifying that, not something else?
2. Are my acceptance criteria specific and objective — pass or fail, not subjective?
3. Have I described what a passing result looks like so tailwrench knows when it is done?
</check>
