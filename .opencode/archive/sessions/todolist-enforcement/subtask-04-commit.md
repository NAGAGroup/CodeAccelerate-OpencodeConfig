# Subtask 04 — Commit Changes

## Delegation
- **Agent:** HeadWrench (direct)
- **Model tier:** N/A — HW runs git commands directly
- **Reason:** Commits are always HeadWrench's direct responsibility.

---

## Objective

Commit all changes from this session to the `simple-rewrite` branch. This subtask runs only after G1 (user review gate) has been explicitly approved.

Files to commit:
- `opencode/agents/headwrench.md` (always)
- `opencode/commands/plan.md` (only if subtask 03 made changes)

---

## Todolist

### 1. Verify state
- [ ] Run `git status` to confirm which files were modified
- [ ] Confirm we are on `simple-rewrite` branch

### 2. Stage and commit
- [ ] `git add opencode/agents/headwrench.md` (and `opencode/commands/plan.md` if changed)
- [ ] `git commit -m "feat: enforce 3-layer todo stack in HeadWrench during active sessions"`

### 3. Verify
- [ ] Run `git status` to confirm clean working tree
- [ ] Run `git log -1` to confirm commit was created correctly

---

## Scope
- **Edit:** Nothing — git operations only
- **Read:** Git status/log
- **Write:** Nothing
- **Excluded:** All other operations

---

## Patterns
```
✅ GOOD — Stage only the modified config files
✅ GOOD — Conventional commit message with feat: prefix
❌ BAD  — Committing session files (.opencode/sessions/)
❌ BAD  — Force pushing or amending previous commits
```

---

## Constraints
- Only commit `opencode/` files — NOT `.opencode/sessions/` files
- Use `feat:` prefix per project commit conventions
- Do NOT push to remote unless user explicitly requests it

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
