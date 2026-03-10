# Subtask 06 — Final Session Commit

## Delegation
- **Agent:** HeadWrench (direct — no delegation)
- **Model tier:** — (HeadWrench-owned git operation)
- **Reason:** Final commit is a HeadWrench-owned operation per the session close protocol.

---

## Objective

Create the final clean session commit on the `simple-rewrite` branch. This commit captures the net result of the session: 5 stale documentation files deleted, 4 new documentation files written.

---

## Todolist

### 1. Verify final state
- [ ] Confirm 5 deleted files are staged: `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`, `docs/DOCUMENTATION_MAINTENANCE.md`
- [ ] Confirm 4 new files are staged: `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`
- [ ] Run `git status` to confirm clean state

### 2. Final commit
- [ ] `git add -A`
- [ ] `git commit -m "docs: rewrite user docs for HeadWrench-based config"`

### 3. Session close
- [ ] Update `index.md` — all subtasks marked `completed`, session status `completed`
- [ ] Update `spec.json` — status: complete, all subtask statuses: completed
- [ ] Write closing note to `.opencode/sessions/rewrite-user-docs/notes/session-close.md`

---

## Scope
- **Edit:** `.opencode/sessions/rewrite-user-docs/index.md`, `.opencode/sessions/rewrite-user-docs/spec.json`
- **Write:** `.opencode/sessions/rewrite-user-docs/notes/session-close.md`
- **Excluded:** Everything in `opencode/` — no config changes

---

## Patterns
```
✅ GOOD — Commit message: "docs: rewrite user docs for HeadWrench-based config"
✅ GOOD — git add -A to capture all changes including session files
✅ GOOD — Closing note summarizes what changed and final outcomes
❌ BAD  — Amending a previous WIP commit
❌ BAD  — Force pushing to simple-rewrite
```

---

## Constraints
- Commit on `simple-rewrite` branch only
- Do NOT push to remote unless user explicitly requests it
- Commit message must use conventional commit format: `docs: ...`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
