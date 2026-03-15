# Subtask 01 — cleanup-and-runtime-fixes

## Objective
Delete the three global agents being removed (code-writer.md, doc-writer.md, subagent-builder.md), update opencode.json (remove their entries, enable exa MCP, add description fields), fix stale session statuses, and mark the stale inbox item inactive.

## Scope

### Edit
- `opencode/opencode.json` — remove code-writer/doc-writer/subagent-builder entries, set exa `"enabled": true`, add description fields to remaining agent entries

### Delete
- `opencode/agents/subagents/code-writer.md`
- `opencode/agents/subagents/doc-writer.md`
- `opencode/agents/subagents/subagent-builder.md`

### Edit (session state)
- `.opencode/sessions/lockdown-workflows-and-agents/spec.json` — change status to `"abandoned"`, add abandonedAt + abandonedReason fields
- `.opencode/sessions/concepts-why-this-works/spec.json` — change status to `"pending"` (it's currently `"in_progress"` with no execution started)
- `.opencode/inbox/context-insurgent-needs-write-for-session-notes.md` — set `active: false`, add `superseded_by: "context-insurgent.md now has write: allow for session notes"`

### Excluded
- No changes to any agent .md content files (other than deletion)
- No changes to protocols or commands

## Constraints
- `opencode.json` agent entries use the pattern: `{ "name": "agent-name", "path": "...", "model": "..." }` — verify exact structure before editing
- exa MCP entry is under the `"mcp"` key; set `"enabled": true` only on the exa entry, not others
- Description fields: short, one-line strings describing each agent's role
- Descriptions to add: headwrench ("Primary orchestrator — plans, delegates, drives sessions"), context-scout ("Read-only situational awareness for pre-planning"), context-insurgent ("Deep multi-file exploration with sequential reasoning"), deep-researcher ("Web and documentation research via exa and Context7"), compaction ("Context compaction handler")
- Do NOT change model IDs for any remaining agents
- lockdown-WA abandonedReason: "Decisions superseded by opencode-config-audit session (2026-03-13)"
- concepts-why-this-works: it currently shows `"in_progress"` but subtask 0 is the only completed subtask (bootstrap); set to `"pending"` since no substantive work started

## Todolist
- [ ] Delete code-writer.md, doc-writer.md, subagent-builder.md
- [ ] Update opencode.json: remove 3 agent entries, enable exa MCP, add description fields
- [ ] Fix lockdown-WA spec.json → abandoned
- [ ] Fix concepts-why-this-works spec.json → pending
- [ ] Mark context-insurgent-needs-write inbox item inactive

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — file edits and deletions, straightforward spec
