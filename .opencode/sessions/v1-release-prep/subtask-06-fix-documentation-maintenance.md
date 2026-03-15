# Subtask 06 — fix-documentation-maintenance

## Objective
Fix the stale reference in `docs/DOCUMENTATION_MAINTENANCE.md` that points to a non-existent file (`opencode/commands/README.md`).

## TL;DR
Line 22 of DOCUMENTATION_MAINTENANCE.md references `opencode/commands/README.md` as a "workflow reference table" — this file does not exist. Remove or correct the reference.

## Scope
### Edit
- `docs/DOCUMENTATION_MAINTENANCE.md`

### Read
- `docs/DOCUMENTATION_MAINTENANCE.md` (current content)

### Write
- None

### Excluded
- All other files

## Constraints
- Only change the stale reference on line ~22 — do not alter other content
- Do NOT create `opencode/commands/README.md`

## Changes Required

### Line ~22 — Remove stale reference
**Current text (approximate):**
```
- **opencode/commands/README.md** — Workflow reference table
```
**Action:** Remove this bullet point entirely, or if it's in a table, remove that row. The file does not exist and there is no plan to create it.

If the surrounding context needs a small adjustment to remain coherent after the removal (e.g., a count changes), make that adjustment too.

## Todolist
- [ ] Read docs/DOCUMENTATION_MAINTENANCE.md to find the exact line and surrounding context
- [ ] Remove or fix the stale opencode/commands/README.md reference
- [ ] Check if any count or summary nearby needs updating after the removal

## Delegation
**Agent:** @session-local-implementer  
**Reason:** Single targeted line removal in a documentation file.
