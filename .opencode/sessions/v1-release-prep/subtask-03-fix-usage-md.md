# Subtask 03 — fix-usage-md

## Objective
Update `docs/USAGE.md` to reflect 11 slash commands: fix the header count and add documentation sections for the 3 missing commands (/context-audit, /quick-plan, /session-status).

## TL;DR
USAGE.md only documents 9 commands. Three commands exist in `opencode/commands/` but are entirely absent from the usage guide. Add them with consistent formatting.

## Scope
### Edit
- `docs/USAGE.md`

### Read
- `opencode/commands/context-audit.md`
- `opencode/commands/quick-plan.md`
- `opencode/commands/session-status.md`
- `docs/USAGE.md` (to understand existing format and style)

### Write
- None

### Excluded
- All other files

## Constraints
- Do NOT modify any file other than `docs/USAGE.md`
- Match the existing formatting style for command documentation sections
- Read the actual command files to get accurate descriptions and usage

## Changes Required

1. **Header/intro** — Change "9 slash commands" → "11 slash commands"

2. **Quick Reference table** — Add 3 rows:
   - `/context-audit` — audits permanent context files for staleness
   - `/quick-plan` — lightweight planning for small, well-understood tasks
   - `/session-status` — displays current session state and progress

3. **New command sections** — Add a full documentation section for each:
   - Read each command's `.md` file to get the accurate description
   - Follow the same format as existing command sections (purpose, when to use, example)

## Todolist
- [ ] Read docs/USAGE.md to understand current structure and format
- [ ] Read opencode/commands/context-audit.md
- [ ] Read opencode/commands/quick-plan.md
- [ ] Read opencode/commands/session-status.md
- [ ] Fix header count (9→11)
- [ ] Add 3 rows to Quick Reference table
- [ ] Add /context-audit section
- [ ] Add /quick-plan section
- [ ] Add /session-status section

## Delegation
**Agent:** @session-local-implementer  
**Reason:** File editing task — adds missing command documentation to USAGE.md.
