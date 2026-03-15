# Session: audit-complete

## Goal
Implement all remaining AUDIT.md findings (Tiers 3–6) plus new design changes: remove CodeWriter/DocWriter as global agents, create agent-writer skill, delete SubagentBuilder, redesign planning protocols.

## Status: in_progress

## Subtasks

| # | Name | Status |
|---|------|--------|
| 01 | cleanup-and-runtime-fixes | completed |
| 02 | fix-checkpoint | completed |
| 03 | fix-commands-critical | in_progress |
| 04 | fix-commands-secondary | pending |
| 05 | fix-schema-and-context-management | pending |
| 06 | create-agent-writer-skill | pending |
| 07 | rewrite-delegation-skill | pending |
| 08 | update-headwrench | pending |
| 09 | write-plan-protocols | pending |
| 10 | redesign-plan-md | pending |
| 11 | final-cleanup | pending |

## Notes
- Session-local implementer agent at `.opencode/agents/session-local-implementer.md` handles all file edits
- Gate after subtask 07: review foundational fixes before proceeding to headwrench + plan redesign
- All work is pure markdown/JSON edits — no build/test steps
- `.opencode/agents/` directory created during plan finalization
