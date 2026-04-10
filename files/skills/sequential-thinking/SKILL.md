---
name: sequential-thinking
description: Teaches how to use sequential thinking for step-by-step reasoning about complex problems and decisions.
---
<rules>
Each thought advances reasoning by exactly one step. Increment thoughtNumber by 1 each call.
Set nextThoughtNeeded to false only when you have a satisfactory final answer.
To correct a previous step, set isRevision=true and specify revisesThought.
User questions are handled through the question tool, not in thinking steps.
</rules>

<example>
sequential-thinking_sequentialthinking tool:
  thought: current reasoning step
  thoughtNumber: step number starting at 1
  nextThoughtNeeded: false only when reasoning is complete
  totalThoughts: estimated total — adjust as understanding changes
  isRevision: true when correcting a prior step (optional)
  revisesThought: step number being corrected — required when isRevision is true
</example>
