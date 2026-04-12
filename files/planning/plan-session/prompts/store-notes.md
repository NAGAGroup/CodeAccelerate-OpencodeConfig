**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Persist all significant findings, unknowns, and constraints from the investigation phases to semantic notes.
</goal>

<rules>
Always cover: user's goal and scope, scout findings, research outcomes, unresolved unknowns, and constraints affecting plan design.
Always write each note as self-contained prose.
Never store procedural details — only things that shape plan structure.
</rules>

<instructions>
1. Load the qdrant-notes skill. Write down how you will use it to produce quality notes.
2. Organize findings into distinct, self-contained note items.
3. Call qdrant_qdrant-store for each note item in the {{PLAN_NAME}} collection.
4. Call next_step.
</instructions>
