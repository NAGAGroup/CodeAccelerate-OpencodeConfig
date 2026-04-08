**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-tailwrench
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Run Project Commands

## Goal
Run shell commands to build, test, or configure the project.

## Instructions

1. Use the `delegating-to-tailwrench` skill to compose a dispatch prompt — think through what commands need to run, in what order, what preconditions must be satisfied, and what success looks like
2. Dispatch tailwrench using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Are the commands in the right order — do any depend on others completing first?
- Have I specified what success looks like so tailwrench knows when it's done?
- Are there preconditions that need to be satisfied before these commands can run?
