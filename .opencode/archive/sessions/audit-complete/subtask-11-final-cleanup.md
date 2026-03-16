# Subtask 11 — final-cleanup

## Objective
Promote or discard `.opencode/inbox/tool-visible-output-session-prompt.md`, write session notes and inbox items for key findings from this session, cross-check all AUDIT.md items are addressed, and perform session close.

## Scope

### HeadWrench direct (no subagent)
- Review `.opencode/inbox/tool-visible-output-session-prompt.md` — determine promote vs. discard
- Write session notes to `.opencode/sessions/audit-complete/notes/`
- Write inbox items for reusable project-level findings
- Cross-check all AUDIT.md Tier 3–6 items against completed subtasks
- Run session close via `checkpoint.md` Session Close procedure

### Excluded
- No more edits to any protocol, agent, or command files

## Constraints

### tool-visible-output-session-prompt.md review
Read the file. Assess: does this pattern apply to the current codebase? Is it implemented anywhere? If yes and reusable → promote to `~/.config/opencode/context/`. If yes and project-specific → promote to `.opencode/context/`. If obsolete or speculative → discard (set `active: false`, add `discarded_at: 2026-03-14`).

### Session notes to write
Write one note per significant finding:
- `agent-writer-skill-replaces-subagent-builder.md` — documents the new session-local agent creation pattern
- `plan-protocols-redesign.md` — documents the new plan-*.md protocol structure
- `audit-complete-summary.md` — brief summary of what was fixed, what changed architecturally

### Inbox items to write
- Document the new agent taxonomy (4 global agents + session-local pattern) as a reusable project-level finding
- Document the plan-workflow redesign as an inbox item for future context promotion

### AUDIT.md cross-check
Go through AUDIT.md findings for Tiers 3–6. For each finding, note which subtask addressed it. Flag any that were missed and create follow-up notes.

### Session close
Follow the Session Close procedure in `~/.config/opencode/protocols/checkpoint.md`:
1. Write final session notes
2. Run `/context-audit` (or manually review session notes for promotion candidates)
3. Final commit: `git add . && git commit -m "feat: complete session — audit-complete"`
4. Update index.md and spec.json to `completed`

## Todolist
- [ ] Review tool-visible-output-session-prompt.md: promote or discard
- [ ] Write session notes (3 files)
- [ ] Write inbox items (2 files)
- [ ] Cross-check AUDIT.md Tiers 3–6 — verify all addressed
- [ ] Update index.md and spec.json to completed
- [ ] Final commit

## Delegation
**Agent:** HeadWrench directly
**Model:** — (HW runs this subtask; no subagent delegation)
