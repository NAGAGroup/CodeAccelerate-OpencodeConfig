**Plan Name:** {{PLAN_NAME}}
**Required Skills:** documentation-expert
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Never include shell operations in the dispatch.
</rules>

<instructions>
1. Load the documentation-expert skill. Use it to compose a dispatch prompt tailored to the goal above.
2. Dispatch documentation-expert using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>
