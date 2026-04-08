**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Verify

## Goal
Verify the most recent change meets its acceptance criteria.

## Instructions

1. Use the `delegating-to-tailwrench` skill to compose a dispatch prompt — think through what was just implemented, what the acceptance criteria are, and what a passing verification looks like
2. Dispatch tailwrench using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- What was actually implemented in the prior step — am I verifying that, not something else?
- Are my acceptance criteria specific and objective — pass or fail, not subjective?
- Have I described what a passing result looks like so tailwrench knows when it's done?
