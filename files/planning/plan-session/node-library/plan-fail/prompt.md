# DAG Node: Plan Fail
**Skills:** qdrant-notes
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Store failure summary and terminate execution.

## Instructions
Store a failure summary using {{PLAN_NAME}} as the collection_name, capturing what was attempted, what failed, what was learned from the failure, and what a future attempt should do differently. Be specific and detailed so that a subsequent planning session can use these findings to avoid the same failure.

## Constraints
- This is a terminal node
- Store all findings to the semantic notes system, not to project files
- Include specific information about what failed and why, so future sessions can learn from the attempt
