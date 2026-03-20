# Session: dcp-dag-compression-fix

**Goal:** Prevent DCP from compressing active DAG node content by adding `next_step()` as a compression boundary marker via prompt override files.

**Status:** ready

**Created:** 2026-03-20

## Subtask Table

| # | Name | Agent | Status |
|---|---|---|---|
| 1 | Write DCP prompt override files | @QuickDoc ×4 (parallel) | pending |
| 2 | Verify dcp.jsonc needs no changes | HW (direct) | pending |

## Gate Locations

None — no destructive or irreversible operations in this session.

## Execution Rule

Run `/activate-plan dcp-dag-compression-fix` to begin.
