# ST03 Finding: $ARGUMENTS Injection Patterns

## Date
2026-03-17

## Context
During ST03 (rewriting context/session command files), multiple `$ARGUMENTS` placements were audited and fixed. An addendum was required for `amend.md` and `continue.md` which were outside the original scope.

## Patterns Discovered

### Orphan $ARGUMENTS (anti-pattern)
A bare `$ARGUMENTS` on its own line gives the agent no context about what the value represents.
- `amend.md` line 6: fixed → `Amend the active session plan as follows: $ARGUMENTS`
- `continue.md` line 6: fixed → `Resume the session named \`$ARGUMENTS\`. If no session name was given, list available sessions and ask.`

### Dual $ARGUMENTS usage (continue.md)
`continue.md` used `$ARGUMENTS` twice: once as an orphan opener and once correctly embedded in a file path (`Read .opencode/sessions/$ARGUMENTS/spec.json`). Only the orphan was fixed; the path usage was preserved.

### Vestigial $ARGUMENTS (deactivate-session.md)
`deactivate-session.md` had `$ARGUMENTS` but takes no arguments. Removed entirely.

### No-argument commands (context-list.md)
`context-list.md` takes no arguments — no `$ARGUMENTS` needed at all.

### Slash command reference in continue.md
`continue.md` referenced `/context-audit` in the completed-session message. Fixed to "context audit" during the addendum.

## Rule
Embed `$ARGUMENTS` mid-sentence so the agent understands what value it holds. Never leave it as a standalone line.
