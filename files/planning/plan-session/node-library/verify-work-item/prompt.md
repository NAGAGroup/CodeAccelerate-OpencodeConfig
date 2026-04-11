**Plan Name:** {{PLAN_NAME}}
**Required Skills:** tailwrench
**Required Tools:** task, get_branch_options

<rules>
The verification must produce a clear pass or fail outcome. Surface findings to the orchestrator so it can route to the correct branch.
</rules>

<instructions>
1. Load the tailwrench skill. Use it to compose a dispatch prompt describing what to verify and what a passing result looks like.
2. Dispatch tailwrench using the task tool.
3. Call get_branch_options to retrieve the two available branch node IDs.
4. Evaluate the result and call next_step with the appropriate branch node ID based on pass or fail.
</instructions>
