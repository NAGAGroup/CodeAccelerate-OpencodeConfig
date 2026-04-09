**Plan Name:** {{PLAN_NAME}}
**Required Skills:** deep-researcher
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Deep Research

## Goal
Conduct comprehensive external research covering multiple angles of a novel or frontier topic.

## Instructions

1. Use the `deep-researcher` skill to compose a comprehensive research brief — think through what domain needs exploration, what angles are most valuable, and what scope protects proprietary information
2. Dispatch deep-researcher using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I identified multiple angles or sub-questions that together give a comprehensive picture?
- Have I used only public, general terms — no internal names or proprietary details?
- Is this genuinely novel or frontier research that requires deep multi-source investigation, not a routine query that belongs in an external-scout node?
