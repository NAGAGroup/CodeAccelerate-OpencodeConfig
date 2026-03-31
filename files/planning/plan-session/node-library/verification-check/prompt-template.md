# Verification Check

## Zone 1: Fixed Framing

You are dispatching HeadWrench as a subagent with full shell access. HW runs the build and test commands specified for this node, inspects the output, and reports outcomes in a machine-parseable format. **HeadWrench is the only agent with shell access** — do not substitute another agent here.

---

## Zone 2: Authoring-Layer Placeholders

### Build command
`{{BUILD_COMMAND}}`

*The exact shell command to run. Do not describe it — provide the literal command (e.g., `cmake --build build/`, `make -j$(nproc)`, `cargo build --release`). This command will be executed as-is.*

### Test command
`{{TEST_COMMAND}}`

*The exact shell command to run tests, or "testing is included in the build command above" if not separate. Examples: `ctest --output-on-failure`, `./build/tests/run_tests`, `pytest tests/ -v`. The HW subagent must know whether to run a second command.*

### Working directory
`{{WORKING_DIRECTORY}}`

*The directory from which commands will run. Use absolute path (e.g., `/home/user/my-project`) or repo-relative (e.g., `.` for root, or `build/` for out-of-source builds). If commands use relative paths, specifying the directory is critical — omitting it causes "file not found" errors.*

### Acceptance criteria
{{ACCEPTANCE_CRITERIA}}

*Machine-readable definition of PASS. Include exit code check (e.g., "exit code 0"), output patterns (e.g., "test output contains 'all tests passed'"), or coverage thresholds. Good: "Exit code 0 from both commands. Test output must contain 'all tests passed' and coverage >= 90%." Bad: "code quality is good."*

### Failure handling
{{FAILURE_HANDLING}}

*What to do if verification fails. Include: whether to stop on first failure or continue, what error output to capture, whether to investigate or simply report. Good: "If build fails, stop and report error output. If build succeeds but tests fail, report failing test names and error messages. Do not attempt fixes." Bad: "report what went wrong."*

---

## Zone 3: Fixed Execution-Spec Sections (Recency)

### Outcome format requirement

End your response with:

```
**Outcome:** [PASS | FAIL | PARTIAL]
<one-sentence summary>
```

FAIL and PARTIAL outcomes **must include the specific command that failed and the error text.** This format is required — downstream nodes parse it programmatically to route to the next step.

**Good example:**
```
**Outcome:** FAIL
Build succeeded but tests failed. Command: `ctest --output-on-failure`. Error: "Assertion failed: expected 0.0 got 1.4e-6 at src/kernels/matmul_test.cpp:42".
```

**Bad example:**
```
Build check: Tests failed.
```
(missing the marker and specific error text — downstream routing fails)

### Scope constraint

Run only the commands specified. Do not install dependencies, modify files, or attempt to fix failures — report findings only. Fixes belong in a separate implementation node. Do not call `task` again after reporting the outcome.

---

## Final Element: Dispatch Blockquote

> **Writing the HeadWrench subagent's task prompt:** The prompt must specify:
> 1. The exact commands to run (build command from this node, test command from this node)
> 2. The exact working directory (absolute or repo-relative path)
> 3. Acceptance criteria — machine-readable definition of PASS (exit codes, output patterns, thresholds)
> 4. Failure handling — what to capture and report on FAIL, whether to stop on first failure or continue
> 5. Mandatory outcome format: `**Outcome:** [PASS | FAIL | PARTIAL]` + one-sentence summary; FAIL/PARTIAL outcomes must include the command that failed and the error text

## Todo

```json
["task"]
```

Dispatch @HeadWrench (subagent) via a single `task` call. Include the blockquote template above in your dispatch prompt.
