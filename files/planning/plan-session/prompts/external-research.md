**Plan Name:** {{PLAN_NAME}}
**Required Skills:** external-scout
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Research external public information that the project depends on or that scout findings raised questions about.
</goal>

<instructions>
1. Use the external-scout skill to compose a dispatch prompt — identify specific research areas from the scout findings: frameworks, libraries, APIs, domain knowledge, or assumptions to verify.
2. Dispatch external-scout using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>

<check>
1. What specific questions from the scout findings require external research?
2. Have I used only public, general terms — no internal names or proprietary details?
3. Have I asked for confidence tagging (verified, inferred, uncertain) and an unknowns section?
4. Is the research question scoped narrowly enough to produce focused findings?
</check>
