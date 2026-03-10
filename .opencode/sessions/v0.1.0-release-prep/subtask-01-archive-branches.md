# Subtask 01 — Archive Branches

## Delegation
- **Agent:** HeadWrench (direct execution)
- **Model tier:** standard — github-copilot/claude-sonnet-4.6
- **Reason:** This subtask is exclusively git commands — creating branch refs and pushing to remote. HeadWrench runs git operations directly; no subagent needed.

---

## Objective

Create `archive/*` copies of all branches that will be deleted or replaced, and push them to origin. This ensures a complete, recoverable record of all work before any destructive operations. Branches to archive: `main`, `openagentsctl`, `claude/review-opencode-config-QRFLS`, and `simple-rewrite` (the current branch).

---

## Todolist

### 1. Create local archive branches
- [ ] `git branch archive/main origin/main` — archive the main branch tip
- [ ] `git branch archive/openagentsctl origin/openagentsctl` — archive openagentsctl
- [ ] `git branch "archive/claude-review-opencode-config-QRFLS" "origin/claude/review-opencode-config-QRFLS"` — archive the claude review branch (sanitize `/` in name)
- [ ] `git branch archive/simple-rewrite HEAD` — archive current branch (simple-rewrite = HEAD)

### 2. Push all archive branches to origin
- [ ] `git push origin archive/main archive/openagentsctl "archive/claude-review-opencode-config-QRFLS" archive/simple-rewrite`
- [ ] Verify all 4 archive branches exist on origin: `git ls-remote origin 'refs/heads/archive/*'`

### 3. Checkpoint
- [ ] Follow checkpoint protocol

---

## Scope
- **Edit:** nothing
- **Read:** nothing
- **Write:** nothing — only git refs created
- **Excluded:** Any changes to file content; do not delete any branches yet

---

## Patterns
```
✅ GOOD — git branch archive/main origin/main (creates local ref pointing to origin/main tip)
❌ BAD  — git checkout origin/main && git branch archive/main (unnecessary checkout)
✅ GOOD — push all 4 archive branches in one push command
❌ BAD  — push one at a time (slower, more error-prone)
```

---

## Constraints
- Do NOT delete any branches in this subtask — archives only
- Do NOT modify any files — this is purely git ref creation
- The `claude/review-opencode-config-QRFLS` branch name contains a `/` — use `archive/claude-review-opencode-config-QRFLS` (replace internal `/` with `-`) as the archive name
- Verify archives exist on remote before proceeding to subtask 02

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
