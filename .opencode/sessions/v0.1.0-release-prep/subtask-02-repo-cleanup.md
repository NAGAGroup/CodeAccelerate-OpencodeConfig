# Subtask 02 — Repo Cleanup

## Delegation
- **Agent:** CodeWriter for file edits; HeadWrench runs git rm commands directly
- **Model tier:** fast — CodeWriter handles .gitignore rewrite; HW handles `git rm --cached`
- **Reason:** The .gitignore rewrite is a well-specified file edit (CodeWriter's domain). The `git rm --cached` commands to untrack stale files are git operations (HeadWrench's direct responsibility).

---

## Objective

Replace the bloated generic Node.js `.gitignore` template at the repo root with a lean, project-specific one. Then untrack files that should no longer be tracked: `.opencode/session-ids/` (local env specific) and `.opencode/inbox/` (transient staging area). After this subtask the repo's tracked files are exactly what belongs in the v0.1.0 deliverable.

---

## Todolist

### 1. Delegate .gitignore rewrite to CodeWriter
- [ ] Replace `/home/jack/CodeAccelerate-OpencodeConfig/.gitignore` with lean project-specific content (see Patterns below for exact content)

### 2. HeadWrench: untrack stale files
- [ ] `git rm --cached .opencode/session-ids/ses_32698dbc3ffey0CPEbYS49RHu9/active-session.json` — remove the one tracked session-ids file
- [ ] Verify no other session-ids files are tracked: `git ls-files .opencode/session-ids/`
- [ ] Verify no inbox files need removal (they are already tracked and will be removed by gitignore going forward, but existing tracked files need explicit `git rm --cached`):
  - `git rm --cached .opencode/inbox/2026-03-10-gates-embedded-in-subtask-todolists.md`
  - `git rm --cached .opencode/inbox/opencode-ai-plugin-import-patterns.md`
  - `git rm --cached .opencode/inbox/typecheck-opencode-plugins.md`

### 3. Verify final tracked state
- [ ] `git status` — confirm session-ids and inbox files show as untracked (not deleted from disk)
- [ ] `git ls-files .opencode/` — confirm only `.opencode/sessions/` and `.opencode/context/` content remains tracked

### 4. Checkpoint
- [ ] Follow checkpoint protocol (WIP commit should include .gitignore change and the removed file refs)

---

## Scope
- **Edit:** `.gitignore` (root)
- **Read:** nothing required
- **Write:** nothing new
- **Excluded:** Any changes to `opencode/` config files; any changes to `.opencode/sessions/` content

---

## Patterns

### Target .gitignore content (exact):
```
# OpenCode runtime — local environment specific
.opencode/session-ids/

# OpenCode inbox — transient staging area (move to .opencode/context/ when ready to commit)
.opencode/inbox/

# OpenCode managed files — auto-installed by OpenCode runtime, do not track
opencode/node_modules/
opencode/bun.lock
opencode/package.json
opencode/package-lock.json

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

```
✅ GOOD — git rm --cached <file> (removes from tracking, leaves file on disk)
❌ BAD  — git rm <file> (deletes the file entirely)
✅ GOOD — verify with git ls-files after removal
❌ BAD  — assume git rm --cached worked without checking
```

---

## Constraints
- `git rm --cached` only — never `git rm` (must not delete files from disk)
- The inbox files (3 files) are currently tracked and must be explicitly removed from git index
- The session-ids file (1 file) must be explicitly removed from git index
- After this subtask, `git status` should show these files as untracked (not deleted)
- The new .gitignore must not exclude `.opencode/sessions/` or `.opencode/context/`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
