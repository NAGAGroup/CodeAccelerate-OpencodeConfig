<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — Delete stale install scripts

## Objective

The `scripts/` directory contains two stale install scripts (`install-project.sh` and `install-global.sh`) that are no longer referenced anywhere in the docs and don't reflect the current setup approach. Delete both files. If `scripts/` is empty after deletion, remove the directory too.

## Scope

- **Delete:** `scripts/install-project.sh`
- **Delete:** `scripts/install-global.sh`
- **Delete (if empty):** `scripts/`

## Constraints

- HW handles this directly via shell (`rm`)
- Verify both files exist before deleting
- Check if any other files remain in `scripts/` after deletion; if the directory is empty, remove it

## Todolist

- [ ] Confirm `scripts/install-project.sh` and `scripts/install-global.sh` exist
- [ ] Delete both files
- [ ] Check if `scripts/` is now empty; if so, remove the directory
- [ ] Verify no docs reference these scripts (quick grep)

## Delegation

**Agent:** HW (direct) | Shell deletion — HW handles all filesystem/shell operations.

## Advance

Call `next_step()` when this subtask is complete.
