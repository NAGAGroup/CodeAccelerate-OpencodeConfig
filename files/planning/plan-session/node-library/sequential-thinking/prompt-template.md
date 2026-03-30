# Sequential Reasoning

Use the `sequential-thinking` MCP tool to reason through the following decision before acting.

## Decision to reason through

{{DECISION_QUESTION}}

## Relevant context

{{RELEVANT_CONTEXT}}

## Expected conclusion

{{EXPECTED_OUTPUT}}

This conclusion feeds directly into {{NEXT_NODE}} — complete the reasoning before proceeding.

## Todo

1. `sequential-thinking_sequentialthinking` — Reason through: {{DECISION_QUESTION}}. Use the context above. Produce: {{EXPECTED_OUTPUT}}.

## Before advancing

If reasoning revealed meaningful uncertainty, competing approaches where user preference matters, or open questions that could affect downstream work, consider asking the user before calling `next_step()`. This is optional — if the conclusion is clear, advance when ready.
