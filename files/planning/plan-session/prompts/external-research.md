**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, qdrant_qdrant-find, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Review project survey findings to identify external unknowns, then dispatch external-scout to resolve planning questions about dependencies, frameworks, tools, and practices that will shape the execution plan.
</goal>

<rules>
Never research to solve the user's request — only to inform planning decisions.
Always assume research is needed when external dependencies are involved.
Never compose specific searches — present planning questions and let the scout determine how to find the answers.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "project survey findings" to retrieve what context-scout discovered about the project.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "external dependencies and frameworks identified" to retrieve what external libraries or frameworks the survey mentioned.
3. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "gaps and unknowns from project survey" to identify what the survey could not answer.
4. Identify the planning questions that cannot be answered from the project survey alone — unknowns about external libraries, frameworks, tools, APIs, or practices that will shape the plan. For each question, note what the survey found and why that finding left the question unanswered.
5. Compose a structured dispatch prompt for external-scout. Include: the plan name {{PLAN_NAME}}, the specific planning questions to resolve, the context from the survey that generated each question (not just the question, but why the survey left it unanswered), and why each question matters to the plan.
6. Dispatch external-scout using the task tool.
7. Call next_step.
</instructions>
