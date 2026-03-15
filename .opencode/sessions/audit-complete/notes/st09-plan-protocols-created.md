# ST09 — plan protocols: 6-file decomposition of plan-workflow.md

## Files Created

- `opencode/protocols/plan-init.md` — Phase 1 orientation: glob, parallel ContextScouts, synthesis decision, session type detection
- `opencode/protocols/plan-shared.md` — Shared Q&A + synthesis: base Q&A, type-specific Q&A, Sequential Thinking, checkpoint approval, research gate
- `opencode/protocols/plan-end.md` — Finalization: write session files, activate_session, create session-local agents (PLACEHOLDER_MODEL_ID), git commit, final overview
- `opencode/protocols/plan-generic.md` — Generic session type: decomposition rules (3–8 todos/subtask), ordering, gate placement, delegation
- `opencode/protocols/plan-debug.md` — Debug stub: reproduce→diagnose→gate→fix→regression
- `opencode/protocols/plan-collaborative.md` — Collaborative stub: Review/Approve/Observe levels, pause cadence

## plan-workflow.md superseded
Added YAML frontmatter with `active: false`, `superseded_by` listing all 6 new files, `superseded_at: "2026-03-14"`. Content unchanged.

## Key Patterns
- All plan types route through plan-init.md → plan-shared.md → [type-specific] → plan-end.md
- plan-end.md owns session-local agent creation with PLACEHOLDER_MODEL_ID
- Sequential Thinking synthesis is mandatory for plans with more than 3 subtasks
