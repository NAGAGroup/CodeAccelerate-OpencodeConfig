# Documentation Fix

**Subagent:** documentation-expert
**Goal:** {{GOAL}}
**Success criteria:** {{VERIFY_DESCRIPTION}}

A prior documentation attempt failed verification. Triage has identified the root cause.

## Hard Rules

1. Write your prompt as instructions *to* documentation-expert — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=documentation-expert`.
3. Documentation-expert can only edit documentation files — never ask it to make code changes.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 5-7 varied queries to retrieve the triage root cause, prior fix attempts, verified code facts, and documentation conventions.
2. Draft a prompt for documentation-expert that includes: the fix goal, the root cause to address, verified technical facts as source-of-truth, what prior attempts already tried, and what to report back.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
prompt_no_code_changes = <true/false — prompt does not ask documentation-expert to edit source code>
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Categorize the report into distinct notes. Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}` once per note.

At minimum, capture: what was fixed, what files were changed, how the root cause was addressed.

```toml
[note-gate]
notes_stored = <list each note topic>
root_cause_addressed_captured = <true/false>
gate_passed = <true/false>
```

If `gate_passed` is false, add missing notes. The verify step depends on these notes.

## How to Proceed

Call `next_step`.
