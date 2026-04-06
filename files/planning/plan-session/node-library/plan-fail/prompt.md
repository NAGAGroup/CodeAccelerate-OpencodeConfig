You are terminating execution due to failure and storing a failure summary to the semantic notes system.

Use the qdrant_qdrant-store tool to store a failure summary capturing what was attempted, what failed, what was learned, and what a future attempt should do differently. Use the collection name {{PLAN_NAME}}.

Be specific and detailed. This summary will be available to the next planning session through semantic notes retrieval.

After storing the failure summary, call next_step to end the session.

**Constraints:** This is a terminal node. Store the summary to the semantic notes system only — do not write files.
