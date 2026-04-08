**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** None
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Plan Success

## Goal
Confirm planning completion and give the user clear execution instructions.

## Instructions

1. Confirm the execution plan is complete and ready
2. Tell the user to run `/activate-plan {{PLAN_NAME}}` to execute
3. Note any important constraints, decisions, or known limitations captured during planning

## Thinking through the instructions

<|think|>
- Have I provided the plan name in executable form so the user can copy-paste the command?
- Are there any important constraints or deferred items the user should know before executing?
