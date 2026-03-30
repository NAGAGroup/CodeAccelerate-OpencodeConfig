# parallel-tasks

## When to use

When multiple independent edits or dispatches can run concurrently. Use when the work can be split across files or modules that don't depend on each other's output.

**When NOT to use:** **Do not** use when tasks share a target file (concurrent writes cause conflicts) or when one task's output is required by another. Sequence those tasks instead.

## What it does

Dispatches multiple haiku agents (typically `@JuniorDev`) via sequential `task` calls. The plugin enforces sequential calls; OpenCode executes them concurrently. Default is three tasks — adjust the todo array to match the actual number of independent subtasks.

## What the planning agent must resolve

For each task, specify:

- **Agent** — Which agent handles it (`@JuniorDev` for code edits, `@QuickDoc` for docs, `@ExternalScout` for research)
- **Target** — Specific files or modules the agent should touch
- **Goal** — What the agent should produce or change
- **Constraints** — Any patterns to follow, things to avoid, or dependencies to respect
- **Output constraint per task** — Each dispatched agent prompt must include a success criterion stated as an observable outcome ("The function compiles without TypeScript errors and is exported from the module index") — not a process description ("Fix the bug"). The success criterion must be verifiable without additional tool calls.

Also determine:
- **Task count** — How many independent tasks? Adjust the todo array from the default `["task","task","task"]` to match. The number of `task` entries in the `todo` array must match the number of distinct task instructions in the prompt — they are enforced in order by the plugin. Adjust both together.
- **Independence check** — Are the tasks truly independent? If one depends on another's output, use sequential nodes instead. Good: "Task 1 edits src/auth/token.ts; Task 2 edits src/auth/session.ts — no shared file, no shared output." Bad: "Task 2 depends on the function Task 1 adds." (dependency → use sequential nodes)
- **Success criterion** — What observable outcome confirms the task was completed? (E.g., "The function compiles without TypeScript errors and is exported from the module index.")
- **Conventions reference** — If the edit must match existing style, name the reference file (e.g., "Match the pattern in `src/auth/session.ts`").

## Node ID

Default: `parallel-tasks`. Rename for clarity: `implement-handlers`, `update-schemas`, `write-tests`. For multiple parallel-task phases, use descriptive IDs (`implement-handlers`, `implement-handlers-2`) rather than generic numeric suffixes where possible.

## Notes

- Agents are haiku-tier — fast and cheap. Do not use this node for work requiring ContextInsurgent.
- Step budget for `@JuniorDev` is 10. Each task must be completable within that budget.
- `@QuickDoc` step budget is 8 — ensure documentation tasks are scoped accordingly.
- If tasks need to share context, use sequential nodes or route through HW instead.
- Fewer than three tasks is fine — remove entries from the todo array.
- For `@QuickDoc` tasks: the prompt must also include the format/template to follow and a reference file to match style. These are required for QuickDoc to produce consistent output.
- **Failure mode:** Dispatching tasks that write to the same file from two parallel agents. Both agents read the file, write back independently — one write silently overwrites the other. If two tasks touch the same file, make them sequential nodes or combine them into one task.
