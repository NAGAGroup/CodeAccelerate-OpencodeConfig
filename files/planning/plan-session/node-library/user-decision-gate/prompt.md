**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** get_branch_options, question
**Optional Tools:** None
**Questions Allowed?:** Yes

<goal>
{{DESCRIPTION}}
</goal>

<rules>
Never make the decision yourself — the user's answer determines the branch.
</rules>

<instructions>
1. Call get_branch_options to retrieve the available branch node IDs.
2. Use the question tool to present the choice to the user with enough context to decide.
3. Call next_step with the branch node ID matching the user's selection.
</instructions>
