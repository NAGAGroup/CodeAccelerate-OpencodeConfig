# Verification Check

Dispatch @HeadWrench as a subagent to run build and test commands.

**Todo:** `["task"]`

## Zone 1 — Fixed execution spec

1. Dispatch @HeadWrench subagent
2. Fill `{{COMMANDS}}` and `{{WORKDIR}}` in the template below, then use it verbatim as the `prompt` field

```
You are operating as a subagent. Do not ask the user questions. Do not call plan_session, activate_plan, or next_step.

Working directory: {{WORKDIR}}

Run these commands:
{{COMMANDS}}

Report PASS if all commands exit 0. Report FAIL with the exact error output for any failure.

Do not modify files based on results — report only.

Outcome: PASS or FAIL + exact command output.
```

## Zone 2 — Planning agent fills

**{{COMMANDS}}**
Exact shell commands to run, sequenced as required.
✓ Good: `make build && make test`
✗ Bad: "run the build"

**{{WORKDIR}}**
Absolute or repo-relative path for command execution.
✓ Good: `/home/jack/myproject`
✗ Bad: "the project directory"

## Zone 3 — Fixed constraints

Do not run commands yourself — dispatch @HeadWrench only. Do not modify files or attempt fixes based on results.
