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

## When to Use Sequential Thinking

Use sequential thinking whenever you encounter complex problems or decisions that benefit from step-by-step reasoning:

- **Complex multi-step problems:** Problems with multiple dependencies or branches where you need to work through each step carefully
- **Decision gates:** When you need to reason through options and decide between alternatives
- **Ambiguous requirements:** When instructions are unclear and need interpretation; thinking clarifies what is meant
- **Verification of logic:** When you want to verify that your reasoning is sound before acting
- **Error investigation:** When you need to understand why something failed or what went wrong

Do not use sequential thinking for simple, straightforward work. If you immediately understand what to do, take action directly.

## How Sequential Thinking Improves Output

Sequential thinking provides several benefits:

- **Catches false assumptions:** Each step validates the previous reasoning. If an assumption is wrong, it is detected early.
- **Handles complexity:** Breaking reasoning into steps makes complex problems manageable
- **Creates audit trail:** Each thought is recorded, so you can trace how you reached a conclusion
- **Enables revision:** If a previous thought was wrong, you can revise and continue from that point
- **Improves accuracy:** Step-by-step reasoning produces fewer errors than trying to reason through everything at once

Use sequential thinking as a thinking tool to reason carefully before acting. Use the results to inform your actions.

## Revision as a Core Feature

Sequential thinking is designed to support revision. If you realize a previous thought was wrong, you do not restart from the beginning — you revise that specific thought and continue from there.

To revise:
1. Set isRevision to true
2. Set revisesThought to the thought number you want to reconsider
3. Provide your corrected thinking
4. Continue with additional thoughts if needed

This keeps your reasoning efficient by allowing you to correct errors without redoing all prior work.

## Good Uses of Sequential Thinking

- **Planning a complex task:** Reason through what steps are needed, dependencies, and what could go wrong. Then execute the plan.
- **Deciding between options:** Reason through pros and cons of each option, their implications, and constraints. Then choose.
- **Interpreting ambiguous requirements:** Reason through what the requirement might mean, which interpretation makes sense, and what assumptions you are making. Then act on your interpretation.
- **Debugging a problem:** Reason through what could cause the problem, what you've verified, what remains to check. Then investigate what remains.
