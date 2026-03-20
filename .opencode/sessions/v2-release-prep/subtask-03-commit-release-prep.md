# Subtask 03 — Commit Release Prep

## Objective

Stage and commit the `scripts/` deletion and new `CHANGELOG.md` as a single release-prep commit. The working tree should be clean afterward. No tagging — the user handles the v2.0.0 tag and GitHub release separately.

## Scope

- Stage: `scripts/` deletion (both files removed in subtask 01)
- Stage: `CHANGELOG.md` (new file written in subtask 02)
- Commit with message: `chore: release prep for v2.0.0`
- Excluded: `.opencode/` session files (not committed as part of the release)

## Constraints

- Commit only the two changes above — do not sweep in unrelated diffs
- Commit message must be exactly: `chore: release prep for v2.0.0`
- Do not push to remote — user handles push and tag separately
- Do not create a tag

## Todolist

- [ ] `git status` — confirm only `scripts/` and `CHANGELOG.md` are changed
- [ ] `git add -A scripts/ CHANGELOG.md`
- [ ] `git commit -m "chore: release prep for v2.0.0"`
- [ ] `git status` — verify working tree is clean

## Delegation

**Agent:** HW (direct)  
**Reason:** Requires running git commands and verifying output — HW owns all git operations.
