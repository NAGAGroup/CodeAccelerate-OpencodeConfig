# Agentic Decision

**Goal:** Route execution to the appropriate branch.
**Decision question:** {{DESCRIPTION}}

## Hard Rules

1. Routing must be grounded in retrieved evidence — never guess.
2. Call `get_branch_options` before `next_step`.

## Retrieve Evidence and Decide

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries targeting evidence relevant to the decision question above.
2. Call `get_branch_options` to retrieve the available branch node IDs.
3. Evaluate the retrieved evidence against the decision question and select the branch it supports.

## Decision Gate

```toml
[decision-gate]
evidence_summary = <key findings from retrieval that bear on this decision>
decision = <your routing decision>
rationale = <why this routing — reference specific findings, not general reasoning>
branch_selected = <the branch node ID>
gate_passed = <true/false>
```

Do not call `next_step` until `gate_passed = true`.

## How to Proceed

Call `next_step` with the branch node ID from your gate.
