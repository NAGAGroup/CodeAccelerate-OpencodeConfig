**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task, get_branch_options
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve what was implemented and any prior failure history, then dispatch tailwrench to verify the work against {{DESCRIPTION}}.
</goal>

<rules>
Always produce a clear pass or fail outcome.
Always surface findings before routing so the branch decision is evidence-based.
Never instruct tailwrench on how to verify — that is tailwrench's own protocol.
Never ask tailwrench to make edits to source code or documentation. The tailwrench subagent can only edit config files and build system config files.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "implementation work completed files changed and approach" — retrieve what was implemented: the changes made and the approach taken.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "failed attempts verification failures triage findings and fix attempts" — retrieve failure history and prior triage context. If this is the first verification attempt, this query may return nothing — that is expected.
3. Compose a dispatch prompt for tailwrench. Include: plan name {{PLAN_NAME}}, the success criteria from {{DESCRIPTION}}, what was implemented from step 1, and — if step 2 returned results — the full failure history, triage findings, and what the fix addressed.
4. Dispatch tailwrench using the task tool.
5. Call get_branch_options to retrieve the available branch node IDs.
6. Call next_step with the appropriate branch based on tailwrench's pass or fail verdict.
</instructions>
