**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Dispatch the dag-builder to compile the finalized plan into a phase-based execution DAG.
</goal>

<rules>
Always perform one last check before dispatching to ensure the plan is sufficient and meets all requirements.
Always pass the finalized plan verbatim to dag-builder — never summarize or interpret it.
Always continue to the next planning step. This is not the final planning step.
</rules>

<instructions>
1. Use qdrant_qdrant-find to retrieve the finalized plan from the vector database. Ensure that the retrieved plan is complete and meets all requirements before proceeding.
2. Dispatch dag-builder using the task tool with plan name {{PLAN_NAME}} and the finalized plan verbatim. Do not summarize or paraphrase.
3. Call next_step.
</instructions>

