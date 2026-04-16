# Code Fix

**Subagent:** junior-dev
**Goal:** {{GOAL}}
**Success criteria:** {{VERIFY_DESCRIPTION}}

A prior implementation attempt failed verification. Triage has identified the root cause.

## Hard Rules

1. Write your prompt as instructions *to* junior-dev — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=junior-dev`.
3. Junior-dev can only make file edits — never ask it to run shell commands or bash operations.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 5-7 varied queries to retrieve the triage root cause, prior fix attempts, verification failure output, and any code conventions relevant to the fix.
2. Draft a prompt for junior-dev that includes: the fix goal, the root cause to address, what prior attempts already tried (so it doesn't repeat them), relevant conventions, and what to report back.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
prompt_no_shell_commands = <true/false — prompt does not ask junior-dev to run bash or shell commands>
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
