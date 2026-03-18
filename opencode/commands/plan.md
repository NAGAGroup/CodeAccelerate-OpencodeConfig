---
description: "Plan a new session — run context analysis, Q&A, draft subtasks, finalize"
agent: headwrench
---

You are starting a planning session. The user's topic or description is: `$ARGUMENTS`

Work through these phases in order:

## Phase 1 — Orientation

Read `~/.config/opencode/protocols/plan-init.md` and follow all steps there.

## Phase 2 — Q&A and Synthesis

Read `~/.config/opencode/protocols/plan-shared.md` and follow all steps there.

## Phase 3 — Session Type Routing

Based on the session type detected in Phase 1, read and follow the corresponding protocol:

- **Generic:** Read `~/.config/opencode/protocols/plan-generic.md` and follow all steps there.
- **Debug:** Read `~/.config/opencode/protocols/plan-debug.md` and follow all steps there.
- **Collaborative:** Read `~/.config/opencode/protocols/plan-collaborative.md` and follow all steps there.
- **Deep Research:** Read `~/.config/opencode/protocols/plan-deep-research.md` and follow all steps there.

## Phase 4 — Finalization

Read `~/.config/opencode/protocols/plan-end.md` and follow all steps there.

## Invariants
These must never change regardless of session type:
- Deny-by-default permissions on all agents
- spec.json as compaction recovery anchor
- 3-layer todo stack structure
- 5-tier context loading order
- 8-step checkpoint structure
