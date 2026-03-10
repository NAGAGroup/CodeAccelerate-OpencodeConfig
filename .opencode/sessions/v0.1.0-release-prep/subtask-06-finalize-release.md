# Subtask 05 — Finalize Release

## Delegation
- **Agent:** HeadWrench (direct execution)
- **Model tier:** standard — github-copilot/claude-sonnet-4.6
- **Reason:** Entirely git operations. HeadWrench runs these directly. Sequencing and correctness matter — this is the final destructive step.

---

## Objective

Point `main` at the rewritten history (`rewritten-history` orphan branch tip), tag `v0.1.0`, delete `simple-rewrite` locally and on origin, and push everything to origin. After this subtask, origin/main contains the clean rewritten history, the v0.1.0 tag is live, and `simple-rewrite` is gone (archived safely as `archive/simple-rewrite`).

---

## Todolist

### 1. Pre-flight verification
- [ ] `git log --oneline rewritten-history | wc -l` — confirm 6 commits on the orphan branch
- [ ] `git log --oneline rewritten-history` — visually confirm the 6 milestone messages look right
- [ ] `git branch -a` — confirm `archive/simple-rewrite` exists on origin (from subtask 01)
- [ ] Confirm we are currently on `rewritten-history` branch: `git branch --show-current`

### 2. Rename rewritten-history to main (force)
- [ ] `git branch -M rewritten-history main`
   - This renames the current `rewritten-history` branch to `main` locally
   - The existing local `main` branch (pointing to old history) must be deleted first if it still exists
   - If `git branch -M` fails due to existing main: `git branch -D main && git branch -M rewritten-history main`

### 3. Tag v0.1.0
- [ ] `git tag -a v0.1.0 HEAD -m "Release v0.1.0 — first production-ready HeadWrench orchestration config"`

### 4. Delete simple-rewrite locally
- [ ] `git branch -D simple-rewrite`

### 5. Push everything to origin
- [ ] `git push origin main --force` — force push is required (rewritten history, orphan root)
- [ ] `git push origin v0.1.0` — push the annotated tag
- [ ] `git push origin --delete simple-rewrite` — delete simple-rewrite on origin

### 6. Set upstream tracking
- [ ] `git branch --set-upstream-to=origin/main main`

### 7. Final verification
- [ ] `git log --oneline origin/main | wc -l` — should be 6 (fetch latest: `git fetch origin` first)
- [ ] `git tag -l` — confirm v0.1.0 exists
- [ ] `git branch -a` — confirm: main exists, simple-rewrite is gone, all archive/* branches exist
- [ ] `git status` — confirm clean working tree on main

### 8. Checkpoint — Session close
- [ ] This is the final subtask — follow the **Session Close** section of checkpoint.md:
  - Final commit: NOT a WIP commit. The rewritten-history IS the final state. No additional commit needed.
  - Update `index.md` — mark all subtasks completed, session status = completed
  - Update `spec.json` — all subtasks completed, status = "complete"
  - Write closing note to `.opencode/sessions/v0.1.0-release-prep/notes/session-close.md`

---

## Scope
- **Edit:** nothing
- **Read:** nothing
- **Write:** nothing (git operations only, plus session close notes)
- **Excluded:** Any changes to file content; do not touch archive/* branches

---

## Patterns
```
✅ GOOD — git branch -M rewritten-history main  (rename, force-replace if main exists)
❌ BAD  — git checkout main && git reset --hard rewritten-history  (messy, wrong approach)
✅ GOOD — git push origin main --force  (required for orphan history; archives are safe)
❌ BAD  — git push origin main  (will be rejected due to non-fast-forward)
✅ GOOD — git fetch origin && git log --oneline origin/main  (verify remote state after push)
❌ BAD  — Assume push succeeded without verifying remote state
✅ GOOD — git push origin --delete simple-rewrite  (clean up remote)
❌ BAD  — Leave simple-rewrite on origin (stale ref pollutes the remote)
```

---

## Constraints
- **Force push is required** for `main` — the rewritten history is an orphan with no common ancestor with origin/main. This is expected and intentional.
- **DO NOT force push** archive branches — they must remain untouched
- **DO NOT force push** any branch other than `main`
- `git push origin --delete simple-rewrite` only runs AFTER `archive/simple-rewrite` is confirmed on origin (verified in pre-flight)
- If `git branch -M rewritten-history main` fails because a local `main` still exists, delete local main first: `git branch -D main`
- The session-close note must document: what changed, final git state, and that all archive branches are confirmed on origin

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
