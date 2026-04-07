# DAG Node: Orientation Scout
**Skills:** context-scout-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @context-scout

# Goal
Build broad understanding of the project and user's goal through wide-shallow exploration.

## Instructions
Use sequential-thinking to reason through what areas to explore and what questions the scout should answer — what the scout should understand about the project structure, relationships, and constraints. Dispatch @context-scout with a goal-based prompt describing what to understand — tell the scout to store findings to Qdrant collection `{{PLAN_NAME}}`. Ask for structured prose findings with an uncertainties section covering what remains unclear and what challenges are anticipated.

## Constraints
- request only findings (read-only agent)
- ask for prose narratives not raw file lists
- surface what remains unclear
- no questions to user
