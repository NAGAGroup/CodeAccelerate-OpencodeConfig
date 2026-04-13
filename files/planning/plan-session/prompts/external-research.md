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
Never compose specific searches for the scout — present planning questions and let the scout determine how to find the answers.
</rules>

<instructions>
1. Dispatch external-scout using the task tool with plan name {{PLAN_NAME}}.
2. Call next_step.
</instructions>
