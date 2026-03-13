# Subtask 01 — Delete Stale Documentation Files

## Delegation
- **Agent:** HeadWrench (direct — no delegation)
- **Model tier:** — (HeadWrench-owned git/file operation)
- **Reason:** Pure file deletion via git rm. No code writing or analysis needed.

---

## Objective

Remove all 5 stale documentation files that describe the old system (tech_lead, junior_dev, test_runner, explore, librarian, workflow-* commands). These files are completely wrong for the current HeadWrench-based config and must be deleted before new docs are written.

---

## Todolist

### 1. Delete stale files
- [ ] `git rm README.md`
- [ ] `git rm FEATURES.md`
- [ ] `git rm docs/CONCEPTS.md`
- [ ] `git rm docs/USAGE.md`
- [ ] `git rm docs/DOCUMENTATION_MAINTENANCE.md`
- [ ] Verify all 5 are staged for deletion (`git status`)

---

## Scope
- **Edit:** none
- **Read:** none
- **Write:** none
- **Delete:** `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`, `docs/DOCUMENTATION_MAINTENANCE.md`
- **Excluded:** Everything in `opencode/`, `.opencode/`, scripts/, plugins/

---

## Patterns
```
✅ GOOD — git rm each file individually so the intent is clear
✅ GOOD — verify with git status before WIP commit
❌ BAD  — rm -rf docs/ (would also delete the directory we'll reuse)
❌ BAD  — delete files without git rm (leaves them untracked in git)
```

---

## Constraints
- Do NOT delete the `docs/` directory itself — CONCEPTS.md and USAGE.md will be recreated there
- Do NOT touch any files outside the 5 listed above
- This subtask is read/delete only — no new content is written here

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
