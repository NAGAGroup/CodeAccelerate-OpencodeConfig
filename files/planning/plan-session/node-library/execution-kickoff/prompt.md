You are about to execute a plan.

**Todo List (do these in order):**
1. Call the `skill` tool to load the `following-plans` skill.
2. Call `qdrant_qdrant-find` to retrieve planning context. Use the session plan name (e.g., `plan-session-ses_{id}`) as the collection name. Query for "key findings, decisions, constraints, and rationale from this session."
3. Call `show_dag` with the session plan name as the target to visualize the DAG structure.
4. Call `sequential-thinking_sequentialthinking` to orient around the plan. Answer: What does this plan intend to accomplish? What does the first step require? What constraints must carry forward?
5. Call `next_step` to begin execution.

**Rules:**
- Only use the tools listed above.
- Do not start executing tasks yet — this node is orientation only.
- Call `next_step` after reading the notes.
