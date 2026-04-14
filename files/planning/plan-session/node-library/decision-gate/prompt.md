**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** qdrant_qdrant-find, qdrant_qdrant-find, get_branch_options
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Retrieve accumulated evidence from prior phases, evaluate it against the decision in {{DESCRIPTION}}, and route to the appropriate branch.
</goal>

<rules>
Always base the routing decision on accumulated evidence only. Never guess or infer without retrieved findings.
</rules>

<instructions>
1. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, using a query derived from the decision question in {{DESCRIPTION}} — what findings from prior phases answer this question?
2. Call qdrant_qdrant-find with collection {{PLAN_NAME}}, query "constraints trade-offs and unknowns from prior phases" — retrieve limiting factors and open questions that inform this decision.
3. Call get_branch_options to retrieve the available branch node IDs.
4. Evaluate the retrieved evidence against {{DESCRIPTION}}. Call next_step with the branch node ID matching your decision.
</instructions>
