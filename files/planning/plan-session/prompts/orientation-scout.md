**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve the user's goal and constraints from session memory, then dispatch context-scout to survey the project and build broad understanding of structure, conventions, and planning-relevant constraints.
</goal>

<rules>
Always include the plan name in the dispatch to context-scout. Non-negotiable—the scout cannot write findings to session memory without it.
Always focus the scout on planning-relevant questions: what constraints exist, what patterns or conventions the implementation must follow, what would invalidate or break potential plans. Don't ask for general orientation—ask for what would affect planning decisions.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and request" to retrieve what the user is asking for.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user involvement and constraints" to retrieve the user's involvement preference and scope constraints.
3. Compose a structured dispatch prompt for context-scout. Include: the plan name {{PLAN_NAME}}, the user's goal (so the scout understands the planning focus), the user's constraints and exclusions, specific areas of the project most relevant to planning, and clear headings for: what to survey, what planning-relevant questions to answer, and what findings to prioritize. The questions should drive planning decisions, not general exploration.
4. Dispatch context-scout using the task tool.
5. Call next_step.
</instructions>
