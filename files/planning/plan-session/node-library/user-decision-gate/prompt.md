# User Decision

**Goal:** Present findings to the user and route based on their choice.
**Decision question:** {{DESCRIPTION}}

## Hard Rules

1. Always surface relevant prior findings before presenting the choice — never ask the user to decide cold.
2. Describe what each branch means concretely — not just its ID.
3. Call `get_branch_options` before the `question` tool.

## Retrieve Evidence and Present Choice

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries targeting evidence relevant to the decision question above.
2. Call `get_branch_options` to retrieve the available branch node IDs.
3. Use the `question` tool to present the choice. Include: a plain-language summary of the relevant evidence, what each branch means for the execution ahead, and the decision question.

## Decision Gate

```toml
[decision-gate]
evidence_surfaced = <key findings surfaced to the user>
user_choice = <what the user chose>
branch_selected = <the branch node ID matching the user's choice>
gate_passed = <true/false>
```

Do not call `next_step` until `gate_passed = true`.

## How to Proceed

Call `next_step` with the branch node ID from your gate.
