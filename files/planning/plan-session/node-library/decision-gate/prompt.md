# DAG Node: Decision Gate
**Skills:** sequential-thinking, qdrant-notes
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** qdrant_qdrant-find, sequential-thinking_sequentialthinking
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Evaluate evidence and choose which branch to take.

## Instructions
Retrieve findings and decisions from earlier in the session using {{PLAN_NAME}} as the collection_name, considering what prior nodes discovered, what constraints were documented, and what prior reasoning is relevant. Use sequential-thinking_sequentialthinking to evaluate the evidence and choose which branch is correct, considering what the available branches represent, what evidence supports each choice, and which path best aligns with the evidence and constraints.

## Constraints
- Base your choice on evidence from prior nodes documented in planning notes, with priority given to evidence over assumptions
- The DAG structure defines the available branches
- Retrieve planning notes about the branch conditions if they were stored during planning
