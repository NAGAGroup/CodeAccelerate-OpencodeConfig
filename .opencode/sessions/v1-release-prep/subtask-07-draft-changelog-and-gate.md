# Subtask 07 — draft-changelog-and-gate

## Objective
Draft the `[1.0.0] - 2026-03-15` section for `CHANGELOG.md` covering all changes since v0.1.0, then stop and surface it to the user for review before committing.

## TL;DR
The [Unreleased] section is empty. Everything done between v0.1.0 and now needs to be documented as v1.0.0. HeadWrench drafts this, then a gate stops execution for user approval.

## Scope
### Edit
- `CHANGELOG.md`

### Read
- `CHANGELOG.md` (current content)
- `.opencode/sessions/v1-release-prep/index.md` (to see what was done in this session)
- All session notes in `.opencode/sessions/v1-release-prep/notes/`

### Write
- None

### Excluded
- All other files

## Constraints
- Follow Keep a Changelog format (https://keepachangelog.com)
- Use date 2026-03-15 for v1.0.0
- Sections to use: Added, Changed, Fixed, Removed
- Do NOT commit — this subtask ends with a gate

## What to Document (v1.0.0 changes since v0.1.0)

### Added
- context-insurgent subagent — deep codebase exploration with sequential thinking
- agent-writer skill — HeadWrench creates session-local agents during plan finalization
- /context-audit command — audits permanent context files for staleness
- /quick-plan command — lightweight planning for small tasks
- /session-status command — displays current session state and subtask progress
- Modular planning protocol (plan-init, plan-generic, plan-collaborative, plan-debug, plan-shared, plan-end replacing monolithic plan-workflow.md)
- context-management.md protocol — 5-tier context model with staleness, supersession, and conflict resolution rules
- Session archival support — completed sessions can be moved to .opencode/archive/sessions/

### Changed
- Agent roster reduced and clarified: removed gates-expert, subagent-builder, code-writer, doc-writer, architect; now headwrench + 3 focused subagents
- DCP plugin version: @beta → @3.0.0 (@tarquinen/opencode-dcp@3.0.0)
- exa MCP now enabled by default (requires EXA_API_KEY env var)
- FEATURES.md fully rewritten to reflect current component inventory

### Fixed
- Documentation inaccuracies across FEATURES.md, CONCEPTS.md, README.md, USAGE.md, ROADMAP.md
- Stale agent references (DocWriter, CodeWriter) removed from session-plan-schema.md
- Broken file reference (opencode/commands/README.md) removed from DOCUMENTATION_MAINTENANCE.md

### Removed
- gates-expert, subagent-builder, code-writer, doc-writer, architect agents
- Monolithic plan-workflow.md protocol (replaced by modular plan-*.md files)

## Gate
After HeadWrench writes the draft to CHANGELOG.md, execution stops.  
**Gate message to user:** "CHANGELOG.md has been updated with the v1.0.0 draft. Please review the [1.0.0] section and confirm it looks correct before I commit and continue."

## Todolist
- [ ] Read CHANGELOG.md current content
- [ ] Write v1.0.0 section into CHANGELOG.md (Added / Changed / Fixed / Removed)
- [ ] 🚫 GATE — Surface CHANGELOG draft to user for review; wait for explicit approval

## Delegation
**Agent:** HeadWrench directly  
**Reason:** HW drafts the changelog directly since it has full context of all session changes; gate handling is a HW responsibility.
