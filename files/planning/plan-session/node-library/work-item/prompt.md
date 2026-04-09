**Plan Name:** {{PLAN_NAME}}
**Required Skills:** context-scout, junior-dev
**Required Tools:** task, task
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Investigate current state then implement a scoped change.
</goal>

<instructions>
1. Use the context-scout skill to compose a dispatch prompt — think through what the scout needs to understand about the area that needs to change: existing patterns, what will be affected, and any pain points.
2. Dispatch context-scout using the task tool with plan name {{PLAN_NAME}}.
3. Use the junior-dev skill to compose a dispatch prompt based on what the scout reported — think through what the implementation goal is, what boundaries apply, and what constraints the implementer needs to know.
4. Dispatch junior-dev using the task tool with plan name {{PLAN_NAME}}.
5. Call next_step.
</instructions>

<check>
1. What does the scout need to understand before I can define the implementation goal?
2. Have I based the implementation goal on what the scout actually reported, not on assumptions?
3. Is the implementation prompt goal-oriented — describing what to achieve, not which files to edit?
4. Does the implementer have enough context to work independently without asking follow-up questions?
</check>
