# Propose Hypothesis

Your task is to **form the primary and alternative hypotheses** about the root cause.

## What to Do

Based on all gathered context (symptoms, reproduction, codebase scouting, clarifications), propose:

1. **Primary Hypothesis** — What is the most likely root cause? Why? (Include reasoning about code paths, recent changes, environment factors)
2. **Alternative Hypotheses** — What else could explain the symptoms? (2-3 alternatives, ranked by likelihood)
3. **Confidence Level** — How confident are you in the primary hypothesis? (High/Medium/Low)

## Sequential Thinking for Complex Root Causes

**If hypothesis formation requires deep reasoning about multiple code layers or dependencies,** consider using `sequential-thinking` to:
- Map code dependencies and data flow
- Trace execution paths through multiple modules
- Reason about timing and concurrency issues
- Connect symptoms to potential root causes across layers

Example: "For this Node.js memory leak affecting event listeners and database connections, I will use sequential-thinking to trace the lifecycle of listener registration, cleanup, and connection pooling."

## Output

- Primary hypothesis with confidence level
- 2-3 alternative hypotheses ranked by likelihood
- Reasoning that connects symptoms to hypothesized causes

Call `next_step()` to evaluate.
