**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** get_branch_options

<rules>
Base the routing decision on accumulated evidence only. Do not ask the user.
</rules>

<instructions>
1. Call get_branch_options to retrieve the two available branch node IDs.
2. Evaluate the evidence gathered so far relevant to the decision described above.
3. Call next_step with the branch argument matching your decision.
</instructions>
