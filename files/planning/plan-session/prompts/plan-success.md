**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** None
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Confirm planning completion and give the user clear execution instructions.
</goal>

<instructions>
1. Confirm the execution plan is complete and ready.
2. Tell the user to run /activate-plan {{PLAN_NAME}} to execute.
3. Note any important constraints, decisions, or known limitations captured during planning.
</instructions>

<check>
1. Have I provided the plan name in executable form so the user can copy-paste the command?
2. Are there any important constraints or deferred items the user should know before executing?
</check>
