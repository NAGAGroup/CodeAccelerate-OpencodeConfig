**Plan Name:** {{PLAN_NAME}}
**Required Skills:** asking-questions
**Required Tools:** question
**Optional Tools:** None
**Questions Allowed?:** Yes

<goal>
Present branch options to the user and route execution based on their choice.
</goal>

<instructions>
1. Use the question tool to present the available branches with enough context for the user to make an informed choice.
2. Call next_step with the branch the user chose.
</instructions>

<check>
1. Have I provided enough context for the user to understand what each branch means and what will happen?
2. Are the options clearly distinct and mutually exclusive?
</check>
