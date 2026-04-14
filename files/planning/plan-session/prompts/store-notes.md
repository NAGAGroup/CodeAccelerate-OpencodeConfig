**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
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
1. Call qdrant_qdrant-store once for each finding and unknown.
2. Call next_step.
</instructions>
