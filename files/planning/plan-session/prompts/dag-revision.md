**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviser
**Required Tools:** qdrant_qdrant-store, reset_entry_exit_points, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Finalize the plan draft and revise the associated DAG according to the review from the previous step.
</goal>

<rules>
Do not make any DAG revision decisions yourself — all structural changes are delegated to dag-reviser.
Do not include review findings or any other planning context in the dag-reviser dispatch prompt. The reviser retrieves all necessary context from Qdrant. Provide only the finalized plan and the plan name.
Address all review items when revising the plan draft. Do not selectively apply feedback.
</rules>

<instructions>
1. Revise your drafted plan from the draft-plan step so that the new plan addresses all review items from the previous step.
2. Call qdrant_qdrant-store once to store the finalized plan in full.
3. Call reset_entry_exit_points with plan name {{PLAN_NAME}} to clear the entry/exit markers from the first-pass DAG — this gives the reviser a clean structural slate to work with.
4. Load the dag-reviser skill. Use it to compose a dispatch prompt.
5. Dispatch dag-reviser using the task tool with plan name {{PLAN_NAME}} and the finalized plan document in full. Do not provide any review findings or planning context in this prompt — the reviser will retrieve all necessary context from qdrant.
6. Call next_step.
</instructions>
