**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-builder
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Dispatch the dag-builder to compile the finalized plan into a phase-based execution DAG.
</goal>

<rules>
Never make DAG building decisions yourself — all phase creation is delegated to dag-builder.
Always pass the finalized plan verbatim — never summarize or interpret it.
</rules>

<instructions>
1. Load the dag-builder skill.
2. One last check, does your plan match the markdown schema from the planning-schema exactly? If it does not, dag-builder will not be able to do its job correctly.
3. Dispatch dag-builder using the task tool with plan name {{PLAN_NAME}} and the finalized plan verbatim. Do not summarize or paraphrase.
4. Call next_step.
</instructions>

