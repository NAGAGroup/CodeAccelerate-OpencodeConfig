**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Resolve external unknowns needed to design an effective plan for the user's request.
</goal>

<rules>
Never research to solve the user's request — only to inform planning decisions.
Always assume research is needed when external dependencies are involved.
Never compose specific searches — present planning questions and let the scout determine how to find the answers.
</rules>

<instructions>
1. Identify the planning questions that cannot be answered from the project survey alone — unknowns about external libraries, frameworks, tools, APIs, or practices that will shape the plan.
2. Compose a structured dispatch prompt for external-scout. Include the plan name {{PLAN_NAME}} and the specific planning questions to resolve, structured as clear headings. Explain why each question matters to the plan.
3. Dispatch external-scout using the task tool.
4. Call next_step.
</instructions>
