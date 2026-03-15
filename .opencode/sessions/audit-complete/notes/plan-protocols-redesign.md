# plan-protocols-redesign

**Session:** audit-complete  
**Created:** 2026-03-15  

## Summary

`plan-workflow.md` was a monolithic 130+ line file covering all planning scenarios inline. It has been superseded by 6 modular protocol files that decompose the planning workflow by phase and session type.

## New File Structure

| File | Role |
|------|------|
| `opencode/protocols/plan-init.md` | Phase 1: Orientation — project layout, parallel ContextScouts, ContextInsurgent synthesis, session type detection |
| `opencode/protocols/plan-shared.md` | Shared steps: base Q&A (5 categories), type-specific Q&A, Sequential Thinking synthesis, checkpoint approval, research gate |
| `opencode/protocols/plan-end.md` | Finalization: write session files, activate_session, session-local agent creation, git commit, final overview |
| `opencode/protocols/plan-generic.md` | Generic session type: decomposition rules, subtask ordering, gate placement, agent-delegation-expert skill |
| `opencode/protocols/plan-debug.md` | Debug stub: reproduce→diagnose→gate→fix→regression |
| `opencode/protocols/plan-collaborative.md` | Collaborative stub: Review/Approve/Observe levels, pause cadence |

`plan-workflow.md` has `active: false` and `superseded_by` pointing to all 6 new files.

`opencode/commands/plan.md` was rewritten as a 33-line pure router referencing the protocol files with no inline implementation steps.

## Key Design Decisions

- `plan-init.md` enforces the multi-ContextScout → ContextInsurgent synthesis pattern (C-P2 fix)
- `plan-shared.md` treats research as a **gate** (user-confirmed), resolving the H-P3 contradiction
- `plan-end.md` includes `activate_session` call and session-local agent creation
- Debug and Collaborative are stubs — marked explicitly for expansion in future sessions
- Invariants section in `plan.md` is kept inline (not in a protocol file) as a safety guard

## Files Changed

- `opencode/protocols/plan-init.md` — NEW (ST09)
- `opencode/protocols/plan-shared.md` — NEW (ST09)
- `opencode/protocols/plan-end.md` — NEW (ST09)
- `opencode/protocols/plan-generic.md` — NEW (ST09)
- `opencode/protocols/plan-debug.md` — NEW (ST09, stub)
- `opencode/protocols/plan-collaborative.md` — NEW (ST09, stub)
- `opencode/protocols/plan-workflow.md` — superseded (ST09)
- `opencode/commands/plan.md` — full rewrite as router (ST10)
