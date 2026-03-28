# parallel-tasks

## When to use

When multiple independent edits or dispatches can run concurrently. Use when the work can be split across files or modules that don't depend on each other's output.

## What it does

Dispatches multiple haiku agents (typically `@JuniorDev`) via sequential `task` calls. The plugin enforces sequential calls; OpenCode executes them concurrently. Default is three tasks — adjust the todo array to match the actual number of independent subtasks.

## What the planning agent must resolve

For each task, specify:

- **Agent** — Which agent handles it (`@JuniorDev` for code edits, `@QuickDoc` for docs, `@DeepResearcher` for research)
- **Target** — Specific files or modules the agent should touch
- **Goal** — What the agent should produce or change
- **Constraints** — Any patterns to follow, things to avoid, or dependencies to respect

Also determine:
- **Task count** — How many independent tasks? Adjust the todo array from the default `["task","task","task"]` to match.
- **Independence check** — Are the tasks truly independent? If one depends on another's output, use sequential nodes instead.

## Node ID

Default: `parallel-tasks`. Rename for clarity: `implement-handlers`, `update-schemas`, `write-tests`.

## Notes

- Agents are haiku-tier — fast and cheap. Do not use this node for work requiring ContextInsurgent.
- Step budget for `@JuniorDev` is 10. Each task must be completable within that budget.
- If tasks need to share context, use sequential nodes or route through HW instead.
- Fewer than three tasks is fine — remove entries from the todo array.
