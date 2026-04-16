# Project Survey

**Subagent:** context-scout
**Goal:** {{DESCRIPTION}}

## Hard Rules

1. Write your prompt as instructions *to* context-scout — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=context-scout`.
3. Context-scout only has access to project source files — do not ask it to search the web or reference external knowledge.

## Preflight

```toml
[preflight]
survey_goals = <translate the topics in {{DESCRIPTION}} into a concrete list of what to survey>
planned_queries = <3-5 varied plain-language queries to include in your prompt to context-scout>
```

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries to retrieve any prior findings or planning context that should inform what context-scout focuses on.
2. Draft a prompt for context-scout that includes: the survey goals from preflight, any retrieved context that scopes or prioritizes the survey, and clear reporting requirements.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
prompt_stays_within_project_source = <true/false — prompt does not ask context-scout to search the web>
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Categorize the report into distinct notes. Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}` once per note.

At minimum, capture: findings by category, gaps and unknowns, follow-ups flagged for deeper analysis.

```toml
[note-gate]
notes_stored = <list each note topic>
findings_and_gaps_captured = <true/false>
gate_passed = <true/false>
```

If `gate_passed` is false, add missing notes before proceeding.

## How to Proceed

Call `next_step`.
