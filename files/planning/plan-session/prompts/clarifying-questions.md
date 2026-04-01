# Clarifying Questions

Call `question` to surface any gaps in your understanding of what the user wants, then call `next_step()`.

**Todo:** `["question"]`

> (1) Identify gaps in your understanding of the user's *goal and requirements* — not implementation decisions (those are already settled in sequential-thinking context).
> (2) If you have gaps, call `question` with 2–4 specific questions about scope, priorities, or constraints. Do not ask about implementation details or library versions.
> (3) If you have no gaps, call `question` with "Does my understanding of the goal look correct?" and options "Yes, proceed" and "Needs adjustment".
> (4) If any answer materially changes what the user wants, call `sequential-thinking_sequentialthinking` once to revise your plan conclusions.
> (5) Output constraint: call `next_step()` when done.
