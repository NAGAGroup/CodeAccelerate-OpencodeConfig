# Propose Test Strategy

Your task is to **design the diagnostic testing approach for each investigation step**.

## What to Do

For each diagnosis step, propose:
1. **Test Method** — How will we test this hypothesis? (code inspection, logs, reproduction, instrumentation, isolation test)
2. **Evidence to Gather** — What specific data proves or disproves this hypothesis?
3. **Expected Outcome** — What result confirms the hypothesis? What result falsifies it?
4. **Fallback** — If the test is inconclusive, what's the next step?

Consider:
- What can be tested without changes vs. what needs instrumentation
- How to isolate the bug (eliminate variables)
- What data already exists (logs, errors) vs. what needs collection

## Output

- Step → Test Method → Evidence → Expected Outcome
- One-line fallback for inconclusive results

Call `next_step()` to route agents.
