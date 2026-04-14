**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always include verified code facts from prior research — documentation-expert must not re-derive what prior investigation already established.
Never ask documentation-expert to make code changes.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and documentation objective" to retrieve the original user request and planning intent for this documentation work.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "project survey findings code facts and verified behaviors to document" to retrieve verified code facts, API shapes, and source-of-truth behaviors that the documentation must reflect.
3. Compose a structured dispatch prompt. Include: the plan name {{PLAN_NAME}}, the documentation goal from {{DESCRIPTION}}, the verified code facts from step 2 (documentation-expert must document these accurately, not re-derive them), any documentation conventions from prior research, and what the next verify node will check.
4. Dispatch documentation-expert using the task tool.
5. Call next_step.
</instructions>
