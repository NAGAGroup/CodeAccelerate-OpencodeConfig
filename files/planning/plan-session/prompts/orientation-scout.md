**Plan Name:** {{PLAN_NAME}}
**Required Skills:** delegating-to-context-scout
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Orientation Scout

## Goal
Build broad understanding of the project and user's goal through wide-shallow exploration.

## Instructions

1. Use the `delegating-to-context-scout` skill to compose a dispatch prompt — think through what areas to survey and what questions the scout should answer about the project structure, relationships, and constraints
2. Dispatch context-scout using the `task` tool with plan name `{{PLAN_NAME}}`
3. Call `next_step`

## Thinking through the instructions

<|think|>
- What does the user's goal require me to understand about the project?
- What areas, relationships, and constraints should the scout survey?
- Have I asked for an unknowns section so gaps surface explicitly?
- Is the prompt goal-oriented — describing what to understand, not which files to read?
