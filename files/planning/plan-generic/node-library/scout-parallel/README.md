# scout-parallel

## When to use

When you need broad codebase coverage before acting. Use near the start of a DAG to give HW situational awareness. Three scouts run in parallel across different areas.

## What it does

Dispatches three `@ContextScout` agents via three sequential `task` calls. The plugin enforces sequential calls; OpenCode dispatches them concurrently. Each scout covers a different area and reports back.

## What the planning agent must resolve

For each of the three scouts, specify:

1. **Scout 1 — Affected code**: Which specific files, modules, or components the task touches directly. Provide file paths or glob patterns if known.
2. **Scout 2 — Patterns and architecture**: Where to look for conventions, existing patterns, and structural rules the task must follow.
3. **Scout 3 — Dependencies and boundaries**: Which other systems, modules, or integration points are involved. What external contracts must be respected.

If three scouts are too many (simple task with one area), use fewer `task` calls and adjust the todo array accordingly. Three is the default maximum.

## Node ID

Default: `scout-parallel`. If you need additional scouting phases, suffix: `scout-parallel-<N>`.

## Notes

- Scouts are haiku-tier — fast and cheap. Prefer them over deep analysis for initial exploration.
- Give each scout a focused question and specific paths — vague prompts produce vague output.
- Step budget for `@ContextScout` is 12. Keep scout tasks within that budget.
