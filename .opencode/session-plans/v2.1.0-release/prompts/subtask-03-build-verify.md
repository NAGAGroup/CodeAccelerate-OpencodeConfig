<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — Build and Verify

## Objective

Run the build and confirm that the output reflects the new `2.1.0` version. This is the final verification gate before the session is complete.

## Scope

- **Shell only** — no file edits
- Read `dist/index.json` after build to confirm version field

## Constraints

- Run only `bun run build` — do not run deploy
- If the build fails, surface the error output to the user and do NOT call `close_session()` — stop and wait for direction
- If the build succeeds, confirm `dist/index.json` contains `"version": "2.1.0"` before completing

## Todolist

1. Run `bun run build`
2. If build fails: surface error output and stop — do not proceed
3. If build succeeds: read `dist/index.json` and confirm `"version": "2.1.0"` is present
4. Report build success and version confirmation to the user

## Delegation

**Agent:** HW (direct)
**Reason:** Requires running shell commands and analyzing output.

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
