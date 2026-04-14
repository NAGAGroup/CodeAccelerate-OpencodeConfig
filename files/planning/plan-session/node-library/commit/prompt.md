**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Commit the following verified work:

{{DESCRIPTION}}
</goal>

<rules>
Always commit only the specific files retrieved from session notes — not all changed files.
Never stage or commit unrelated changes.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and work accomplished in this phase" to retrieve the original user request and a summary of what was implemented or documented.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "files changed and edit summary for this work phase" to retrieve the specific list of files modified, what changed in each, and what was verified as correct.
3. Compose a structured dispatch prompt. Include: the plan name {{PLAN_NAME}}, the specific files to stage from step 2 (tailwrench stages only these files, not all changed files), a commit message grounded in the user goal from step 1 and the work done, and the constraint that only the listed files should be staged.
4. Dispatch tailwrench using the task tool.
5. Call next_step.
</instructions>
