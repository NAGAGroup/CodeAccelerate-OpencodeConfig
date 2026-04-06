---
name: sequential-thinking
description: Teaches how to use sequential thinking for step-by-step reasoning about complex problems and decisions.
---

# Sequential Thinking

This skill teaches how to use the sequential-thinking_sequentialthinking tool for step-by-step reasoning. Load it whenever you need to work through a complex problem, reason about decisions, or analyze multiple factors before acting. Sequential thinking breaks reasoning into discrete steps where each step advances your understanding.

## How to Call the Tool

Call sequential-thinking_sequentialthinking once per thought. Each call advances reasoning by one step. Do not combine multiple thoughts in one call. Provide these parameters: thought (your current reasoning step), nextThoughtNeeded (true for intermediate steps, false for final step), thoughtNumber (starts at 1, increments by 1), and totalThoughts (your current estimate of total steps needed). To revise a previous thought, set isRevision to true and specify revisesThought with the thought number being reconsidered.

## Rules

Each thought must advance reasoning by one step — avoid combining multiple ideas in a single call. Start every reasoning task at thoughtNumber 1 and increment by 1 for each step. Set nextThoughtNeeded to false only when you have a satisfactory final answer. Adjust totalThoughts up or down as understanding changes — increase when complexity appears, decrease when clarity comes sooner. To correct a previous step, set isRevision to true and specify revisesThought.

## Anti-patterns

**Compressing all reasoning into a single thought.** Using one long thought to cover an entire reasoning task defeats the purpose of sequential thinking. Each thought should advance by one step — if a thought covers multiple conclusions, split it into separate calls.

Why it fails: Sequential thinking structures reasoning to catch false assumptions at each step. Combining steps bypasses this checking mechanism, and errors become harder to detect and correct.

**Planning without doing.** Using thoughts to describe what you will do instead of actually doing it. Sequential thinking is for reasoning, not narrating future actions. When a thought says "I will now...", stop thinking and act.

Why it fails: Describing actions does not accomplish them. Sequential thinking produces reasoning output, not action. Use it to work through a problem, then act outside the tool.

**Empty filler thoughts.** Reiterating the previous thought, saying "continuing...", or adding no new reasoning. Every thought must be substantive.

Why it fails: Filler thoughts waste tool calls and clutter your reasoning chain. If nothing new remains to reason about, set nextThoughtNeeded to false immediately.

**Locking in totalThoughts too early.** Setting a fixed count at the start and never adjusting it as understanding deepens.

Why it fails: Reasoning is exploratory. As you work through a problem, complexity or clarity may shift your estimate. Locked estimates force artificial stopping points or unnecessary extra thoughts.
