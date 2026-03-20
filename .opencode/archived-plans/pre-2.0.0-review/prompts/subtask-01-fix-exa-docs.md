<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Fix exa docs example

## Objective

The `docs/configuration.md` file contains a code example showing the exa MCP server with `"enabled": false`. The actual `opencode/opencode.json` has `"enabled": true`. The documented example is misleading — update it to show `"enabled": true` to match the real default and the intended behavior (exa is enabled by default; users without an `EXA_API_KEY` should disable it explicitly).

## Scope

- **Edit:** `docs/configuration.md`

## Constraints

- Change only the `"enabled": false` → `"enabled": true` in the exa JSON example block
- Do not alter surrounding prose, table content, or any other part of the file
- The explanatory text below the table that says "If you don't have an `EXA_API_KEY`, disable it to avoid errors on startup" should remain — it's still accurate advice

## Todolist

- [ ] Read `docs/configuration.md` to locate the exa example block
- [ ] Change `"enabled": false` to `"enabled": true` in the exa example
- [ ] Verify no other instances of the incorrect value remain in the file

## Delegation

**Agent:** @QuickDoc | **Tier:** haiku | Single-file doc edit with a one-line targeted change.

## Advance

Call `next_step()` when this subtask is complete.
