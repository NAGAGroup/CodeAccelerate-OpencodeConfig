# Evaluate Understanding

Your task is to **decide if we have enough context to plan the investigation**.

## Evaluation Questions

Ask yourself:
1. Do we understand the bug symptoms clearly?
2. Can we reproduce the bug (or know why it's intermittent)?
3. Have we identified the affected code areas?
4. Do we understand the impact?
5. Are there critical unknowns about the root cause that need investigation?

## Decision

**If understanding is sufficient:** Call `next_step()` to propose investigation shape.

**If more context is needed:** Call `next_step({ next: "scout" })` to gather more context.
