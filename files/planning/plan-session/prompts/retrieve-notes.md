# DAG Node: Retrieve Notes
**Skills:** sequential-thinking, qdrant-notes
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, qdrant_qdrant-find, sequential-thinking_sequentialthinking
**Optional Tools:** qdrant_qdrant-find
**Delegated Subagent:** None

# Goal
Re-establish all planning context from semantic notes before DAG design begins.

## Instructions
Use sequential-thinking first to plan what to retrieve — what aspects of the goal, scout findings, research outcomes, and constraints need to be recovered. Run multiple `qdrant_qdrant-find` queries against collection `{{PLAN_NAME}}` to retrieve all relevant findings. Run separate queries for different aspects: goal and scope, scout findings, research outcomes, constraints. Then use sequential-thinking again to synthesize what was retrieved into a coherent understanding ready for DAG design.

## Constraints
- run as many queries as needed to build complete context
- synthesize before proceeding
- context retrieval and synthesis only — DAG design begins in the next node
