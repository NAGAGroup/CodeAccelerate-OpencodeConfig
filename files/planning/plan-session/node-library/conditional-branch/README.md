# conditional-branch

## When to use

When the path forward is determined by a condition that can be evaluated without user input — exit code of a prior bash command, presence of a file, a value from a prior agent's output, etc. This is a branch point: once the node is entered, branching instructions will follow automatically with the available paths to choose from.

**Prerequisite:** Ensure the condition result is in HW's near-term context. If the relevant result came from many nodes ago, use a `compression-node` to surface key results before this branch.

**Do not** use after a `question`-based node when the user's answer has already determined the path. Use `decision-gate` for decisions requiring human input; use `conditional-branch` only when no new user input is needed.

## What it does

No todo — the plugin presents available branch targets on node entry. HW evaluates the condition from prior context and calls `next_step({ next: "<node-id>" })` to select the path.

## What the planning agent must resolve

- **The condition** — What is being evaluated? (e.g., "Did the build succeed?", "Does the output file exist?")
- **How HW knows** — What prior context tells HW which branch to take (e.g., exit code from a preceding bash node, agent output, file check result)
- **Branch meanings** — What each `when` condition represents and where it leads

## Node ID

Default: `conditional-branch`. Rename for clarity: `check-build-result`, `file-exists-check`.

## Notes

- Empty todo — branching instructions are presented automatically on node entry
- The branch decision must be inferable from prior context without any additional tool calls
- If the decision requires a new shell command, put the `bash` call in a preceding `generic` node and use `conditional-branch` after it
- If the decision requires human judgment, use `decision-gate` instead
