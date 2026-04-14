**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Never ask tailwrench to make edits to source code or documentation. The tailwrench subagent can only edit config files and build system config files.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and project setup requirements" to retrieve the original user request and planning context that motivated these setup operations.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "project environment dependencies and build configuration" to retrieve known environment constraints, dependency versions, or build tool facts the setup must account for.
3. Compose a structured dispatch prompt. Include: the plan name {{PLAN_NAME}}, the setup steps from {{DESCRIPTION}}, the project context from step 1, any environment constraints from step 2, and the scope constraint that tailwrench may only edit config files and build system config files — not source code or documentation.
4. Dispatch tailwrench using the task tool.
5. Call next_step.
</instructions>
