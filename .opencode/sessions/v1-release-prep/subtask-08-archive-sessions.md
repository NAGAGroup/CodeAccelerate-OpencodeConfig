# Subtask 08 — archive-sessions

## Objective
Archive the 4 completed sessions from `.opencode/sessions/` to `.opencode/archive/sessions/`.

## TL;DR
Four sessions are completed and cluttering the active sessions directory. Move them to the archive.

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
- This is the final subtask — use the Session Close commit format

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

## Delegation
**Agent:** HeadWrench directly  
**Reason:** Simple bash mv operations; HW handles all file system operations outside of doc edits.
