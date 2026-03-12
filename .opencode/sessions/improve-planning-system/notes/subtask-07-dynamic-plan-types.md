# Subtask 07 — Dynamic Plan Types: Notes

## What was done

Added session type detection to `plan.md` and `plan-workflow.md`.

## Key design decisions

### Phase renumbering approach

Instead of using "Phase 4a/4b" labels (which were ambiguous about ordering), the phases were renumbered:
- Phase 4 — Draft Session Plan
- Phase 5 — Apply Agent Routing
- Phase 6 — Present to User
- Phase 7 — Finalize
- Phase 8 — Execution Bootstrap

This makes the sequence unambiguous: you can't apply routing before you have a plan to route.

### Session type detection position

Phase 1.5 sits between ContextScout (Phase 1) and Q&A (Phase 2). This is the correct position because:
- ContextScout runs first (before user interaction) to build situational awareness
- Session type detection is a single lightweight question that gates Q&A branching
- Q&A then uses the answer to branch conditionally

### Conditional branch design

Debug and Collaborative branches EXTEND the standard Q&A — they do not replace it. The standard Q&A base is always asked regardless of session type. This ensures Generic behavior is completely preserved.

### plan-workflow.md alignment

plan-workflow.md was updated to renumber steps to match: Step 1.5 (session type), Step 2 (Q&A with conditional branches), Steps 3-8 (match plan.md phase numbers exactly). The ordering rule was made explicit: "Drafting (Step 3) always happens before delegation routing (Step 4)."

## Commit

`dbd27f8` — feat: add session type detection and conditional Q&A branches to /plan
