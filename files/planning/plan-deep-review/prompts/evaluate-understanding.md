# Evaluate Understanding

Your task is to **decide if we have enough context to plan the review**.

## Evaluation Questions

Ask yourself:
1. Do we understand the review target clearly?
2. Do we know the review purpose and stakeholders?
3. Have we identified quality standards?
4. Do we understand the artifact scope?
5. Are there critical unknowns about review focus?

## Decision

**If understanding is sufficient:** Call `next_step()` to propose review criteria.

**If more context is needed:** Call `next_step({ next: "scout" })` to gather more context.
