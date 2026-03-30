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

## Response format

End your response with:
**Outcome:** [PASS | FAIL | PARTIAL]
Followed by a one-sentence summary of the result.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

> **Writing the HeadWrench subagent's prompt:** The prompt must include: (1) the exact commands to run (the build command and test command specified for this node); (2) the exact working directory; (3) explicit pass/fail criteria — what output or exit code constitutes success; (4) instructions to end the response with: "**Outcome:** [PASS | FAIL | PARTIAL]" followed by a one-sentence summary.

1. `task` — Dispatch @HeadWrench (subagent) to run `{{BUILD_COMMAND}}` and `{{TEST_COMMAND}}` from `{{WORKING_DIRECTORY}}`. Verify: {{ACCEPTANCE_CRITERIA}}. Report pass or fail clearly.

## Before advancing

If build or test results were ambiguous, showed partial failures, or raise questions about whether to proceed, consider asking the user before calling `next_step()`. This is optional — if results clearly pass or fail, advance when ready.
