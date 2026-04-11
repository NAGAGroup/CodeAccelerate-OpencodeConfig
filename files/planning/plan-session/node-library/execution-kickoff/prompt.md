**Plan Name:** {{PLAN_NAME}}
**Required Skills:** following-plans, qdrant-notes
**Required Tools:** get_compact_dag_draft, qdrant_qdrant-find, qdrant_qdrant-store
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Orient to the plan structure and retrieve planning context before execution begins.
</goal>

<instructions>
1. Call get_compact_dag_draft to read node IDs, component types, and the full plan structure.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}} to retrieve planning context — what was discovered, what constraints were documented, what rationale informed the design.
3. Call qdrant_qdrant-store with collection {{PLAN_NAME}} to store executor-framed orientation notes — restate the goal and execution strategy from your perspective.
4. Call next_step.
</instructions>


