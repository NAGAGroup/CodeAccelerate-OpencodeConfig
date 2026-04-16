# Project Setup

**Subagent:** tailwrench
**Goal:** Execute the following setup operations: {{DESCRIPTION}}

## Hard Rules

1. Write your prompt as instructions *to* tailwrench — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=tailwrench`.
3. Tailwrench can only run shell commands and edit config and build system files — never source code or documentation.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries to retrieve any environment constraints, known dependency versions, or prior failed attempts that affect how these steps should run.
2. Draft a prompt for tailwrench that includes: the setup steps to execute, any relevant constraints from context retrieval, what tailwrench can and cannot touch, and what to report back per step.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
prompt_restricts_to_config_and_build_files = <true/false — prompt does not ask tailwrench to edit source code or documentation>
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}`.

At minimum, capture: each setup step and whether it succeeded or failed, any output relevant to subsequent steps.

```toml
[note-gate]
notes_stored = <list each note topic>
setup_outcomes_captured = <true/false>
gate_passed = <true/false>
```

If `gate_passed` is false, add missing notes before proceeding.

## How to Proceed

Call `next_step`.
