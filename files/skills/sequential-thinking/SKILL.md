---
name: sequential-thinking
description: How to use the sequential-thinking tool for step-by-step reasoning
---

# Sequential Thinking

## Purpose

Use `sequential-thinking_sequentialthinking` to reason through a problem one step at a time. Each call is one focused thought. The tool does not act — it is a space to record your reasoning.

## How to Call the Tool

Call `sequential-thinking_sequentialthinking` once per thought step. The required fields are `thought`, `nextThoughtNeeded`, `thoughtNumber`, and `totalThoughts`.

Example — first step of a reasoning task:

```
sequential-thinking_sequentialthinking(
  thought="The task is to [X]. The key question I need to answer is [Y]. Let me start by considering [Z].",
  nextThoughtNeeded=true,
  thoughtNumber=1,
  totalThoughts=4
)
```

Example — continuing to the next step:

```
sequential-thinking_sequentialthinking(
  thought="Based on the previous step, I now know [finding]. This means [implication]. The next thing to consider is [next question].",
  nextThoughtNeeded=true,
  thoughtNumber=2,
  totalThoughts=4
)
```

Example — final step:

```
sequential-thinking_sequentialthinking(
  thought="I have considered all the relevant factors. My conclusion is [answer]. I am confident because [reason].",
  nextThoughtNeeded=false,
  thoughtNumber=4,
  totalThoughts=4
)
```

Example — correcting a previous step:

```
sequential-thinking_sequentialthinking(
  thought="I was wrong in step 2. The correct interpretation is [corrected understanding] because [reason].",
  nextThoughtNeeded=true,
  thoughtNumber=3,
  totalThoughts=5,
  isRevision=true,
  revisesThought=2
)
```

## Rules

- Start every new reasoning task at `thoughtNumber: 1`.
- Increment `thoughtNumber` by 1 for each new step.
- One thought per tool call. Do not combine multiple thoughts in one call.
- Set `nextThoughtNeeded` to false only when you have a satisfactory final answer.
- Adjust `totalThoughts` up or down as your understanding changes.
- To correct a previous step, set `isRevision: true` and `revisesThought` to the step number being corrected.
