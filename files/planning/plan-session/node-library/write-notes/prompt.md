**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** qdrant_qdrant-find
**Questions Allowed?:** No

<goal>
Store durable, self-contained notes about what happened in this phase. If this node follows multiple upstream phases, retrieve their findings before writing.
</goal>

<rules>
Always write each note as self-contained prose: name the goal, what was found or decided, why it matters for the plan, and what constraints or decisions it encodes. A future agent reading only this note must fully understand it without surrounding context.
Always call qdrant_qdrant-store once per significant finding, decision, or outcome.
Never write a note that requires surrounding context to make sense.
</rules>

<instructions>
1. If {{DESCRIPTION}} indicates a checkpoint synthesising multiple prior phases, call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the key findings from those phases before writing.
2. Call qdrant_qdrant-store once per significant finding, decision, or outcome. Each note must be self-contained prose per the rules above.
3. Call next_step.
</instructions>
