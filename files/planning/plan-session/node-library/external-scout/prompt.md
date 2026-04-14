**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve the project survey findings and identified knowledge gaps from session memory, then dispatch external-scout to research external unknowns about dependencies, frameworks, tools, and practices that will shape the execution plan.
</goal>

<rules>
Never instruct the scout to research in order to solve the user's request — only to resolve planning questions about external dependencies and technologies.
Always assume research is needed when external libraries, frameworks, APIs, or third-party practices are involved in the planning decision.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "project survey findings and identified external dependencies" to retrieve what the internal survey found about the codebase's tech stack, frameworks, external libraries, and dependencies.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "gaps from internal research requiring external validation" to retrieve what the internal investigation could not answer — unknowns about external libraries, versions, practices, or capabilities.
3. Compose a structured dispatch prompt for external-scout. Include:
   - The plan name {{PLAN_NAME}}
   - The specific research question from {{DESCRIPTION}} — the external unknown to resolve
   - Why this question matters to the plan — what decision it will inform
   - What the internal survey found that generated this external question (the gap) — context that explains why the question matters and what the scout should focus on
   - Any project-specific constraints the research must account for — language versions, existing dependency choices, tech stack exclusions, or compatibility requirements
   - Research scope: the scout should answer the planning question specifically, not produce a comprehensive treatise on the topic
4. Dispatch external-scout using the task tool.
5. Call next_step.
</instructions>
