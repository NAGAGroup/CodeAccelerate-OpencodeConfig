# Sequential Reasoning

Use the `sequential-thinking` MCP tool to reason through the following decision before acting.

## Decision to reason through

{{DECISION_QUESTION}}

> **Note:** The decision question should be specific and bounded — it should produce a clear conclusion. Good: "Should we refactor the token module before adding refresh logic, or add refresh logic first?" Bad: "How should we approach auth?"

## Relevant context

{{RELEVANT_CONTEXT}}

## Expected conclusion

{{EXPECTED_OUTPUT}}

This conclusion feeds directly into {{NEXT_PHASE_OR_DECISION}} — complete the reasoning before proceeding.

> **Note on `{{NEXT_PHASE_OR_DECISION}}`:** Describe what the reasoning output enables — e.g., "the implementation strategy for parallel-tasks" or "the branch choice at decision-gate". Use a phase description if the exact next node isn't known.

## Todo

1. `sequential-thinking_sequentialthinking` — Reason through: {{DECISION_QUESTION}}. Use the context above. Produce: {{EXPECTED_OUTPUT}}.

## Before advancing

If reasoning revealed meaningful uncertainty, competing approaches where user preference matters, or open questions that could affect downstream work, consider asking the user before calling `next_step()`. This is optional — if the conclusion is clear, advance when ready.
