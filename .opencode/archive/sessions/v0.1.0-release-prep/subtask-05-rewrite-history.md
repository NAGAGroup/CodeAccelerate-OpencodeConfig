# Subtask 04 — Rewrite Git History

## Delegation
- **Agent:** HeadWrench (direct execution)
- **Model tier:** standard — github-copilot/claude-sonnet-4.6
- **Reason:** This subtask is exclusively git commands requiring careful sequencing. HeadWrench runs all git operations directly. No code writing; no subagents.

---

## Objective

Create a clean, rewritten git history starting from the tree at `b965159724ee6b5efba22621b0d4e7d2e282db13` using an orphan branch. The rewritten history will have exactly 6 logical milestone commits that tell the story of v0.1.0. Each milestone commit captures the full TREE state at that point in history, built incrementally on top of the previous commit.

The new history will include:
- `.opencode/sessions/` content at the right milestone
- The new `.gitignore` (already written in subtask 02)
- `CHANGELOG.md` (written in subtask 03) — included in the final milestone commit
- `.opencode/session-ids/` and `.opencode/inbox/` excluded (per new .gitignore)

---

## Todolist

### 1. Create orphan branch
- [ ] `git checkout --orphan rewritten-history`
- [ ] `git rm -rf .` — clear the index (files stay on disk — verify with `ls` before and after)

### 2. Commit M1 — Initial baseline (tree from b965159)
- [ ] `git checkout b965159724ee6b5efba22621b0d4e7d2e282db13 -- .` — restore files from target SHA
- [ ] Apply the new .gitignore NOW (copy from current working tree — it was written in subtask 02): `git checkout simple-rewrite -- .gitignore`
- [ ] `git add -A`
- [ ] `git commit --date="2026-03-09T20:40:47-07:00" -m "chore: initial commit — HeadWrench orchestration config foundation"`

### 3. Commit M2 — Session plan schema alignment (tree from ba06535)
- [ ] `git checkout ba06535ac916b4e4a5cc3b4f84acb8da0cee2f25 -- .`
- [ ] Re-apply new .gitignore: `git checkout simple-rewrite -- .gitignore`
- [ ] `git add -A`
- [ ] `git commit --date="2026-03-10T00:45:22-07:00" -m "feat: align session plan schema and plan workflow with real subtask format"`

### 4. Commit M3 — Agent delegation as skill (tree from 433ab6d)
- [ ] `git checkout 433ab6d56824d0e9423acb45d4e5d043cd49eec2 -- .`
- [ ] Re-apply new .gitignore: `git checkout simple-rewrite -- .gitignore`
- [ ] `git add -A`
- [ ] `git commit --date="2026-03-10T01:19:28-07:00" -m "feat: convert agent-delegation-expert from subagent to loadable skill"`

### 5. Commit M4 — User docs rewrite (tree from 376fde5)
- [ ] `git checkout 376fde56e760bd79117cfa6b1c216403af90ca63 -- .`
- [ ] Re-apply new .gitignore: `git checkout simple-rewrite -- .gitignore`
- [ ] `git add -A`
- [ ] `git commit --date="2026-03-10T01:50:58-07:00" -m "docs: rewrite all user-facing documentation for HeadWrench system"`

### 6. Commit M5 — 3-layer todo stack (tree from e1b9283)
- [ ] `git checkout e1b9283d57f40ab3f9451247f66fd3b81f5fe3a0 -- .`
- [ ] Re-apply new .gitignore: `git checkout simple-rewrite -- .gitignore`
- [ ] `git add -A`
- [ ] `git commit --date="2026-03-10T12:30:53-07:00" -m "feat: enforce 3-layer todo stack and session bootstrap in HeadWrench"`

### 7. Commit M6 — Session-context plugin (tree from current simple-rewrite HEAD)
- [ ] `git checkout simple-rewrite -- .` — restore the full current state
- [ ] This includes: updated .gitignore, CHANGELOG.md, all current opencode/ and .opencode/ files
- [ ] Verify CHANGELOG.md is present: `ls CHANGELOG.md`
- [ ] `git add -A`
- [ ] `git commit --date="2026-03-10T14:00:00-07:00" -m "feat: replace session-compaction plugin with session-context plugin"`

### 8. Verify the rewritten history
- [ ] `git log --oneline` — should show exactly 6 commits
- [ ] `git log --oneline | wc -l` — confirm count = 6
- [ ] Spot-check M1: `git show HEAD~5 --stat` — should show files from b965159 tree
- [ ] Spot-check M6: `git show HEAD --stat` — should include CHANGELOG.md

### 9. Checkpoint
- [ ] Follow checkpoint protocol — **WIP commit step is SKIPPED** (orphan branch is the work product itself; no additional commit needed)

---

## Scope
- **Edit:** nothing (git operations only)
- **Read:** nothing
- **Write:** nothing (git operations only)
- **Excluded:** Any changes to file content; any merges or cherry-picks from other branches

---

## Patterns
```
✅ GOOD — git checkout <sha> -- .  (restores files from that commit into current index)
❌ BAD  — git checkout <sha>  (detaches HEAD, switches branches — wrong approach)
✅ GOOD — Re-apply .gitignore after each milestone checkout (prevents old .gitignore from being restored)
❌ BAD  — Forget to re-apply .gitignore (old .gitignore would be committed instead)
✅ GOOD — git rm -rf . after creating orphan (clean slate before restoring milestone files)
❌ BAD  — Skip git rm -rf . (leftover files from previous checkout will contaminate index)
✅ GOOD — Use --date flag to preserve approximate historical timing
❌ BAD  — Omit --date flag (all commits show today's date, loses chronological story)
```

---

## Constraints
- **DO NOT** delete `simple-rewrite` branch during this subtask — it is still needed as the source for M6 and as a safety reference
- **DO NOT** push `rewritten-history` to origin yet — that happens in subtask 05
- **DO NOT** modify `main` yet — that happens in subtask 05
- Re-apply `.gitignore` from `simple-rewrite` after EVERY milestone checkout — this is critical to prevent the old bloated .gitignore from being committed
- The final milestone (M6) must be checked out from `simple-rewrite` HEAD (not from a specific SHA), to ensure CHANGELOG.md is included
- `git rm -rf .` removes files from the index only — it does NOT delete them from disk. This is expected and correct.
- If any `git checkout <sha> -- .` step adds `.opencode/session-ids/` files, the `.gitignore` re-apply step will ensure they are not committed (they'll show as untracked, not staged)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
