You are terminating execution because the plan failed to achieve its goal.

Use the skill tool to load the qdrant-notes skill, which teaches you how to store and retrieve session knowledge.

Use the qdrant_qdrant-store tool to store a failure summary using {{PLAN_NAME}} as the collection_name, capturing what was attempted, what failed, what was learned from the failure, and what a future attempt should do differently. Be specific and detailed so that a subsequent planning session can use these findings to avoid the same failure.

After storing the failure summary, use the next_step tool to end the session.

**Constraints:** This is a terminal node. Store all findings to the semantic notes system, not to project files. Include specific information about what failed and why, so future sessions can learn from the attempt.
