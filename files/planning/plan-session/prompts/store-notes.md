**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Persist all significant findings, decisions, and constraints from the investigation phases to semantic notes before context compression.
</goal>

<instructions>
1. Store each significant finding, decision, or constraint as a separate qdrant_qdrant-store call to collection {{PLAN_NAME}} — cover: user's goal and scope boundaries, scout findings, research outcomes, and constraints that will affect plan design.
2. Call next_step.
</instructions>

<check>
1. Have I stored the user's goal, scope boundaries, scout findings, research outcomes, and key constraints?
2. Is each note self-contained prose — could a future agent understand it without re-investigating?
3. Am I storing findings that shape plan structure, not procedural details?
</check>
