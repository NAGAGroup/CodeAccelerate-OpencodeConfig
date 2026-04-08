**Plan Name:** {{PLAN_NAME}}
**Required Skills:** external-scout, asking-questions
**Required Tools:** question, task
**Optional Tools:** None
**Questions Allowed?:** Yes

# DAG Node: Research

## Goal
Conduct focused external research with user approval before dispatching.

## Instructions

1. Use the `external-scout` skill to compose a research query — think through what external information is needed and what scope protects proprietary information
2. Use the `question` tool to present the exact research query to the user for approval before dispatching
3. If approved, dispatch external-scout using the `task` tool with plan name `{{PLAN_NAME}}`; if declined, dispatch external-scout with instructions to return immediately without research — this satisfies the enforcement sequence
4. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I used only public, general terms — no internal names or proprietary details in the query?
- Is the research question scoped narrowly enough to be useful?
- Have I presented the exact query to the user, not a summary of it?
