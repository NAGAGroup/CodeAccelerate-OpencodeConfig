**Plan Name:** {{PLAN_NAME}}
**Required Skills:** following-plans
**Required Tools:** choose_plan_name, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Establish plan identity and store the user's goal to session notes.
</goal>

<rules>
Always name the plan after what it will accomplish, not the planning session itself.
Always use lowercase with hyphens only.
</rules>

<instructions>
1. Call choose_plan_name with a descriptive, lowercase, hyphenated plan name.
2. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store the user's goal and request exactly as stated.
3. Call next_step.
</instructions>
