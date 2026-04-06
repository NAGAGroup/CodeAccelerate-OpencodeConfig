---
name: sequential-thinking
description: Teaches how to use sequential thinking for step-by-step reasoning about complex problems and decisions.
---

# Sequential Thinking

Use the sequential-thinking_sequentialthinking tool for step-by-step reasoning through complex problems, decisions, or analysis before acting.

## How to Call the Tool

Call sequential-thinking_sequentialthinking once per thought. Do not combine multiple thoughts in one call. Provide: thought (your current reasoning step), nextThoughtNeeded (true for intermediate steps, false for final step), thoughtNumber (starts at 1, increments by 1), totalThoughts (your estimate of total steps needed). To revise a previous thought, set isRevision to true and revisesThought to the thought number being reconsidered.

## Rules

- Each thought must advance reasoning by one step — avoid combining multiple ideas in a single call
- Start every task at thoughtNumber 1 and increment by 1
- Set nextThoughtNeeded to false only when you have a satisfactory final answer
- Adjust totalThoughts up or down as understanding changes
- To correct a previous step, set isRevision to true and specify revisesThought
- Questions are always handled through the question tool, not in thinking steps

## Anti-patterns

**Compressing all reasoning into one thought:** Defeats the purpose. Each thought advances by one step. Split multi-conclusion thoughts into separate calls. Sequential thinking catches false assumptions at each step; combining steps bypasses this checking.

**Planning without doing:** Describing what you will do instead of actually doing it. When a thought says "I will now...", stop thinking and act. Sequential thinking produces reasoning, not action.

**Empty filler thoughts:** Reiterating previous thoughts or adding no new reasoning. Every thought must be substantive.

**Locking in totalThoughts early:** Setting a fixed count and never adjusting it. Reasoning is exploratory; adjust as understanding deepens.

## When to Use Sequential Thinking

Use sequential thinking for complex multi-step problems, decision gates, ambiguous requirements, verification of logic, and error investigation. Do not use for simple, straightforward work — act directly if you immediately understand what to do.
