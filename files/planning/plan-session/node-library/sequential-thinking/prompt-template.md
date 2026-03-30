# Sequential Reasoning

Use the `sequential-thinking` MCP tool to reason through the following decision before acting.

## Decision to reason through

{{DECISION_QUESTION}}

> **Note:** The decision question should be specific and bounded — it should produce a clear conclusion. Good: "Should we refactor the token module before adding refresh logic, or add refresh logic first?" Bad: "How should we approach auth?"

## Relevant context

{{RELEVANT_CONTEXT}}

*What HW already knows that's relevant to this decision: scout findings, constraints, prior decisions, confirmed file paths. Do not say "all prior context" — name specific items. E.g., "Scout phase confirmed token module is in src/auth/token.ts; refresh endpoint is not yet implemented; pattern to follow is in src/auth/session.ts."*

## Expected conclusion

{{EXPECTED_OUTPUT}}

*The form of the conclusion: a recommendation, a ranked list of approaches, a yes/no with rationale, a structured implementation order. Good: "A recommended refactor order with the primary reason for that order." Bad: "Whatever HW concludes."*

This conclusion feeds directly into {{NEXT_PHASE_OR_DECISION}} — complete the reasoning before proceeding.

> **Note on `{{NEXT_PHASE_OR_DECISION}}`:** Describe what the reasoning output enables — e.g., "the implementation strategy for parallel-tasks" or "the branch choice at decision-gate". Use a phase description if the exact next node isn't known.

## Todo

0. Before calling the tool, state aloud how many thoughts you expect to need for this decision, based on its complexity. A tightly scoped decision may need 4–7 thoughts; a broad or multi-faceted one may need 10–15. Name your estimate explicitly — this is your target, not a hard cap.

1. `sequential-thinking_sequentialthinking` — Reason through: {{DECISION_QUESTION}}. Use the context above. Produce: {{EXPECTED_OUTPUT}}. **Keep calling this tool repeatedly in the same turn — do NOT wait for user input between thoughts.** Each call builds on the previous. Stop when the reasoning is complete and the conclusion is clear — not when a count is reached. If you are repeating already-settled points, stop immediately.

## Before advancing

If reasoning revealed meaningful uncertainty, competing approaches where user preference matters, or open questions that could affect downstream work, consider asking the user before calling `next_step()`. This is optional — if the conclusion is clear, advance when ready.

## Execution constraints (fixed)

- Call `sequential-thinking_sequentialthinking` repeatedly in the same turn — do NOT pause between thoughts for user input.
- Stop when the conclusion is clear, not when a thought count is reached.
- If you are repeating already-settled points, stop immediately.
- State the conclusion explicitly before calling `next_step()` — downstream nodes reference it directly.
