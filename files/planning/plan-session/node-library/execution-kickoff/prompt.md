You are beginning execution of a plan. You will load methodology, view the plan structure, retrieve planning context, and orient yourself before continuing.

Use the skill tool to load the following-plans skill. This skill teaches you how to follow execution DAG structures and recover from enforcement errors.

Use the show_compact_dag tool to display a compact view of the plan's structure, showing phases and major branching patterns at a high level.

Use the show_dag tool to display the full plan structure with exact node IDs, node types, and dependencies. This reveals the detailed execution sequence.

Use the qdrant_qdrant-find tool to retrieve planning context from the semantic notes system. Query for key findings, decisions, constraints, and rationale. Use the collection name {{PLAN_NAME}}.

Use the sequential-thinking_sequentialthinking tool to reason through the plan's intent and your execution strategy. Consider what this plan is trying to accomplish, what the first step requires, and what constraints must carry forward through execution.

Use the qdrant_qdrant-store tool to store executor-framed orientation notes to the semantic notes system. Restate the goal and execution strategy from your perspective as the executor. Use the collection name {{PLAN_NAME}}.

After all six tools have been called, call next_step to begin execution.

**Constraints:** This node is orientation only — do not start executing tasks yet. Load the skill, view both DAG representations, retrieve planning context, reason through your strategy, store your orientation notes, then advance to the first execution step.
