**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Store a detailed failure summary and terminate execution.
</goal>

<instructions>
1. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store a failure summary — capture what was attempted, what failed, what was learned, and what a future attempt should do differently.
2. Respond to the user explaining what failed and why.
</instructions>

<check>
1. Have I captured enough detail about what failed so a future planning session can avoid the same outcome?
2. Have I included what was learned — not just what went wrong, but what it implies about the approach?
</check>
