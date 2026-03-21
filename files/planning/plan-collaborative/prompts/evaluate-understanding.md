# Evaluate Understanding

Your task is to **decide if we have enough context to plan the collaboration**.

## Evaluation Questions

Ask yourself:
1. Do we understand the design goal clearly?
2. Do we have clear success criteria?
3. Have we identified key constraints?
4. Do we understand existing patterns and context?
5. Do we know the user's collaboration preferences?

## Decision

**If understanding is sufficient:** Call `next_step()` to propose collaboration shape.

**If more context is needed:** Call `next_step({ next: "context-gather" })` to gather more context.
