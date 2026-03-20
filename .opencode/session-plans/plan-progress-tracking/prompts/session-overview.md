<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session Overview: plan-progress-tracking

## Goal

Write execution progress back into `plan.json` directly so it serves as the single source of truth for session state. The three plugin tools — `activate_plan`, `next_step`, and `close_session` — in `planning-enforcement.ts` will be updated to write a `progress` block into plan.json and track per-node `status` and `completed_at` fields.

## Subtasks

| # | Name | Agent |
|---|---|---|
| 01 | Extend TypeScript interfaces | @JuniorDev |
| 02 | `activateDag` writes initial progress | @JuniorDev |
| 03 | `next_step` updates progress | @JuniorDev |
| 04 | `close_session` writes final state | @JuniorDev |
| 05 | Update schema docs | @QuickDoc |

**Execution order:** 01 → 02 → 03 → 04 (sequential — all edits to the same file). Subtask 05 (docs) runs in parallel alongside 04 or on its own.

## Key Constraints

- Only mutate plan.json when the plan lives under `.opencode/session-plans/` — skip built-in DAGs in `~/.config/opencode/planning/`
- No new helper functions needed beyond what exists; use `readDag()`, `fs.writeFileSync()`, `now()`
- Git workflow: direct to main, single commit at end of session

## No Gates

No gate nodes in this session. All subtasks are agent nodes.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
