**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Notes must be self-contained prose — a future agent must understand them without re-investigating. Do not write shallow summaries.
</rules>

<instructions>
1. Load the qdrant-notes skill.
2. Store notes to collection {{PLAN_NAME}} covering what was accomplished, what was verified, decisions made, and any context a future session would need.
</instructions>
