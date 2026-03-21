<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Bump Registry Version to 2.1.0

## Objective

Update the `"version"` field in `registry.jsonc` from `"2.0.0"` to `"2.1.0"`.

## Scope

- **Edit:** `registry.jsonc`
- **Excluded:** all other files

## Constraints

- Change only the `"version"` field at the top level — do not touch any other fields
- Preserve all whitespace, comments, and formatting in the file
- The new value must be exactly `"2.1.0"`

## Todolist

1. Read `registry.jsonc` to confirm the current version field location and value
2. Edit the `"version"` field from `"2.0.0"` to `"2.1.0"`

## Delegation

**Agent:** @JuniorDev (haiku)
**Prompt structure:**
- Read: `registry.jsonc`
- Goal: Change `"version": "2.0.0"` → `"version": "2.1.0"` — single field, nothing else
- Constraints: Do not change any other fields; preserve all formatting and comments
- Verify: The file contains `"version": "2.1.0"` after the edit

## Advance

Call `next_step()` when this subtask is complete.
