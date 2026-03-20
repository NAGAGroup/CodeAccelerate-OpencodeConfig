# Subtask 01 — Delete Stale Artifacts

## Objective

Delete the `scripts/` directory and its two installation helper scripts (`install-global.sh`, `install-project.sh`). These scripts were written for the old architecture and are no longer relevant to the current repo structure. No replacements are needed.

## Scope

- DELETE: `scripts/install-global.sh`
- DELETE: `scripts/install-project.sh`
- DELETE: `scripts/` (directory)
- Excluded: all other files

## Constraints

- Do not modify any other files
- Do not add replacement scripts or stubs

## Todolist

- [ ] Confirm `scripts/` contains only the two expected files (no surprises)
- [ ] Delete `scripts/install-global.sh`
- [ ] Delete `scripts/install-project.sh`
- [ ] Remove the now-empty `scripts/` directory

## Delegation

**Agent:** HW (direct)  
**Reason:** Shell file deletion — HW owns all destructive filesystem operations.
