# Clarification: Context-Aware Questions

Your task is to **ask clarifying questions about the bug's reproduction, environment, and related systems** using the context gathered so far.

## What to Ask

Based on symptoms, environment, and affected code areas, ask context-aware clarifying questions such as:

**Reproduction & Timing:**
- Can the bug be reliably reproduced locally, or is it environment-specific?
- Does it happen consistently or only under specific conditions?
- When was it first observed? Has it appeared since a specific change or deployment?

**Related Systems:**
- Does this bug affect dependent systems, or is it isolated to one module?
- Are there related errors in logs from other components (database, cache, external services)?
- Does the bug correlate with load, time-of-day, or specific user actions?

**Environment Details:**
- Does it happen in production, staging, or locally? All three or specific environments?
- Are there version/configuration differences between affected and unaffected environments?
- What is the scale (how many users/requests affected)?

**Sequential Thinking Tip:** For bugs involving multiple interdependent systems, consider using `sequential-thinking` to map out dependencies and data flow before asking questions. This helps you ask more targeted clarifying questions.

## What NOT to Do

- Don't ask yes/no questions that could have multiple interpretations
- Don't assume reproduction is possible
- Don't ask questions that can be answered by reading logs or code

## Output

- 1-3 clarifying questions (prioritized by impact on investigation direction)

Call `next_step()` after asking.
