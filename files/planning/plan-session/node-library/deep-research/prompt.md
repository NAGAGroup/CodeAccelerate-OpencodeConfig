**Plan Name:** {{PLAN_NAME}}
**Required Skills:** external-scout
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Deep Research

## Goal
Conduct broad external research covering multiple angles of a domain or topic.

## Instructions

1. Use the `external-scout` skill to compose a comprehensive research brief — think through what domain needs exploration, what angles are most valuable, and what scope protects proprietary information
2. Dispatch external-scout using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I identified multiple angles or sub-questions that together give a comprehensive picture?
- Have I used only public, general terms — no internal names or proprietary details?
- Is this genuinely broad domain exploration, not a single targeted query (which belongs in research)?
