# Subtask 10 — redesign-plan-md

## Objective
Rewrite `opencode/commands/plan.md` as a barebones orchestrating command that references protocol files for all phases — no inline steps. Routes to the appropriate `plan-{type}.md` based on session type detection.

## Scope

### Edit (full rewrite)
- `opencode/commands/plan.md`

### Excluded
- No changes to any protocol files (those were created in subtask 09)
- No changes to headwrench.md

## Constraints

The new `plan.md` must:

1. **Have no inline implementation steps** — all logic lives in the protocol files created in subtask 09
2. **Be a pure router/orchestrator** — it tells HW which protocols to follow, in order
3. **Preserve the frontmatter** (`description:`, `agent: headwrench`)

### Target Structure

```markdown
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
```

The Invariants section is important — it explicitly lists what HW must preserve. Keep this inline (not in a protocol file) because it's the safety guard.

Do NOT include any phase details inline — all details live in the protocol files. The command file should be readable in under 30 seconds.

## Todolist
- [ ] Read current plan.md to understand existing structure and frontmatter
- [ ] Rewrite plan.md as barebones router with protocol references
- [ ] Preserve frontmatter (description, agent)
- [ ] Include Invariants section inline

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — straightforward rewrite with clear target structure
