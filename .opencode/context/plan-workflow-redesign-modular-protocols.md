---
topic: plan-workflow-redesign-modular-protocols
tier: local
promoted_from: inbox
session: audit-complete
created: 2026-03-15
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# Plan Workflow Redesign: Modular Protocol Files

The monolithic `plan-workflow.md` has been superseded by 6 modular protocol files and `plan.md` is now a pure router.

## New Structure

- `plan.md` — 33-line router command (no inline steps)
- `plan-init.md` — Phase 1 orientation (parallel scouts → ContextInsurgent synthesis)
- `plan-shared.md` — Q&A + Sequential Thinking synthesis + research gate
- `plan-end.md` — Finalization (session files, activate_session, agent creation, commit)
- `plan-generic.md` — Generic session type flow
- `plan-debug.md` — Debug stub (expand in future session)
- `plan-collaborative.md` — Collaborative stub (expand in future session)

## Key Design Principles Applied

- Research is a **gate** (user-confirmed), not a sub-step
- Multi-ContextScout → ContextInsurgent synthesis is documented in plan-init.md
- Sequential Thinking synthesis is documented in plan-shared.md
- `activate_session` call is in plan-end.md
- Session-local agent creation is in plan-end.md Step 3
