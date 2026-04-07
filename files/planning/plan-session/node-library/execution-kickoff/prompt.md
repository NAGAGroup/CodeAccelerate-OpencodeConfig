# DAG Node: Execution Kickoff
**Skills:** following-plans, qdrant-notes
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** show_compact_dag, show_dag, qdrant_qdrant-find, qdrant_qdrant-store
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Orient the executor to the plan structure and retrieve planning context.

## Instructions
View the plan at a high level using show_compact_dag to understand its phases and branching patterns. Then view the complete plan using show_dag to see exact node IDs, types, and dependencies. Retrieve planning context from the semantic notes system using {{PLAN_NAME}} as the collection_name, considering what prior investigators discovered, what constraints are documented, and what rationale informed the plan design. Store executor-framed orientation notes using {{PLAN_NAME}} as the collection_name, restating the goal and execution strategy from your perspective as the executor.

## Constraints
- This step is orientation only
- View both DAG representations before retrieving planning context
- Complete your orientation notes before advancing
- Store findings to the semantic notes system
