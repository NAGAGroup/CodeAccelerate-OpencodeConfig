# Deep Web and Docs Research

**Subagent:** deep-researcher
**Goal:** Conduct comprehensive research on: {{DESCRIPTION}}

## Hard Rules

1. Write your prompt as instructions *to* deep-researcher — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=deep-researcher`.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries to retrieve what is already known about this topic and why deep research was flagged as necessary.
2. Draft a prompt for deep-researcher that includes: the research topic, prior context to build on, project constraints, and reporting requirements — deep-researcher must always surface contradictions and confidence levels.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
prompt_requires_contradictions_and_confidence = <true/false — prompt explicitly requests both>
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Categorize the report into distinct notes — one per finding area or contradiction. Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}` once per note.

At minimum, capture: findings per topic with confidence tags, contradictions surfaced, unknowns that remain unresolved.

```toml
[note-gate]
notes_stored = <list each note topic>
contradictions_and_confidence_captured = <true/false>
gate_passed = <true/false>
```

If `gate_passed` is false, add missing notes before proceeding.

## How to Proceed

Call `next_step`.
