**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Decision Gate

## Goal
Evaluate evidence from prior nodes and choose which branch to take.

## Instructions

1. Call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` to retrieve relevant findings — what prior nodes discovered, what constraints were documented, and what reasoning is relevant to this decision
2. Evaluate the evidence and choose the correct branch — base your choice on what the evidence supports, not on assumptions
3. Call `next_step` with the chosen branch

## Thinking through the instructions

<|think|>
- What evidence from prior nodes is relevant to this decision?
- What do the available branches represent — what does each path mean?
- Does the evidence clearly support one path, or is it ambiguous — if ambiguous, which path is safer?
