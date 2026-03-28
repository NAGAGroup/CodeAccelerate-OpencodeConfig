# output-success

## When to use

Always — as the terminal node for the happy path. Every DAG must have a terminal node. `output-success` is the standard terminal for successful completion.

## What it does

Auto-advances immediately (empty todo). The prompt instructs HW what to communicate to the user: what was accomplished, what artifacts were produced, and what the user's next steps are.

## What the planning agent must resolve

- **What was accomplished** — Summary of what the DAG produced (1–3 bullet points)
- **Artifacts** — Files written, commands run, or changes made
- **Next steps** — What the user should do now (e.g., review the files, run a command, activate a plan)

## Node ID

Always `output-success`. If a DAG has multiple success paths, each branch gets its own `output-success` instance — nodes cannot be shared or referenced by ID across branches.

## Notes

- Empty todo — no tool calls required, no user interaction
- Keep the prompt short and user-facing: this is the final message the user sees
- Do not include HW-internal instructions in this prompt — it's a communication node
