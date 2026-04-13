**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** task, get_branch_options
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Verify the implementation against the following success criteria:

{{DESCRIPTION}}
</goal>

<rules>
Always produce a clear pass or fail outcome.
Always surface findings before routing so the branch decision is evidence-based.
Never ask tailwrench to make edits to source code or documentation. The tailwrench subagent can only edit config files and build system config files.
Always provide the plan name {{PLAN_NAME}} in your prompt to the subagent.
</rules>

<instructions>
1. Compose a dispatch prompt describing what to verify and what a passing result looks like.
2. Dispatch tailwrench using the task tool.
3. Call get_branch_options to retrieve the available branch node IDs.
4. Call next_step with the appropriate branch node ID based on pass or fail.
</instructions>
