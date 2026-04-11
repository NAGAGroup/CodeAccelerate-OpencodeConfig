**Plan Name:** {{PLAN_NAME}}
**Required Skills:** external-scout
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Search online resources for unknowns that must be answered to create a plan for the user's request effectively. This is a broad and shallow web searching task to answer planning questions only. More detailed searches can and should be included in the final plan to answer more specific questions (e.g. exact external APIs, user documentation for external dependencies, available options for making dependency decisions, best practices, etc.)
</goal>

<rules>
Only search what is necessary to aid in planning, not in solving the user's request or other problems that should be deferred to execution of the plan.
Don't delegate external-scout to make specific searches. Instead, present the questions you need resolved regarding planning and let external-scout leverage their specialized knowledge in web research tasks to find those answers for you.
Always assume research is needed if external resources/dependencies are involved. Don't rely on your current knowledge, which may be out of date. Always refresh your knowledge with the latest information from the web using external-scout.
</rules>

<instructions>
1. Load the external-scout skill. Use it to compose a dispatch prompt — identify specific research areas from the scout findings and user's request: frameworks, libraries, APIs, domain knowledge, or assumptions to verify.
2. Dispatch external-scout using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>
