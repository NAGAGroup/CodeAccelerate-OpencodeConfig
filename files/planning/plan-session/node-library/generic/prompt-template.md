# {{NODE_TITLE}}

*Use this node type only when none of the structured node types fit. Document in `## Context and constraints` why a standard node type wasn't used.*

{{NODE_DESCRIPTION}}

## Goal

{{GOAL}}

## Todo

{{TODO_ITEMS}}

> List each tool call as a numbered item matching the plan.json todo format. E.g.:
> 1. `bash` — Run `bun run build` to verify the build passes.
> 2. `task` — Dispatch @JuniorDev to fix lint errors.
> 
> Each item must correspond to a real OpenCode tool name (`bash`, `task`, `question`, `sequential-thinking_sequentialthinking`, `compress`, `validate_dag`, `activate_plan`).

## Context and constraints

{{NOTES}}

Document what HW needs to know at runtime: relevant prior decisions, files in scope, things NOT to do. This is runtime context for HW, not planning notes.

## Before advancing

If this node's work surfaced findings, concerns, or decisions the user should be aware of before the next step, consider interacting with them before calling `next_step()`. This is optional — if everything is clear, advance when ready.
