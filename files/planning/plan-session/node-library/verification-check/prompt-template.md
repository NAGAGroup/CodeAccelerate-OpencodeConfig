# Verification Check

Dispatch HeadWrench as a subagent to run the following commands and verify the results.

## Commands

**Build:** `{{BUILD_COMMAND}}`
**Test:** `{{TEST_COMMAND}}`
**Working directory:** `{{WORKING_DIRECTORY}}`

## Acceptance criteria

{{ACCEPTANCE_CRITERIA}}

## On failure

{{FAILURE_HANDLING}}

## Todo

1. `task` — Dispatch @HeadWrench (subagent) to run `{{BUILD_COMMAND}}` and `{{TEST_COMMAND}}` from `{{WORKING_DIRECTORY}}`. Verify: {{ACCEPTANCE_CRITERIA}}. Report pass or fail clearly.

## Before advancing

If build or test results were ambiguous, showed partial failures, or raise questions about whether to proceed, consider asking the user before calling `next_step()`. This is optional — if results clearly pass or fail, advance when ready.
