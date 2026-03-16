# Subtask 08 — archive-sessions

## Objective
Archive the 4 completed sessions from `.opencode/sessions/` to `.opencode/archive/sessions/`. After archiving, instruct the user to run `/context-audit` in a fresh opencode session to verify permanent context health, then return to this session to approve and apply the v1.0.0 git tag.

## TL;DR
Four sessions are completed and cluttering the active sessions directory. Move them to the archive. Then pause for the user to run a context audit before applying the final v1.0.0 release tag.

## Scope
### Bash
- `mv` commands to move session directories

### Read
- None required (directory listing only)

### Excluded
- The active `v1-release-prep` session — do NOT archive it

## Constraints
- Archive destination: `.opencode/archive/sessions/`
- Sessions to archive: audit-complete, concepts-why-this-works, lockdown-workflows-and-agents, opencode-config-audit
- Do NOT touch `.opencode/sessions/v1-release-prep/`
- This is NOT the final subtask (amended) — use WIP commit format: `wip: subtask 08 complete — archive completed sessions`
- v1.0.0 tag has been moved to subtask 10 (the true final subtask)

## Sessions to Archive
- `.opencode/sessions/audit-complete/`
- `.opencode/sessions/concepts-why-this-works/`
- `.opencode/sessions/lockdown-workflows-and-agents/`
- `.opencode/sessions/opencode-config-audit/`

## Todolist
- [ ] Verify archive directory exists (.opencode/archive/sessions/)
- [ ] Move audit-complete to archive
- [ ] Move concepts-why-this-works to archive
- [ ] Move lockdown-workflows-and-agents to archive
- [ ] Move opencode-config-audit to archive
- [ ] Verify .opencode/sessions/ only contains v1-release-prep after archival
- [x] 🚫 GATE — Context audit completed; plan amended to add /plan-deep-research feature work before tagging. Proceeding to subtask 09.

## Delegation
**Agent:** HeadWrench directly  
**Reason:** Simple bash mv operations; HW handles all file system operations outside of doc edits.
