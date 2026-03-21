<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Implement compaction hook in `planning-enforcement.ts`

## Objective

Add an `experimental.session.compacting` hook handler to `PlanningEnforcementPlugin` in `opencode/plugins/planning-enforcement.ts`. When OpenCode's auto-compaction fires, the hook reads the active dag-state file for the current session, resolves the current node's prompt text from `plan.json`, and injects it into `output.context` with a clear re-alignment prefix. If no active DAG session exists, the hook is a no-op.

This ensures the compaction LLM preserves the current task node's instructions in its lossy summary, so HW surfaces from compaction with enough context to know what it was doing and how to proceed.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts`
- **Read-only reference:** No other files need modification in this subtask

## Constraints

- Use the existing `readState`, `readDag`, `readPrompt`, `dagStatePath`, `expandPath` helpers — do not introduce new imports or dependencies
- The `context` field is `string[]` — push a single well-formatted string entry
- The injected string must begin with a clear re-alignment header, e.g.:
  ```
  [ACTIVE TASK NODE — HeadWrench re-alignment after context compaction]
  
  The following prompt describes your current active task. Read it carefully and continue from where you left off. When the task is complete, call next_step() to advance the DAG.
  
  ---
  
  <node prompt text here>
  ```
- If `readState` returns `null` (no active session), return the output unchanged — do not throw
- If the dag-state file or plan.json cannot be read, catch the error and return output unchanged (silent fail — compaction must not be disrupted by hook errors)
- The hook takes `input: { sessionID: string }` and `output: { context: string[], prompt: string | undefined }` — mutate `output.context` in place by pushing the injected string
- The hook must be registered inside `PlanningEnforcementPlugin` return value under the key `experimental.session.compacting` (or whatever the `hook` property is called in the `@opencode-ai/plugin` API — inspect the existing plugin structure to confirm the correct registration pattern)

## Todolist

1. Read `opencode/plugins/planning-enforcement.ts` fully to understand the current `Plugin` return shape and confirm how hooks (vs tools) are registered
2. Check `@opencode-ai/plugin` types for `experimental.session.compacting` hook signature — look at the plugin SDK types in `node_modules/@opencode-ai/plugin`
3. Implement the hook handler function — read dag-state, resolve prompt, build injected string
4. Register the hook in `PlanningEnforcementPlugin`'s return value
5. Verify: the hook silently no-ops when no dag-state file exists for the session

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts` (full file), `opencode/node_modules/@opencode-ai/plugin/` (types for hook registration)
- Goal: Add `experimental.session.compacting` hook to `PlanningEnforcementPlugin` per the objective above
- Constraints: Use only existing helpers; silent-fail on any fs errors; no-op if no active session
- Verify: Hook is registered in the plugin return value and injects the current node prompt into `output.context`

## Advance

Call `next_step()` when this subtask is complete.
