**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Compose a structured dispatch prompt based on the goal above and your delegation guidelines. If triage findings or verification failures from prior steps are available in context, include them in the prompt.
2. Dispatch documentation-expert using the task tool with plan name {{PLAN_NAME}}.
3. Call next_step.
</instructions>
