# {{NODE_TITLE}}

*Use this node type only when none of the structured node types fit. Document in `## Context and constraints` why a standard node type wasn't used.*

{{NODE_DESCRIPTION}}

*Brief description of what this node does and why no standard template was used. E.g., "Runs a targeted file-existence check before branching — not handled by any standard template because it combines a bash check with an immediate conditional."*

## Goal

{{GOAL}}

*What this node achieves — state the observable outcome, not the process. E.g., "Confirm that dist/index.json exists and contains the expected component count." Bad: "Check things."*

## Todo

{{TODO_ITEMS}}

> List each tool call as a numbered item matching the plan.json todo format. E.g.:
> 1. `bash` — Run `bun run build` to verify the build passes.
> 2. `task` — Dispatch @JuniorDev to fix lint errors.
> 
> Each item must correspond to a real OpenCode tool name (`bash`, `task`, `question`, `sequential-thinking_sequentialthinking`, `compress`, `validate_dag`, `activate_plan`).

## Context and constraints

{{NOTES}}

*Document what HW needs to know at runtime: relevant prior decisions, files in scope, things NOT to do. This is runtime context for HW, not planning notes.*

## Before advancing

If this node's work surfaced findings, concerns, or decisions the user should be aware of before the next step, consider interacting with them before calling `next_step()`. This is optional — if everything is clear, advance when ready.

## Rationale (fixed)

This node uses the generic type because no standard template covers this combination. The prompt documents the rationale in `## Context and constraints`. If you find yourself unable to fill that section meaningfully, reconsider whether a standard node type applies.

> **If dispatching an agent (task tool):** The subagent prompt must include:
> (1) exact file paths to read or edit;
> (2) the precise change to make or question to answer;
> (3) the expected return format;
> (4) scope note: files the agent must NOT touch.
