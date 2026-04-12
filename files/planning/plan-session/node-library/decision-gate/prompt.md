**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** get_branch_options
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Always base the routing decision on accumulated evidence only.
</rules>

<instructions>
1. Call get_branch_options to retrieve the available branch node IDs.
2. Evaluate the evidence gathered so far relevant to the decision above.
3. Call next_step with the branch argument matching your decision.
</instructions>
