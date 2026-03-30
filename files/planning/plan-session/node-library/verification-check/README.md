# verification-check

## When to use

When you need to run build commands, tests, or lint and verify the results. Use after implementation nodes to confirm correctness before proceeding. Typically followed by a `decision-gate` or `conditional-branch` on pass/fail.

**Do not** use for checking results that don't produce machine-verifiable output (e.g., reviewing code style by eye). Reserve for commands that produce exit codes or structured output.

## What it does

Dispatches HW as a subagent via a single `task` call. HW subagent has full shell access — it runs the commands, checks output, and reports results. The planning agent bakes in the exact commands and acceptance criteria at DAG-authoring time.

## What the planning agent must resolve

- **Build command** — Exact shell command to run (e.g., `bun run build`, `npm test`, `make lint`)
- **Test command** — If separate from build (e.g., `bun test`, `pytest tests/`)
- **Acceptance criteria** — What constitutes a passing result (exit code 0, specific output, no error lines)
- **Failure handling** — What happens on failure? (Go to a fix node, go to `output-failure`, retry?)
- **Working directory** — If the command must run from a specific directory. If the command uses relative paths, always specify the working directory — omitting it defaults to the project root, which may not be correct.
- **Outcome format** — The dispatched HW subagent prompt must instruct HeadWrench to end its response with: `**Outcome:** [PASS | FAIL | PARTIAL]` followed by a one-sentence summary. This makes results machine-parseable for downstream `conditional-branch` nodes.

## Node ID

Default: `verification-check`. Rename for specificity: `verify-build`, `run-tests`, `check-types`. For repeated verification nodes, use `-<N>` suffix: `verification-check-2`, `run-tests-2`.

## Notes

- HW subagent is the only agent with shell access — this node always dispatches HW, not a specialist
- The prompt must include the exact commands — do not leave them as placeholders
- Often part of an iteration pattern: `parallel-tasks → verification-check → decision-gate → [fix → verification-check-2 → ...]`
- If the branch decision is fully machine-readable (exit code), use `conditional-branch` instead to skip the user interaction
