<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Refactor Plugin to Return Prompt Content

## Objective

The `planning-enforcement.ts` plugin currently injects node prompts via `client.session.prompt(...)` with `noReply: true` and `synthetic: true`. This makes the injected content invisible to DCP's `protectedTools` mechanism — DCP can't protect what it can't see as a tool output. The fix is to return the prompt text directly from the tool call result, removing the `client.session.prompt` injection entirely. This applies to `activateDag` (used by `activate_plan`, `plan_generic`, `plan_debug`, `plan_collaborative`) and `next_step`. The `close_session` tool has no prompt injection and doesn't need changing.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts`
- **Excluded:** All other files

## Constraints

- The `activateDag` function currently ends with `client.session.prompt(...)` followed by returning a status string. Change it to append the prompt content to the returned string instead of calling `client.session.prompt`. The `client` parameter and injection call should be removed from `activateDag`.
- `next_step` similarly calls `client.session.prompt(...)` near the end (lines 297–304). Replace that with appending the prompt text to the return string.
- The `plan_generic`, `plan_debug`, `plan_collaborative`, and `activate_plan` tools all call `activateDag` — they should all benefit automatically once `activateDag` is fixed.
- The `client` import/parameter in `activateDag` can be removed once the injection calls are gone. Check if `client` is still used anywhere else in the plugin before removing it.
- Do not change the DAG state logic, `remaining_visits` decrement logic, or any other behavior. Only the prompt delivery mechanism changes.
- The returned string format should be: the status message first, then a separator (e.g. `\n\n---\n\n`), then the full prompt text. This way the tool output is both human-readable and contains the full node instructions.

## Todolist

- [ ] Remove the `client` parameter from `activateDag` signature and its call sites
- [ ] In `activateDag`, replace `await client.session.prompt(...)` with appending prompt text to the return value
- [ ] In `next_step`, replace `await client.session.prompt(...)` with appending prompt text to the return value
- [ ] Remove `async` from `activateDag` if it's no longer needed (no more await calls inside it)
- [ ] Check if `client` is still used anywhere else in the plugin; if not, remove it from the plugin context destructuring
- [ ] Verify the file compiles: run `npx tsc --noEmit` from the repo root (or wherever the tsconfig is)

## Delegation

**Agent:** HW (direct)
**Reason:** TypeScript plugin refactor requiring understanding of the injection vs. return distinction, plus shell access to verify the build compiles.

## Advance

Call `next_step()` when this subtask is complete.
