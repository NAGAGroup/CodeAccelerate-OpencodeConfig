# Subtask 04 — fix-roadmap-md

## Objective
Clean up `ROADMAP.md`: remove the duplicate "In Progress" row for session-context plugin (already shipped), drop the stale "improved Architect usage" planned item, and update the "Recently Shipped" section to reflect accurate agent and command counts.

## TL;DR
ROADMAP.md has a duplicate entry (session-context plugin listed as both In Progress and Recently Shipped), a reference to a deleted agent (Architect), and wrong counts in Recently Shipped.

## Scope
### Edit
- `ROADMAP.md`

### Read
- `ROADMAP.md` (current content)

### Write
- None

### Excluded
- All other files

## Constraints
- Do NOT modify any file other than `ROADMAP.md`
- Do NOT add new features or re-order sections
- Keep the existing format and structure

## Changes Required

1. **"▶️ In Progress" section** — Remove the entire row for "session-context plugin — inject active session state"
   - This feature is already listed in "✅ Recently Shipped" and is complete

2. **"📋 Planned" section** — Remove the "improved Architect usage" item
   - Architect agent was deleted; this planned item is no longer relevant

3. **"✅ Recently Shipped" section** — Update the stale entries:
   - "Seven specialized subagents" — change to "Four agents (HeadWrench + 3 subagents: context-scout, context-insurgent, deep-researcher)"
   - "Nine slash commands" — change to "Eleven slash commands"

## Todolist
- [ ] Read ROADMAP.md to identify exact line content for each change
- [ ] Remove "In Progress" row for session-context plugin
- [ ] Remove "improved Architect usage" from Planned section
- [ ] Update "Seven specialized subagents" entry in Recently Shipped
- [ ] Update "Nine slash commands" to "Eleven slash commands" in Recently Shipped

## Delegation
**Agent:** @session-local-implementer  
**Reason:** File editing task — removes stale entries and updates counts in ROADMAP.md.
