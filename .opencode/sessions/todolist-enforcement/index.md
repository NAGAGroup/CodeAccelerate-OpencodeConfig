# Session: todolist-enforcement

**Goal**: Enforce a structured, 3-layer todo stack in HeadWrench during active sessions — session summary todo, subtask-specific todos, and checkpoint protocol todos are always present and maintained throughout execution.

---

## Done Criteria

- [ ] `headwrench.md` describes a "Session Bootstrap" procedure that creates all 3 todo layers when execution begins
- [ ] `headwrench.md` explicitly defines the 3-layer todo stack structure (session summary → subtask todos → checkpoint todos)
- [ ] `headwrench.md` defines subtask transition behavior (clear old todos, create fresh set for next subtask)
- [ ] `headwrench.md` spells out the 8 fixed checkpoint todos as an explicit checklist
- [ ] `plan.md` updated if the headwrench.md changes require it (conditional)
- [ ] Changes committed to `simple-rewrite` branch

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Analyze headwrench.md and plan.md — identify exact edit locations — ContextScout / fast |
| 02 | ✅ completed | Edit headwrench.md — add todolist enforcement rules — CodeWriter / standard |
| 03 | ✅ completed | Edit plan.md if changes needed (skip if not) — CodeWriter / fast [🚫 GATE: user reviews all edits before committing] |
| 04 | ✅ completed | Commit changes to simple-rewrite — HeadWrench / direct |

---

## Current Focus

**Next**: Subtask 03 — Edit plan.md (conditional), then gate review before commit.

---

## Scope

**In scope**:
- `opencode/agents/headwrench.md` — primary target, all new rules live here
- `opencode/commands/plan.md` — update only if headwrench.md changes require it

**Out of scope**:
- `protocols/checkpoint.md` — not being changed (approved as-is)
- `protocols/session-plan-schema.md` — not being changed
- `protocols/plan-workflow.md` — not being changed
- Any session files, spec.json format, subtask files

---

## Patterns & Constraints

- All new rules go in `headwrench.md` — no new protocol files
- The 8-step checkpoint todo checklist is fixed (same every subtask)
- Subtask todos come from the subtask file's `## Todolist` section; HW may add mid-subtask
- Gates are `[🚫 GATE]` todo items inside the preceding subtask's `## Todolist` — no standalone gate subtask rows
- Session summary todo is updated (not replaced) at each checkpoint
- Index.md is read once at session bootstrap only; subsequent navigation uses `spec.json`
- Branch: `simple-rewrite`
- Circuit breaker: 3 consecutive failures
- Architect: disabled
