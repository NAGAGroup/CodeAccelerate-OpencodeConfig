**Plan Name:** {{PLAN_NAME}}
**Required Skills:** following-plans, qdrant-notes
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve planning context and orient to the plan's goal before execution begins.
</goal>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve the planning context and overall goal.
2. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store executor-framed orientation notes.
3. Call next_step.
</instructions>
