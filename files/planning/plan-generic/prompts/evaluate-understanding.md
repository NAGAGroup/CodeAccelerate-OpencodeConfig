# Evaluate Understanding

Your task is to **decide if we have enough context to decompose the task**.

## Evaluation Questions

Ask yourself:
1. Do we understand the task goal clearly?
2. Do we know the acceptance criteria?
3. Have we identified key constraints?
4. Do we understand the relevant code areas?
5. Are there critical unknowns that need more exploration?

## Decision

**If understanding is sufficient:** Call `next_step()` to propose a shape.

**If more context is needed:** Call `next_step({ next: "scout" })` to gather more context.
