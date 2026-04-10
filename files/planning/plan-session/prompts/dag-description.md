**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-description-author
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Populate every work node in the execution DAG with a per-node context description that grounds the executing agent in the specific planning discoveries.
</goal>

<instructions>
1. Load the dag-description-author skill. Use it to compose a dispatch prompt — include the plan name, the user's goal, and a summary of key planning findings so the author can prime their understanding before querying qdrant.
2. Dispatch dag-description-author using the task tool with plan name {{PLAN_NAME}}, the user's goal, and a planning context summary drawn from what you know from the session.
3. Call next_step.
</instructions>

<check>
1. Have I included enough planning context in the dispatch prompt that the author can write grounded descriptions?
2. Have I made clear the author should retrieve qdrant notes with collection_name={{PLAN_NAME}} for full context?
3. Am I asking for descriptions only — not structural changes or design decisions?
</check>
