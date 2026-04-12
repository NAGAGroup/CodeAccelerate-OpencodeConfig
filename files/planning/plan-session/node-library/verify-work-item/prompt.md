**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task, get_branch_options
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always produce a clear pass or fail outcome.
Always surface findings before routing so the branch decision is evidence-based.
</rules>

<instructions>
1. Load the tailwrench skill. Compose a dispatch prompt describing what to verify and what a passing result looks like.
2. Dispatch tailwrench using the task tool.
3. Call get_branch_options to retrieve the available branch node IDs.
4. Call next_step with the appropriate branch node ID based on pass or fail.
</instructions>
