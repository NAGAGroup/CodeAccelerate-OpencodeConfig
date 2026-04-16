# Write Notes

**Goal:** Store durable session notes covering this point in the plan.
**What to document:** {{DESCRIPTION}}

## Hard Rules

1. Each note must be self-contained — a future agent reading only that note must fully understand it without surrounding context.
2. One `qdrant_qdrant-store` call per distinct finding — never store as a monolithic block.

## Preflight

```toml
[preflight]
documentation_target = <what this step must capture, in your own words based on {{DESCRIPTION}}>
```

## Retrieve and Store

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries to retrieve findings from prior steps relevant to what {{DESCRIPTION}} asks you to document.
2. For each distinct finding, decision, or outcome: call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}`. Write each note as self-contained prose.

## Gate

```toml
[gate]
notes_stored = <list each note topic>
self_contained_check = <true/false — would a future agent understand each note without reading prior steps>
gate_passed = <true/false>
```

If `gate_passed` is false, rewrite shallow notes before proceeding.

## How to Proceed

Call `next_step`.
