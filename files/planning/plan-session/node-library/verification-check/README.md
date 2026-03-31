# verification-check

## When to use

Use `verification-check` when you need to confirm that code changes produce correct, buildable, testable output. Typical scenarios:

- After `parallel-tasks` implementation nodes, to verify that all edits compiled and tests pass
- After a critical bugfix, to confirm the fix resolves the stated issue without breaking other tests
- At a branch decision point, to run a machine-readable test suite and route to downstream nodes based on pass/fail outcome

The node runs shell commands with full output inspection. Its outcome (`PASS`, `FAIL`, or `PARTIAL`) feeds into a downstream `decision-gate` or `conditional-branch` node.

## What the planning agent must resolve

The planning agent must determine and provide exact values for all 6 of these items before writing the node's prompt:

### 1. Build command
**What:** The exact shell command(s) to compile or prepare the codebase.

**Good example:** `"bun run build"` or `"npm run build -- --production"` or `"cargo build --release"`

**Bad example:** `"build the project"` or `"run the build process"` — no shell command

**Consequence of omission:** HW subagent cannot run anything; node stalls or produces a generic failure message.

### 2. Test command
**What:** The exact shell command to run automated tests. If testing is part of the build command, state that explicitly (e.g., "testing is included in the build command above, no separate test command needed").

**Good example:** `"bun run test"` or `"npm test -- --coverage"` or `"pytest tests/ -v"`

**Bad example:** `"run tests"` or omitting this entirely when tests are separate from build — HW subagent must know whether to run a second command.

**Consequence of omission:** HW subagent skips test execution; node reports a PASS based on build alone, missing test failures.

### 3. Acceptance criteria
**What:** A clear, machine-readable definition of what constitutes a PASS outcome. Must include:
- Exit code check (e.g., "exit code 0")
- Output patterns (e.g., "test output contains 'X passed'")
- Coverage thresholds, if applicable
- Any other quantifiable success signals

**Good example:** `"Exit code 0 from both build and test commands. Test output must contain 'all tests passed' and coverage must be >= 90%."`

**Bad example:** `"code quality is good"` or `"no errors"` — vague, not machine-readable.

**Consequence of omission:** HW subagent cannot distinguish PASS from FAIL; outcome is subjective or omitted.

### 4. Failure handling
**What:** What the subagent must do if verification fails. Include:
- Whether to continue running remaining commands or stop on first failure
- What error output to capture and report
- Any log files to inspect
- Whether to attempt investigation (e.g., "show the last 20 lines of the build log") or simply report the failure

**Good example:** `"If build fails, stop and report the build error output. If build succeeds but tests fail, report the failing test names and error messages. Do not attempt to fix failures."`

**Bad example:** `"report what went wrong"` — too vague; subagent may skip error details.

**Consequence of omission:** HW subagent produces a terse FAIL message with no actionable error details; downstream nodes cannot diagnose the problem.

### 5. Working directory
**What:** The directory from which commands should be run. Use absolute path or repo-relative path.

**Good example:** `"/home/jack/CodeAccelerate-OpencodeConfig"` or `"."` (repo root) or `"apps/frontend"` (repo-relative)

**Bad example:** Omitting this when commands use relative paths — HW subagent may run from the wrong directory, causing relative imports or file paths to fail.

**Consequence of omission:** Commands fail with "file not found" or import errors; outcome is FAIL due to environmental issue, not code correctness.

### 6. Outcome format requirement
**What:** The exact format HW subagent must use when reporting results. Must be:
```
**Outcome:** [PASS | FAIL | PARTIAL]
<one-sentence summary>

[For FAIL or PARTIAL: include the specific command that failed and the error text]
```

**Good example:**
```
**Outcome:** FAIL
Build succeeded but tests failed. Command: `npm test`. Error: "TypeError: expected array, got string at line 42 of src/parser.ts".
```

**Bad example:**
```
Build check: Tests failed.
```
(missing the `**Outcome:**` marker and specific error text — downstream conditional-branch cannot parse it)

**Consequence of omission:** Downstream `conditional-branch` or `decision-gate` nodes cannot reliably parse the outcome; routing fails or defaults incorrectly.

## Notes

### Failure mode: Missing `**Outcome:** [PASS|FAIL|PARTIAL]` format

**Mechanism:** Downstream `conditional-branch` nodes expect HW subagent's response to end with a parseable `**Outcome:**` line. If the planning agent omits the format instruction, the subagent produces a prose summary instead. The conditional-branch node cannot extract the outcome programmatically and may route incorrectly or stall.

**Fix:** The planning agent must include in the node's prompt the exact format instruction (item 6 above, word-for-word). This is then propagated by HW into the subagent's task prompt via the dispatch blockquote template.

### Failure mode: Missing working directory when using relative paths

**Mechanism:** Commands like `npm test` or `cargo build` typically run from the repo root. If the planning agent omits the working directory instruction, HW subagent may run from an unexpected location (e.g., `/root` or `/.opencode/session`), causing relative imports or config file lookups to fail with "file not found" errors. The build/test fails not because of code issues but because of environmental misconfiguration.

**Fix:** The planning agent must always provide an explicit working directory (item 5), even if it is the repo root. Annotate: "Working directory: `.` (repo root)" or "Working directory: `/path/to/repo`".

### Failure mode: Using placeholder commands instead of exact shell commands

**Mechanism:** Commands like `"{{BUILD_SCRIPT}}"` or `"run the build process"` are not executable. HW subagent cannot call `task` with a placeholder; the subagent will either fail with "command not found" or ask for clarification, wasting steps.

**Fix:** The planning agent must determine the exact shell command before writing the node. Use `bun run build`, `npm test`, `pytest`, `cargo build`, etc. — not placeholders. If the planning agent is uncertain about the exact command, add a `scout` or `analyze-deep` node *before* this `verification-check` node to discover the exact build/test commands.

## Output constraint

All verification-check nodes must instruct the dispatched HW subagent to end its response with:

```
**Outcome:** [PASS | FAIL | PARTIAL]
```

followed by a one-sentence summary. FAIL and PARTIAL outcomes **must include the specific command that failed and the error text.** This format is required — downstream conditional-branch and decision-gate nodes parse it to route to the next step.
