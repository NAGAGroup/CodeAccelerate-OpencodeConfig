**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Commit

## Goal
Stage and commit changes at a meaningful save point.

## Instructions

1. Use the `delegating-to-tailwrench` skill to compose a dispatch prompt — think through what changed since the last commit, whether the project is in a stable committable state, and what the commit message should convey
2. Dispatch tailwrench using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Is the project in a stable state — would committing now leave things in a broken or incomplete state?
- Does the commit message accurately describe what changed and why?
- Are there any files that should be excluded (secrets, credentials, build artifacts)?
