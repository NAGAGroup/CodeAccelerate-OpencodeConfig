---
name: sequential-thinking
description: Teaches how to use sequential thinking for step-by-step reasoning about complex problems and decisions.
---
<tools>
sequential-thinking_sequentialthinking — step-by-step reasoning through a problem. Parameters: thought (current reasoning step, required), thoughtNumber (step number starting at 1, required), nextThoughtNeeded (false only when reasoning is complete, required), totalThoughts (estimated total — adjust as understanding changes, required), isRevision (true when correcting a prior step — optional), revisesThought (step number being corrected — required when isRevision is true).
</tools>

<rules>
Each thought advances reasoning by one step. Increment thoughtNumber by 1 each call.
Set nextThoughtNeeded to false only when you have a satisfactory final answer.
To correct a previous step, set isRevision=true and specify revisesThought.
User questions are handled through the question tool, not in thinking steps.
</rules>
