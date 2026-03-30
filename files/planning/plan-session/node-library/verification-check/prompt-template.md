# Verification Check

**Important:** All command placeholders must be filled with exact shell commands at DAG-authoring time. Do not ship this node with unfilled command placeholders.

Dispatch HeadWrench as a subagent via `task` — HeadWrench is the only agent with shell access. Do NOT substitute another agent here.

## Commands

**Build:** `{{BUILD_COMMAND}}`
**Test:** `{{TEST_COMMAND}}`
**Working directory:** `{{WORKING_DIRECTORY}}`

## Acceptance criteria

{{ACCEPTANCE_CRITERIA}}

## On failure

{{FAILURE_HANDLING}}

Reference the node ID that follows on failure. Standard patterns: route to a `parallel-tasks` fix node, route to `output-failure`, or use a `conditional-branch` after this node. E.g., 'On failure, the conditional-branch node `check-build-result` routes to the fix phase.'

## Todo

1. `task` — Dispatch @HeadWrench (subagent) to run `{{BUILD_COMMAND}}` and `{{TEST_COMMAND}}` from `{{WORKING_DIRECTORY}}`. Verify: {{ACCEPTANCE_CRITERIA}}. Report pass or fail clearly.

## Before advancing

If build or test results were ambiguous, showed partial failures, or raise questions about whether to proceed, consider asking the user before calling `next_step()`. This is optional — if results clearly pass or fail, advance when ready.
