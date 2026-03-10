# Session: fix-plan-schema-and-workflow

## Goal
Align all docs, protocols, and agent files with the actual working session format: isolated subtask-NN-{name}.md files, a checkpoint approval step in /plan, a running session summary todo, and a todolist-read instruction in the compaction hook.

## Done Criteria
- [x] `session-plan-schema.md` rewritten to reflect real structure (subtask files, correct spec.json fields)
- [x] `plan-workflow.md` and `plan.md` updated with checkpoint approval step and subtask-NN file creation instructions
- [x] `headwrench.md` updated with session summary todo ownership and During Sessions subtask-file loading
- [x] `checkpoint.md` updated with step to update the session summary todo
- [x] `agent-delegation-expert.md` updated to recommend per-subtask-file delegation sections
- [x] `session-compaction.ts` continuation prompt instructs agent to read current todolist before writing new one
- [x] All changes committed on `simple-rewrite` branch

## Subtasks

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Rewrite session-plan-schema.md to reflect real subtask-file format — **DocWriter / standard** |
| G1 | ✅ completed | Schema verification — confirm schema is correct before propagating |
| 02 | ✅ completed | Update plan-workflow.md + plan.md with checkpoint approval + subtask-NN creation — **DocWriter / standard** |
| 03 | ✅ completed | Update headwrench.md + checkpoint.md + agent-delegation-expert.md — **DocWriter / standard** |
| 04 | ✅ completed | Update session-compaction.ts continuation prompt — **CodeWriter / fast** |
| G2 | ✅ completed | Pre-close review — verify all changes before final commit |
| 05 | ✅ completed | Final commit and close session — **HeadWrench** |

> `[🚫 GATE]` items are non-negotiable stops requiring explicit user approval before proceeding.

---

## Gates

### G1 — Schema Verification (before subtask 02)
Subtask 01 has rewritten `session-plan-schema.md`. Before any other files reference the new schema:
1. Read the rewritten `session-plan-schema.md` end-to-end.
2. Confirm spec.json fields match the reference session exactly.
3. Confirm subtask file format section is complete and unambiguous.

Approve to proceed to subtask 02. Reject to revise the schema first.

### G2 — Pre-Close Review (before subtask 05)
All DocWriter and CodeWriter subtasks are complete. Before the final commit:
1. Spot-check each changed file for consistency with the new schema.
2. Confirm checkpoint approval flow is correctly described in plan-workflow.md and plan.md.
3. Confirm session summary todo is covered in both headwrench.md and checkpoint.md.
4. Confirm session-compaction.ts continuation prompt addition is minimal and correct.

Approve to finalize. Reject to send specific files back for revision.

---

## Current Focus

**Session complete.** All subtasks finished and committed on `simple-rewrite`.

---

## Scope

### In scope
- `opencode/protocols/session-plan-schema.md` — major rewrite
- `opencode/protocols/plan-workflow.md` — add checkpoint approval step
- `opencode/protocols/checkpoint.md` — add session summary todo update step
- `opencode/commands/plan.md` — add checkpoint approval phase + subtask-NN creation instructions
- `opencode/agents/headwrench.md` — session summary todo + During Sessions subtask-file loading
- `opencode/agents/subagents/agent-delegation-expert.md` — per-subtask-file delegation section recommendations
- `opencode/plugins/session-compaction.ts` — continuation prompt todolist instruction

### Out of scope
- `opencode/opencode.json` — not in scope for this session
- No changes to other agent files
- No new features beyond what is described above

---

## Patterns & Constraints

- **HeadWrench owns the session summary todo** — creates at bootstrap, updates at each checkpoint; subagents read it but never modify it
- **Session summary todo contents**: session name, goal, `.opencode/sessions/{name}/index.md` path, current subtask number and description
- **Checkpoint protocol resolution order**: session-local `protocols/checkpoint.md` first; fall back to `~/.config/opencode/protocols/checkpoint.md` if absent
- **Checkpoint approval flow**: present default to user during /plan; if changes requested, write session-local `protocols/checkpoint.md`; if no changes, no file written
- **Subtask file naming**: `subtask-NN-{name}.md` — zero-padded two-digit ID + kebab-case name
- **spec.json fields**: match reference session exactly — `name`, `goal`, `created`, `status`, `currentSubtask`, `subtaskCount`, `architectEnabled`, `circuitBreakerThreshold`; subtask entries have `id`, `name`, `description`, `status` only (no agent/model — those live in subtask files)
- **Docs/config only for subtasks 01–03** — no TypeScript changes until subtask 04
- **Build & test**: HeadWrench runs directly; CodeWriter does not run builds
- **Conventional commits** — `fix:` prefix; branch is `simple-rewrite`
- **Circuit breaker**: 3 consecutive failures halts session
