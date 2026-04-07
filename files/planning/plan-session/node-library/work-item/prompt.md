# DAG Node: Work Item
**Skills:** context-scout-delegation, juniordev-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** task, sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @context-scout then @junior-dev

# Goal
Investigate current state then implement a scoped change.

## Instructions
Dispatch @context-scout to investigate the current state of the area that needs to change, asking for a report on existing patterns, what will be affected by changes, and any pain points to watch for — tell the scout to store findings to Qdrant collection `{{PLAN_NAME}}`. Use sequential-thinking_sequentialthinking to reason through what the scout found and what it means for the implementation approach, considering what boundaries are important and what the implementation subagent needs to know. Dispatch the implementation subagent with a complete goal: what to change, where, why, and what boundaries apply — tell the implementation subagent to store findings to Qdrant collection `{{PLAN_NAME}}`.

## Constraints
- Base your implementation goal entirely on what the scout reports, not on assumptions
- Give the subagent enough context to work independently
- Dispatch the implementation to the appropriate subagent
