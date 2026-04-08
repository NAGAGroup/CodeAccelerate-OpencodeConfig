**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Kickoff Refresher

## Goal
Re-establish session context after compression before continuing execution.

## Instructions

1. Call `qdrant_qdrant-find` with collection `{{PLAN_NAME}}` to retrieve accumulated findings — what has been discovered, what decisions have been made, and what constraints must carry forward
2. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I retrieved enough context to understand where execution left off and what comes next?
- Are there specific constraints or decisions from earlier nodes I need to carry forward?
