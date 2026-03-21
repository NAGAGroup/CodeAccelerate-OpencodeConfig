<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask: Add Archive Instruction to close_session

## Objective
Modify the `close_session` tool in `opencode/plugins/planning-enforcement.ts` to return a natural language instruction directing the calling agent to archive the session plan and commit as a chore.

## Scope

**File to edit:** `opencode/plugins/planning-enforcement.ts`

**Edit target:** The `close_session` tool's `execute` function, specifically the return statement (currently line 378).

## Constraints

1. Extract the session name from `state.plan_path` (which is `/.opencode/session-plans/{session-name}/plan.json`)
2. The return message must be **natural language** — do NOT include shell commands
3. The instruction should tell the agent to:
   - Archive the session plan (mv from `.opencode/session-plans/{name}` to `.opencode/archived-plans/{name}`)
   - Commit as a chore
4. Preserve all existing behavior (write final progress, remove state file)
5. Handle the case where `state.plan_path` may not contain session-plans (fall back to the original message format)

## Implementation

In the `close_session` execute function, after writing final progress and before returning, determine if this is a session plan. If so, extract the session name and include the archive instruction.

```typescript
// After fs.unlinkSync(statePath)
if (state?.plan_path?.includes(".opencode/session-plans")) {
  const sessionName = state.plan_path.split(".opencode/session-plans/")[1]?.split("/")[0]
  if (sessionName) {
    return `DAG session closed. State file removed.\n\nTo complete archival: move the session plan "${sessionName}" from .opencode/session-plans/ to .opencode/archived-plans/ and commit the change as a chore.`
  }
}
return "DAG session closed. State file removed."
```

## Verify
1. TypeScript compiles without errors
2. The logic correctly extracts session name from paths like:
   - `/worktree/.opencode/session-plans/my-feature/plan.json` → `my-feature`
   - Handles paths that don't match (returns original message)

## Delegation

**Agent:** HW (direct)
**Model:** sonnet
**Rationale:** Well-defined TypeScript edit; HW has full planning context; no shell/testing needed.

## Advance
Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
