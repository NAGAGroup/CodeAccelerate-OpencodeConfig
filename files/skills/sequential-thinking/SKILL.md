---
name: sequential-thinking
description: How to use the sequential-thinking tool for step-by-step reasoning
---

# Sequential Thinking

## Purpose

Use `sequential-thinking_sequentialthinking` to reason through a problem one step at a time. Each call is one focused thought. The tool does not act — it is a space to record your reasoning.

## Tool Schema

```jsonc
{
  // Your current reasoning step.
  "thought": "string",

  // Set to true if you need to keep thinking.
  // Set to false only when you have a final answer.
  "nextThoughtNeeded": true,

  // Which step you are on right now. Starts at 1.
  "thoughtNumber": 1,

  // Your best estimate of how many steps the full reasoning will take.
  // You can adjust this up or down as you go.
  "totalThoughts": 5,

  // Optional — set to true when correcting a previous step.
  "isRevision": false,

  // Optional — which step you are correcting. Only set when isRevision is true.
  "revisesThought": 2,

  // Optional — which step this branch starts from.
  "branchFromThought": 3,

  // Optional — a label for this branch.
  "branchId": "string",

  // Optional — set to true when you reach the end but realize you need more steps.
  "needsMoreThoughts": false
}
```

## Rules

- Start every new reasoning task at `thoughtNumber: 1`.
- Increment `thoughtNumber` by 1 for each new step.
- One thought per tool call. Do not combine multiple thoughts in one call.
- Set `nextThoughtNeeded` to false only when you have a satisfactory final answer.
- Adjust `totalThoughts` up or down as your understanding changes.
- To correct a previous step, set `isRevision: true` and `revisesThought` to the step number being corrected.
