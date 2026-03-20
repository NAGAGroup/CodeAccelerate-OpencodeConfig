# Session: fix-collaborative-prompts

**Goal:** Rewrite the `/plan-collaborative` DAG node prompts and HeadWrench system prompt so the planning agent clearly understands it is designing a session artifact — not conducting the collaborative work itself.

**Status:** ready

**Created:** 2026-03-20

## Subtasks

| # | Name | Agent | Status |
|---|------|-------|--------|
| 01 | update-headwrench-collaborative-description | @JuniorDev | pending |
| 02 | rewrite-idea-intake | @JuniorDev | pending |
| 03 | rewrite-clarify | @JuniorDev | pending |
| 04 | rewrite-seed-gate | @JuniorDev | pending |
| 05 | rewrite-finalize | HW (direct) | pending |
| 06 | update-agent-routing | @JuniorDev | pending |

## Gates

None — all subtasks are file edits to non-compiled config files. No irreversible steps.
