**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve prior research findings and planning constraints from session memory, then dispatch deep-researcher to conduct comprehensive investigation on a novel, frontier, or insufficiently understood topic that will shape the plan.
</goal>

<rules>
Never research to solve the user's request — only to inform planning decisions.
Signal to the deep-researcher that this topic is complex enough to warrant comprehensive, multi-source investigation. The dispatch is a signal that prior research has been insufficient and that thoroughness is required.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "prior research and internal findings on this topic" to retrieve what prior investigation phases already established about this topic — what is known from earlier research or analysis.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "planning decisions and constraints relevant to this research area" to retrieve the planning context that will inform what depth and breadth of research is needed.
3. Compose a structured dispatch prompt for deep-researcher. Include:
   - The plan name {{PLAN_NAME}}
   - The specific research topic or question from {{DESCRIPTION}} — the topic requiring comprehensive investigation
   - Maximum project context (from step 2) — relevant planning constraints, decisions this research will inform, scope limitations, and technical context
   - What prior nodes already know about this topic (from step 1) — so the researcher builds on existing knowledge rather than starting from zero
   - What the plan needs from this research — what decision it will inform, at what level of confidence, and why comprehensive investigation is necessary
   - Signal that this is comprehensive research: the topic is complex, contested among authoritative sources, or insufficient prior understanding for a planning decision
4. Dispatch deep-researcher using the task tool.
5. Call next_step.
</instructions>
