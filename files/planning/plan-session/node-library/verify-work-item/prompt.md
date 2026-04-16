# Verify Work

**Subagent:** tailwrench
**Goal:** {{GOAL}}
**Success criteria:** {{VERIFY_DESCRIPTION}}

## Hard Rules

1. Write your prompt as instructions *to* tailwrench — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=tailwrench`.
3. Tailwrench can only run shell commands and edit config and build system files — never source code or documentation.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries to retrieve the implementation summary, files changed, and any prior verification failure output.
2. Draft a prompt for tailwrench that includes: what was implemented (files changed, approach taken), the success criteria to verify against, any prior failures to context-set, and a requirement to report a clear pass/fail verdict with full command output.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
prompt_no_source_edits = <true/false — prompt does not ask tailwrench to edit source code or documentation>
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}`.

At minimum, capture: verdict (pass/fail), command output, and on failure the exact error output and failed commands.

```toml
[note-gate]
notes_stored = <list each note topic>
failure_details_captured = <true/false — on failure: exact error output and failed commands stored>
gate_passed = <true/false>
```

If `gate_passed` is false, store missing details before proceeding.

## How to Proceed

Call `get_branch_options` to retrieve the available branch node IDs.

- **If verdict is FAIL:** Call `next_step` with the triage branch node ID.
- **If verdict is PASS:** Call `next_step` with the other branch node ID.

Both outcomes require a branch argument — `next_step` cannot be called without one.
