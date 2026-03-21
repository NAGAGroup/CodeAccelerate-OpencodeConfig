<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: parallel-grouping-fix

## Goal

Fix the planning prompt guidance so that agents consistently group parallel subagent dispatches into a **single subtask node** in generated session plans, rather than producing multiple separate DAG nodes for work that is intended to run simultaneously. Parallel execution in the DAG is not supported — only intra-node parallel dispatch (one node dispatches N agents in one response, waits for all, then advances) is valid.

## What This Session Is

- **2 subtask nodes** — no gates, no loops
- **Subtask 01**: 3 parallel @QuickDoc edits to `plan-design-guidelines.md`, `decompose.md`, and `agent-routing.md` — dispatched simultaneously in one node
- **Subtask 02**: HW-direct work — confirm the delegation skill's source file path, then edit it to add the parallel-grouping rule

## Output Artifacts

All session files live under:
`.opencode/session-plans/parallel-grouping-fix/`

Files modified by this session:
- `opencode/planning/plan-design-guidelines.md`
- `opencode/planning/plan-generic/decompose.md`
- `opencode/planning/plan-generic/agent-routing.md`
- `files/skills/delegation/SKILL.md` (source path to be confirmed by HW in ST-02)

## Operating Instructions

- Execute subtasks in order. Do not skip.
- Each subtask prompt is self-contained — read it, execute it, then call `next_step()`.
- The terminal subtask (ST-02) will prompt you to call `close_session()` instead.
- Do NOT implement anything beyond what each subtask specifies.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
