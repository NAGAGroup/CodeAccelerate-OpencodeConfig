**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, get_branch_options, question
**Optional Tools:** None
**Questions Allowed?:** Yes

<goal>
Retrieve the evidence from prior phases, surface it to the user alongside the decision in {{DESCRIPTION}}, and route to the branch matching their choice.
</goal>

<rules>
Always present prior findings to the user before asking for a choice. Never ask the user to decide without context.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, using a query derived from the decision question in {{DESCRIPTION}} — retrieve the findings from prior phases that bear on this choice.
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "constraints trade-offs and unknowns from prior phases" — retrieve limiting factors the user should know.
3. Call get_branch_options to retrieve the available branch node IDs.
4. Use the question tool to present the choice. Include: a plain-language summary of what prior phases found, what each branch option means concretely, and the question from {{DESCRIPTION}}.
5. Call next_step with the branch node ID matching the user's selection.
</instructions>
