<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 07: Build and Verify Registry

## Objective

Run `bun run build` to rebuild the OCX registry dist output after all prompt file edits in ST01–ST06. Verify the build completes without errors and that the modified planning files appear correctly in the built output.

## Scope

- **Run:** `bun run build` in the workspace root
- **Read:** `dist/` output to verify presence of modified files
- **No file edits**

## Constraints

- Do not proceed to close_session() if the build fails — surface the error to the user
- Only run the standard build command (`bun run build`) — do not run deploy or other commands
- Do not attempt to fix build errors in this node — surface them and stop

## Todolist

- [ ] Confirm all ST01–ST06 subtasks are complete before running the build
- [ ] Run `bun run build` in the workspace root
- [ ] Check build output for errors
- [ ] Verify `dist/` contains updated planning file content (spot-check one or two of the modified files)
- [ ] If build succeeds: report success and call `next_step()` — the DAG will detect this is the terminal node and prompt for `close_session()`
- [ ] If build fails: surface the error output to the user and stop — do NOT attempt to fix it

## Delegation

**Agent:** HW (direct)
**Reason:** Requires running `bun run build` and analyzing command output to confirm success

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
