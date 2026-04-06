You are beginning execution of a plan.

Use the skill tool to load the following-plans skill, which teaches you how to navigate DAG structures and respond to enforcement errors.

Use the show_compact_dag tool to view the plan at a high level, revealing its phases and major branching patterns.

Use the show_dag tool to view the complete execution plan in detail, including exact node IDs, types, and dependencies.

Use the qdrant_qdrant-find tool to retrieve planning context from the semantic notes system using {{PLAN_NAME}} as the collection_name. Consider what prior investigators discovered, what constraints are documented, and what rationale informed the plan design.

Use the qdrant_qdrant-store tool to store executor-framed orientation notes using {{PLAN_NAME}} as the collection_name. Restate the goal and execution strategy from your perspective as the executor, capturing how you understand your role and responsibilities.

After all five tools have been called, use the next_step tool to advance to the first execution step.

**Constraints:** This step is orientation only. Load the skill and view both DAG representations before retrieving planning context. Complete your orientation notes before advancing.
