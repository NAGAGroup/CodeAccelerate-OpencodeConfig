**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-builder
**Required Tools:** task
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
1. Load the dag-builder skill.
2. One last check, does your plan match the markdown schema from the planning-schema exactly? If it does not, dag-builder will not be able to do its job correctly.
3. Dispatch dag-builder using the task tool with plan name {{PLAN_NAME}} and the finalized plan verbatim. Do not summarize or paraphrase.
4. Call next_step.
</instructions>

