**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve the verification failure output from the prior verify step, then dispatch tailwrench to reproduce, diagnose, and apply project-level fixes.
</goal>

<rules>
Always include the plan name {{PLAN_NAME}} in the dispatch.
Always provide the failed commands and error output retrieved from Qdrant — tailwrench cannot retrieve session context itself.
Never instruct tailwrench on how to investigate — that is covered by tailwrench's own protocol.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "verification failure output and failed commands" — retrieve the exact failed commands and their raw error output from the prior verify step.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "verification failure root cause or hypothesis" — retrieve any prior diagnostic findings from earlier triage cycles if this is a retry.
3. Compose a dispatch prompt for tailwrench. Include: plan name {{PLAN_NAME}}, the failed commands from step 1, the exact error output from step 1, the goal from {{DESCRIPTION}}, and any prior triage findings from step 2.
4. Dispatch tailwrench using the task tool.
5. Call next_step.
</instructions>
