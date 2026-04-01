# Verification Check

Dispatch @HeadWrench as a subagent to run build and test commands, then call `next_step()`.

**Todo:** `["task"]`

**Zone 1 — Fixed execution spec:**
> (1) Dispatch @HeadWrench subagent with the blockquote template below in the task prompt.
> (2) HeadWrench runs the commands specified: {{COMMANDS}}.
> (3) Working directory: {{WORKDIR}}.
> (4) Report PASS if all commands exit 0; FAIL with specific error output otherwise.
> (5) Output constraint: return exact command output and exit codes — no interpretation or attempt to fix.

**Zone 2 — Planning agent fills:**

{{COMMANDS}}
Exact shell commands to run, sequenced as required.
✓ `bun run build && bun test`
✗ "run the build"

{{WORKDIR}}
Absolute or repo-relative path for command execution.
✓ `/home/jack/myproject`
✗ "the project directory"

**Zone 3 — Fixed constraints:**

Do not run commands yourself — dispatch @HeadWrench only. Do not modify files based on results. Do not attempt to fix failures — report findings only. Scope: run only the named commands.

Dispatch blockquote (include in task prompt):
> (1) Run: {{COMMANDS}}
> (2) Working directory: {{WORKDIR}}
> (3) Report PASS or FAIL + exact command output (exit codes, error text)
> (4) Do not modify files or attempt fixes
> (5) Output: `**Outcome:** [PASS | FAIL]` — one-sentence summary; FAIL must include command and error text

Call `next_step()` after @HeadWrench reports back.
