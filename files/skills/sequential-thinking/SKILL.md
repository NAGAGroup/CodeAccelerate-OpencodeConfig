---
name: sequential-thinking
description: Teaches how to use sequential thinking for step-by-step reasoning about complex problems and decisions.
---

# Sequential Thinking

Use the `sequential-thinking_sequentialthinking` tool for step-by-step reasoning through complex problems, decisions, or analysis before acting.

## Rules

- Each thought must advance reasoning by one step — avoid combining multiple ideas in a single call
- Start every task at thoughtNumber 1 and increment by 1
- Set nextThoughtNeeded to false only when you have a satisfactory final answer
- Adjust totalThoughts up or down as understanding changes
- To correct a previous step, set isRevision to true and specify revisesThought
- Questions are always handled through the question tool, not in thinking steps
