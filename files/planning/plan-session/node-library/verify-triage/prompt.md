# Verify Triage

**Subagent:** tailwrench
**Goal:** {{GOAL}}
**Verification target:** {{VERIFY_DESCRIPTION}}

Verification failed. Reproduce the failure, apply project-level fixes, and identify the root cause.

## Hard Rules

1. Write your prompt as instructions *to* tailwrench — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=tailwrench`.
3. Tailwrench can only run shell commands and edit config and build system files — never source code or documentation.
4. The exact failed commands and verbatim error output must be in the prompt — tailwrench needs them to reproduce the failure.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 5-7 varied queries to retrieve the verbatim verification failure output, exact failed commands, and any prior triage findings from earlier retry cycles.
2. Draft a prompt for tailwrench that includes: the exact failed commands and error output to reproduce, prior triage findings to avoid repeating, what tailwrench can and cannot touch, and what to report back (reproduction output, root cause, fixes applied, what the fix step must address).

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
verbatim_failure_output_included = <true/false — exact failed commands and error output are in the prompt, not summarized>
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Categorize the triage report. Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}` once per note.

At minimum, capture: root cause, project-level fixes applied, specific fix instructions for the next step.

```toml
[note-gate]
notes_stored = <list each note topic>
fix_instructions_captured = <true/false — root cause and fix instructions specific enough for the fix step to act on>
gate_passed = <true/false>
```

If `gate_passed` is false, root cause is vague or fix instructions are missing — revise before proceeding.

## How to Proceed

Call `next_step`.
