# output-success

## When to use

Always — as the terminal node for the happy path. Every DAG must have a terminal node. `output-success` is the standard terminal for successful completion. Every successful exit path in the DAG must terminate with an `output-success` node. A DAG with two success branches needs two instances: `output-success` and `output-success-2`.

## What it does

Auto-advances immediately (empty todo). The prompt instructs HW what to communicate to the user: what was accomplished, what artifacts were produced, and what the user's next steps are.

## What the planning agent must resolve

- **What was accomplished** — Summary of what the DAG produced (1–3 bullet points). Good: "Implemented token refresh logic in src/auth/token.ts; updated tests in tests/auth.test.ts; build passes with no TypeScript errors." Bad: "The auth feature was implemented."
- **Artifacts** — Files written, commands run, or changes made. Good: "src/auth/token.ts (modified), tests/auth.test.ts (modified), CHANGELOG.md (updated)." Bad: "Various files were changed."
- **Communication constraint** — The filled prompt must communicate in plain user-facing language. Do NOT include HW-internal references, node IDs, or plugin mechanics.
- **Next steps** — What the user should do now (e.g., review the files, run a command, activate a plan). Next steps should be specific and actionable — e.g., 'Run `bun run build` to verify the output' or 'Review the generated files at `.opencode/session-plans/my-plan/`.' Avoid vague instructions like 'review the changes.'

## Node ID

Always `output-success`. If a DAG has multiple success paths, each branch gets its own `output-success` instance — nodes cannot be shared or referenced by ID across branches.

> **Anti-pattern:** Do NOT reuse the `output-success` ID across branches. Every terminal node must have a unique ID — e.g., `output-success`, `output-success-2`. Reusing an ID causes a **validation error** at DAG-authoring time.

## Notes

- Empty todo — no tool calls required, no user interaction
- Keep the prompt short and user-facing: this is the final message the user sees
- Do not include HW-internal instructions in this prompt — it's a communication node
- **Failure mode:** Writing vague accomplishments ("the feature was added") instead of specific ones ("refreshToken function added to src/auth/token.ts, exported from src/auth/index.ts"). Vague success messages leave users unable to verify or build on the work.
- **Failure mode:** Including action items or instructions in this terminal node — any text that looks like an instruction (e.g., "Now run the tests") will be read as a message to the user, not a command for HW. Terminal nodes communicate results only.
