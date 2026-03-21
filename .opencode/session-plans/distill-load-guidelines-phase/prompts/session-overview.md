<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: Distill Load-Guidelines Phase

## Goal

Restructure all 5 planning DAGs (plan-generic, plan-debug, plan-collaborative, plan-deep-research, plan-deep-review) to move informational/educational content to the end of each session, before the user gate.

## What This Session Is

- **8 subtasks** covering analysis, design, and implementation across all 5 planning DAGs plus the design guidelines document
- **No gate nodes** — this is a pure implementation session
- **Parallel work** on DAG updates (Subtasks 3–7) will be dispatched together in one node

## Output Artifact

`.opencode/session-plans/distill-load-guidelines-phase/`

## Operating Instructions

Execute subtasks in order. Each subtask prompt is agent-internal — execute as written. Do not skip or reorder subtasks.

## Delegation Summary

| Subtask | Agent |
|---------|-------|
| 1 | @ContextScout (parallel × 5) |
| 2 | HW (direct) |
| 3–7 | @JuniorDev (parallel × 5) |
| 8 | @QuickDoc |

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
