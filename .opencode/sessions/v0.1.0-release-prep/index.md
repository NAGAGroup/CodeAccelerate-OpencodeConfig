# Session: v0.1.0-release-prep

**Goal**: Archive all branches except simple-rewrite, clean up the repo, rewrite git history from the v0.1.0 baseline (b965159) with logical milestone commits, set main to the rewritten history, tag v0.1.0, and delete simple-rewrite.

---

## Done Criteria

- [ ] All branches archived as `archive/{original-name}` on origin (main, openagentsctl, claude/review-opencode-config-QRFLS, simple-rewrite)
- [ ] `.gitignore` is lean and project-specific (no generic Node template bloat)
- [ ] `.opencode/session-ids/` and `.opencode/inbox/` are gitignored and removed from tracking
- [ ] `CHANGELOG.md` written for v0.1.0
- [ ] Git history rewritten: 6 logical milestone commits starting from b965159 tree
- [ ] `main` branch = rewritten history (force-pushed to origin)
- [ ] `simple-rewrite` branch deleted locally and on origin
- [ ] `v0.1.0` annotated tag on final commit, pushed to origin

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | 🔲 pending | Archive all branches to `archive/*` — **HeadWrench / standard** |
| 02 | 🔲 pending | Repo cleanup: rewrite `.gitignore`, remove stale tracked files — **CodeWriter + HW / fast** |
| 03 | 🔲 pending | Write `CHANGELOG.md` for v0.1.0 — **DocWriter / fast** |
| 04 | 🔲 pending | Audit and update all user-facing docs — **DocWriter / standard** |
| 05 | 🔲 pending | Rewrite git history: orphan branch with 6 milestone commits — **HeadWrench / standard** |
| 06 | 🔲 pending | Finalize release: set main, delete simple-rewrite, tag v0.1.0, push all — **HeadWrench / standard** |

---

## Scope

**In scope**:
- Archiving all non-simple-rewrite branches
- `.gitignore` cleanup (replace bloated template with lean project-specific rules)
- Removing `.opencode/session-ids/` from git tracking
- Removing `.opencode/inbox/` from git tracking  
- Writing `CHANGELOG.md`
- Git history rewrite using orphan branch approach
- Force-pushing rewritten main to origin
- Tagging v0.1.0

**Out of scope**:
- Any changes to agent/protocol/command/plugin files
- Functional changes of any kind
- Adding new documentation beyond CHANGELOG.md

---

## Patterns & Constraints

- **Conventional Commits** for all rewritten history messages
- **Milestone commits** reference the 6 logical milestones (not individual session-close commits)
- **`.opencode/sessions/`** stays tracked — valuable dev history
- **`.opencode/context/`** stays tracked — potential future deliverable
- **`.opencode/session-ids/`** gitignored — local env specific
- **`.opencode/inbox/`** gitignored — transient staging area
- **`opencode/node_modules/`, `opencode/bun.lock`, `opencode/package.json`, `opencode/package-lock.json`** gitignored — OpenCode manages these
- Archive branches use `archive/{original-name}` naming
- No destructive operations until archives are confirmed on remote (subtask 01 completes first)
- Circuit breaker: 3 consecutive failures

---

## Current Focus

Subtask 01 is next: archive all branches to `archive/*` on origin.

