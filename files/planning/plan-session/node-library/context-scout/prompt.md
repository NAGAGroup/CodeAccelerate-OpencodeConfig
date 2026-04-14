**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve the user's goal and prior survey findings from session memory, then dispatch context-scout to survey the project and build broad understanding of structure, conventions, and planning-relevant constraints.
</goal>

<rules>
Always include the plan name {{PLAN_NAME}} in the dispatch to context-scout. Non-negotiable—the scout cannot write findings to session memory without it.
The survey must focus on planning-relevant signals: constraints that would affect implementation decisions, patterns that implementations must follow, critical relationships between parts, and gaps that would shape the plan.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "user goal and implementation objective" to retrieve what the user wants to accomplish and the scope they're working within.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "prior survey findings and known constraints" to retrieve what is already known about the project's structure, conventions, and constraints so the scout builds on existing knowledge rather than re-surveying settled territory.
3. Compose a structured dispatch prompt for context-scout. Include:
   - The plan name {{PLAN_NAME}}
   - The survey topic or area from {{DESCRIPTION}} (the specific question or area to survey)
   - The user's goal (retrieved in step 1) — so the scout understands what matters for planning
   - What is already known about this area (retrieved in step 2) — so the scout adds new findings rather than duplicating work
   - What planning decision this survey will inform — the downstream consequence of this investigation
   - Clear headings for: what to survey, what planning-relevant questions to answer, and what signals to prioritize
4. Dispatch context-scout using the task tool.
5. Call next_step.
</instructions>
