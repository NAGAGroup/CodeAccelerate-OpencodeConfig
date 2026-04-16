# Commit

**Subagent:** tailwrench
**Goal:** Stage and commit the verified work from this phase.

## Hard Rules

1. Write your prompt as instructions *to* tailwrench — treat it as a message to another agent.
2. Call the `task` tool with `subagent_type=tailwrench`.
3. Stage only the specific files changed in this work phase — never all changed files indiscriminately.

## Prepare Delegation

1. Call `qdrant_qdrant-find` with `collection_name={{PLAN_NAME}}` using 3-5 varied queries to retrieve the implementation summary, files changed, and the goal this work implemented.
2. Draft a prompt for tailwrench that includes: the specific files to stage (by name), a commit message reflecting what was done and why, and the constraint that only those files should be staged.

## Delegation Gate

```toml
[delegation-gate]
prompt_addresses_subagent_directly = <true/false>
prompt_includes_retrieved_context = <true/false>
prompt_specifies_return_format = <true/false>
specific_files_listed = <true/false — prompt names specific files to stage, not "stage all changes">
gate_passed = <true/false>
```

If `gate_passed` is false, revise before delegating. Once it passes, call the `task` tool.

## Note Taking

Call `qdrant_qdrant-store` with `collection_name={{PLAN_NAME}}`.

At minimum, capture: whether the commit succeeded, the commit message used, the files staged.

```toml
[note-gate]
notes_stored = <list each note topic>
commit_confirmed = <true/false>
gate_passed = <true/false>
```

If `gate_passed` is false, correct that before proceeding.

## How to Proceed

Call `next_step`.
