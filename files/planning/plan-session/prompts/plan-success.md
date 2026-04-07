# DAG Node: Plan Success
**Skills:** None
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** (none)
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Confirm planning completion and give the user clear execution instructions.

## Instructions
Confirm the execution plan is complete and ready. Provide the plan name `{{PLAN_NAME}}` clearly so the user knows exactly what to pass to `/activate-plan`. Note any important constraints or decisions captured during planning. Note any deferred items or known limitations. Tell the user to run `/activate-plan {{PLAN_NAME}}` to execute.

## Constraints
- provide plan name in executable form
- confirm completion
- include important constraints or limitations
- give clear execution instructions
