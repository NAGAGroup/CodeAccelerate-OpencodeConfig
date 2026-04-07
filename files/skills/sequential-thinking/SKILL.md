---
name: sequential-thinking
description: Teaches how to use sequential thinking for step-by-step reasoning about complex problems and decisions.
---

# Sequential Thinking

Use sequential-thinking_sequentialthinking for step-by-step reasoning through complex problems before acting.

## Tools
**sequential-thinking_sequentialthinking** — Reason through problems step by step. Key params: `thought` (current step), `thoughtNumber` (step number), `nextThoughtNeeded` (boolean), `totalThoughts` (estimated total), `isRevision` (boolean), `revisesThought` (thought number to revise).

## Rules
- Each thought advances reasoning by one step
- Start at thoughtNumber 1 and increment by 1
- Set nextThoughtNeeded to false only when you have a satisfactory final answer
- Adjust totalThoughts up or down as understanding changes
- To correct a previous step, set isRevision=true and specify revisesThought
- Questions are always handled through the question tool, not in thinking steps
