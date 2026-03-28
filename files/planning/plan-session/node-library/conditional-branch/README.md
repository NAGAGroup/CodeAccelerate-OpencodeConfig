# conditional-branch

## When to use

When the path forward is determined by a condition that can be evaluated without user input — exit code of a prior bash command, presence of a file, a value from a prior agent's output, etc. The plugin presents the available branches and HW calls `next_step` to pick one.

## What it does

No todo — auto-advances to the plugin's branch prompt immediately. The prompt describes the condition and what each branch means. HW reads it, evaluates the condition based on prior context, and calls `next_step` with the correct branch.

## What the planning agent must resolve

- **The condition** — What is being evaluated? (e.g., "Did the build succeed?", "Does the output file exist?")
- **How HW knows** — What prior context tells HW which branch to take (e.g., exit code from a preceding bash node, agent output, file check result)
- **Branch meanings** — What each `when` condition represents and where it leads

## Node ID

Default: `conditional-branch`. Rename for clarity: `check-build-result`, `file-exists-check`.

## Notes

- Empty todo — the plugin handles branch presentation automatically
- The branch decision must be inferable from prior context without any additional tool calls
- If the decision requires a new shell command, put the `bash` call in a preceding `generic` node and use `conditional-branch` after it
- If the decision requires human judgment, use `decision-gate` instead
