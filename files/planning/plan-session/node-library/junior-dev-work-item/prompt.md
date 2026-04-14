**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Dispatch junior-dev to implement the work described in {{DESCRIPTION}}, equipped with the pre-work research context that shapes the implementation.
</goal>

<rules>
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
Never ask junior-dev to run shell commands. The junior-dev can only make file edits.
Always include code conventions and constraints from prior research — junior-dev must not re-derive what pre-work already established.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and implementation objective" to retrieve the original user request and planning intent for this work.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "project survey findings conventions and constraints" to retrieve the code conventions, structural patterns, and naming conventions that the implementation must follow.
3. Compose a structured dispatch prompt for junior-dev. Include:
   - The goal from {{DESCRIPTION}} — which signals whether this is initial work or a fix attempt
   - Plan name {{PLAN_NAME}}
   - Code conventions and structural patterns from the project survey (from step 2) — the implementation must match these
   - Any relevant external research findings that constrain the implementation (API facts, library constraints, version requirements)
   - The verify-description for this work phase — what the next verify node will check, so junior-dev targets the right outcome
4. Dispatch junior-dev using the task tool.
5. Call next_step.
</instructions>
