# Subtask 04 — Push to Main

## Delegation
- **Agent:** HeadWrench (direct)
- **Model tier:** N/A — HeadWrench executes directly
- **Reason:** Git operations are always HeadWrench's direct responsibility.

---

## Objective

Push all session changes to `main` and close the session. This subtask runs after the G1 gate — user has already reviewed and approved all changes.

---

## Todolist

### 1. Final verification
- [ ] Run `git status` to confirm all changes are committed (WIP commits from checkpoints)
- [ ] Run `git log --oneline -10` to review commit history

### 2. Push to main
- [ ] Run `git push origin main`
- [ ] Confirm push succeeded

### 3. Session close
- [ ] Update `index.md` — mark all subtasks completed, session status = completed
- [ ] Update `spec.json` — status = "complete", all subtasks completed
- [ ] Write closing note to `.opencode/sessions/deny-by-default-agent-permissions/notes/session-close.md`
- [ ] Write inbox entry: deny-by-default is now the standard pattern for all agent permission blocks

---

## Scope
- **Edit:** `.opencode/sessions/deny-by-default-agent-permissions/index.md`, `.opencode/sessions/deny-by-default-agent-permissions/spec.json`
- **Read:** git log, git status
- **Write:** `notes/session-close.md`, `.opencode/inbox/<date>-deny-by-default-pattern.md`
- **Excluded:** All agent files (already committed)

---

## Constraints
- Do NOT force push
- Do NOT amend any commits that have already been pushed
- The final commit message must be: `feat: complete session — deny-by-default-agent-permissions`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
