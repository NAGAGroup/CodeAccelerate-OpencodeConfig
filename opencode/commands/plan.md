---
description: "Plan a new session — run context analysis, Q&A, draft subtasks, finalize"
agent: headwrench
---

$ARGUMENTS

## How to Run /plan

Follow these phases in order:

### Phase 1 — Orientation
See `~/.config/opencode/protocols/plan-init.md`

### Phase 2 — Q&A and Synthesis
See `~/.config/opencode/protocols/plan-shared.md`

### Phase 3 — Session Type Routing
Based on session type detected in Phase 1:
- **Generic**: See `~/.config/opencode/protocols/plan-generic.md`
- **Debug**: See `~/.config/opencode/protocols/plan-debug.md`
- **Collaborative**: See `~/.config/opencode/protocols/plan-collaborative.md`

### Phase 4 — Finalization
See `~/.config/opencode/protocols/plan-end.md`

## Invariants
These must never change regardless of session type:
- Deny-by-default permissions on all agents
- spec.json as compaction recovery anchor
- 3-layer todo stack structure
- 5-tier context loading order
- 8-step checkpoint structure
