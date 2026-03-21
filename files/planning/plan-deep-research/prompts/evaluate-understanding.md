# Evaluate Understanding

Your task is to **decide if we have enough context to plan the research**.

## Evaluation Questions

Ask yourself:
1. Do we understand the research question clearly?
2. Do we know the scope and purpose?
3. Have we identified key knowledge gaps?
4. Do we understand available sources?
5. Are there critical unknowns about the research direction?

## Decision

**If understanding is sufficient:** Call `next_step()` to propose research angles.

**If more context is needed:** Call `next_step({ next: "scout" })` to gather more context.
