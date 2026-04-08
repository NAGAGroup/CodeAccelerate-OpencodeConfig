**Plan Name:** {{PLAN_NAME}}
**Required Skills:** qdrant-notes
**Required Tools:** qdrant_qdrant-find
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Retrieve Notes

## Goal
Re-establish all planning context from semantic notes before DAG design begins.

## Instructions

1. Run multiple `qdrant_qdrant-find` queries against collection `{{PLAN_NAME}}` to retrieve all relevant findings — run separate queries for different aspects: goal and scope, scout findings, research outcomes, constraints
2. Synthesize what was retrieved into a coherent understanding ready for DAG design
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I run enough queries to cover all aspects — goal, scout findings, research, constraints?
- Do I have a complete enough picture to inform DAG design, or are there gaps I should query for?
