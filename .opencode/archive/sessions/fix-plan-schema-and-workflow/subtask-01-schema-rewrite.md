# Subtask 01 — Rewrite session-plan-schema.md

## Delegation
- **Agent:** DocWriter
- **Model tier:** Standard (github-copilot/claude-sonnet-4.6)
- **Reason:** Major structural rewrite requiring judgment; must capture exact spec.json fields and subtask file format from the reference session precisely.

---

## Objective
Rewrite `opencode/protocols/session-plan-schema.md` so it accurately documents the real working session format: isolated `subtask-NN-{name}.md` files per subtask, correct `spec.json` field names, checkpoint footer convention, and the session summary todo.

---

## Todolist

### 1. Read reference material
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/sessions/audit-session-compaction-plugin/subtask-01-analyze.md` — note the exact structure (sections, footer)
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/sessions/audit-session-compaction-plugin/spec.json` — note exact field names
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/sessions/audit-session-compaction-plugin/index.md` — note the minimal subtask table format
- [ ] Read current `opencode/protocols/session-plan-schema.md` — understand what needs to change

### 2. Rewrite session-plan-schema.md
- [ ] **Directory structure section** — keep as-is (already correct)
- [ ] **index.md spec** — update subtask table columns to match reality: `#`, `Status`, `Description` (agent/model live in subtask files, NOT the table)
- [ ] **spec.json spec** — rewrite schema definition with correct fields: `name` (not `session`), `goal`, `created`, `status`, `currentSubtask`, `subtaskCount`, `architectEnabled`, `circuitBreakerThreshold`; subtask entries: `id`, `name`, `description`, `status` only — NO `agent` or `model` fields
- [ ] **New section: subtask-NN-{name}.md spec** — document the isolated subtask file format with all required sections: Delegation, Objective, Todolist, Scope, Patterns, Constraints, optional `[🚫 GATE]` section, and the checkpoint footer
- [ ] **Checkpoint footer convention** — document exact footer text: `*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*`
- [ ] **Session summary todo section** — document that HeadWrench maintains a running todo item containing: session name, goal, `.opencode/sessions/{name}/index.md` path, current subtask number and description; subagents must not modify it
- [ ] **Invariants section** — update to remove stale spec.json agent/model invariant; add subtask file invariant and session summary todo invariant

### 3. Verify the rewrite
- [ ] Re-read the completed file end-to-end
- [ ] Confirm spec.json example matches the reference session's actual spec.json exactly
- [ ] Confirm subtask file format section matches the reference subtask-01-analyze.md structure

---

## Scope
- **Write:** `opencode/protocols/session-plan-schema.md` (rewrite in place)
- **Read:** `.opencode/sessions/audit-session-compaction-plugin/subtask-01-analyze.md`
- **Read:** `.opencode/sessions/audit-session-compaction-plugin/spec.json`
- **Read:** `.opencode/sessions/audit-session-compaction-plugin/index.md`
- **Excluded:** All other files — do not touch plan-workflow.md, checkpoint.md, or any agent files in this subtask

---

## Patterns
```
✅ GOOD — spec.json uses "name", "subtaskCount", "architectEnabled", "circuitBreakerThreshold"
❌ BAD  — spec.json uses "session", "circuitBreakerN", has "agent"/"model" in subtask entries

✅ GOOD — subtask table in index.md has columns: # | Status | Description
❌ BAD  — subtask table has Agent and Model columns (those live in subtask files)

✅ GOOD — subtask file has Delegation section with Agent, Model tier, Reason
❌ BAD  — delegation info embedded in index.md or spec.json
```

---

## Constraints
- Do not change any file except `opencode/protocols/session-plan-schema.md`
- Base all decisions on the reference session — do not invent new conventions
- The checkpoint footer must use the exact resolution order: session-local first, global fallback

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
