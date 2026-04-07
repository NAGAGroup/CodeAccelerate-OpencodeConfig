# DAG Node: Store Notes
**Skills:** qdrant-notes
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** qdrant_qdrant-store
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Persist all significant findings, decisions, and constraints from the investigation phases to semantic notes before context compression.

## Instructions
Store each significant finding, decision, or constraint as a separate `qdrant_qdrant-store` call. Use collection_name `{{PLAN_NAME}}`. Write findings in natural language prose. Store: user's goal and scope boundaries, scout findings, research outcomes, critical constraints that will affect plan design. Make as many calls as needed — one per distinct finding.

## Constraints
- one finding per call
- prose form only
- collection_name must be `{{PLAN_NAME}}`
- focus on findings that shape plan structure not procedural details
