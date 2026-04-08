**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-context-scout, delegating-to-junior-dev
**Required Tools:** task, task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Work Item

## Goal
Investigate current state then implement a scoped change.

## Instructions

1. Use the `delegating-to-context-scout` skill to compose a dispatch prompt — think through what the scout needs to understand about the area that needs to change: existing patterns, what will be affected, and any pain points
2. Dispatch context-scout using the `task` tool with plan name `{{PLAN_NAME}}`
3. Use the `delegating-to-junior-dev` skill to compose a dispatch prompt based on what the scout reported — think through what the implementation goal is, what boundaries apply, and what constraints the implementer needs to know
4. Dispatch junior-dev using the `task` tool with plan name `{{PLAN_NAME}}`
5. Call `next_step`

## Thinking through the instructions

<|think|>
- What does the scout need to understand before I can define the implementation goal?
- Have I based the implementation goal on what the scout actually reported, not on assumptions?
- Is the implementation prompt goal-oriented — describing what to achieve, not which files to edit?
- Does the implementer have enough context to work independently without asking follow-up questions?
