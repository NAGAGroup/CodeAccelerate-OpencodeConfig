**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve the preceding context-scout's findings and flagged gaps from session memory, then dispatch context-insurgent to analyze specific code mechanisms, logic flows, and deep relationships that the scout identified as needing investigation.
</goal>

<rules>
Always include the plan name {{PLAN_NAME}} in the dispatch to context-insurgent. Non-negotiable—the insurgent cannot write findings to session memory without it.
The context-insurgent must start from the scout's findings, not from scratch. Without explicit retrieval and dispatch framing, the insurgent will treat this as a fresh investigation and re-do orientation work the scout already completed. Bridge the phases via Qdrant retrieval and explicit dispatch framing.
For work-phase pre-work nodes where {{DESCRIPTION}} is a bulleted list of multiple questions, the dispatch must explicitly instruct the insurgent to address all questions in the list.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "[topic] survey findings and inventory" to retrieve what the preceding context-scout found — the major parts, structure, and overview of the area under investigation.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "[topic] gaps and mechanisms flagged for deep analysis" to retrieve the specific code paths, mechanisms, relationships, or contradictions the scout identified as needing deeper investigation.
3. Compose a structured dispatch prompt for context-insurgent. Include:
   - The plan name {{PLAN_NAME}}
   - The specific question or area from {{DESCRIPTION}} (identical to what the scout received) — the question this analysis will answer
   - The scout's key findings (retrieved in step 1) — so the insurgent starts from the scout's inventory, not from scratch
   - The specific mechanisms, code paths, or gaps the scout flagged (retrieved in step 2) — the exact follow-up work needed
   - What the downstream node or gate will need from this analysis — framed as success criteria (what decisions will this answer enable?)
   - If {{DESCRIPTION}} is a bulleted list, explicitly instruct the insurgent to address all questions in the list
4. Dispatch context-insurgent using the task tool.
5. Call next_step.
</instructions>
