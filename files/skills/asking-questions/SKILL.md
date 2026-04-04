---
name: sequential-thinking
description: Guide for using the sequential-thinking tool with small local models
---

# Sequential Thinking (for Local Models)

## Purpose

The `sequential-thinking_sequentialthinking` tool helps you break down reasoning into clear, numbered steps. Each call is a single, focused thought. The tool itself does not act; it’s a space to record your thinking, one step at a time.

## Tool Schema

```jsonc
{
  // Your current thinking step — can be anything:
  // regular analysis, a revision of an earlier thought,
  // a question, a hypothesis, or a verification pass.
  "thought": "string",

  // Set to true if you need to keep thinking,
  // even if you've already reached your original totalThoughts estimate.
  // Only set false when you have a satisfactory final answer.
  "nextThoughtNeeded": true,

  // Which step you're on right now (1-based, numeric).
  // Can exceed totalThoughts if you need more steps than anticipated.
  "thoughtNumber": 1,

  // Your current best estimate of how many thoughts the full
  // solution will take. Adjust this up or down as you go —
  // it is not fixed at the start.
  "totalThoughts": 5,

  // Optional — set to true when this thought is correcting
  // or reconsidering a previous one rather than advancing linearly.
  "isRevision": false,

  // Optional — the thoughtNumber being reconsidered.
  // Only set when isRevision is true.
  "revisesThought": 2,

  // Optional — the thoughtNumber this branch splits off from.
  // Use when exploring an alternative path without discarding the main line.
  "branchFromThought": 3,

  // Optional — a label for the current branch (e.g. "approach-b").
  // Lets you track multiple parallel lines of reasoning.
  "branchId": "string",

  // Optional — set to true when you reach what seemed like the end
  // but realize more thoughts are actually needed.
  // Works alongside adjusting totalThoughts upward.
  "needsMoreThoughts": false
}
```

**Quick mental model:**

| Arg | Purpose |
|---|---|
| `thought` | The actual content of this reasoning step |
| `thoughtNumber` / `totalThoughts` | Pagination — both are mutable |
| `nextThoughtNeeded` | The "keep going" flag |
| `isRevision` + `revisesThought` | Undo/correct a prior step |
| `branchFromThought` + `branchId` | Fork into an alternative path |
| `needsMoreThoughts` | Signal "I underestimated" at the apparent end |



## Important rules

- `"thoughtNumber"` must be 1 for the first step of any new reasoning task
- `"thoughtNumber"` must increment by 1 for each new step, unless you are revising a previous step
- `"totalThoughts"` should be your best estimate of how many steps the reasoning will take. Update this if you realize you need more or fewer steps.
- Always set `"nextThoughtNeeded"` to true if you think you need more steps, or false if you think this is the final step.
- If you need to revise a previous step, set `"isRevision"` to true and specify which step you are revising with `"revisesThought"`. The `"thoughtNumber"` for a revision should be the same as the step being revised.
- If you need to branch your reasoning, use `"branchFromThought"` to indicate where the branch starts and `"branchId"` to label the branch. Each branch should be treated as a separate sequence of thoughts starting from the branch point.
- If you realize you need more steps than your original estimate, set `"needsMoreThoughts"` to true and update `"totalThoughts"` accordingly in your next step.
- Do not skip numbers in `"thoughtNumber"` unless you are revising a previous step. Each new step should have a `"thoughtNumber"` that is exactly 1 greater than the previous step, unless it’s a revision.
- Always use the `sequential-thinking_sequentialthinking` tool for each step of your reasoning. Do not include multiple thoughts in a single tool call.
