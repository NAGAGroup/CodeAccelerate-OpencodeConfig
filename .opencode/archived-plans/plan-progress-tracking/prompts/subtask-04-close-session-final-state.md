<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04 — `close_session` Writes Final State

## Objective

Update `close_session` so that before deleting the dag-state file, it reads plan.json and writes a final progress update: the terminal node is marked `completed`, and `progress.completed_at` is set. This only applies to session plans.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts` — specifically the `close_session` tool handler
- **Excluded:** Interfaces, `activateDag`, `next_step`

## Constraints

- Only mutate plan.json for session plans. Guard with: `state.plan_path && state.plan_path.includes(".opencode/session-plans")`.
- `close_session` currently does not read the state file before deleting it — it only checks `fs.existsSync(statePath)`. To get the `plan_path`, you must `readState(statePath)` before calling `fs.unlinkSync`.
- Fields to write when closing a session plan:
  - `dag.nodes[state.current_node].status = "completed"` (the final node)
  - `dag.nodes[state.current_node].completed_at = now()`
  - `dag.progress.completed_at = now()`
  - `dag.progress.updated_at = now()`
- If `dag.progress` doesn't exist yet (edge case: plan was activated before this code shipped), skip the progress write rather than crashing.
- After writing plan.json, proceed with `fs.unlinkSync(statePath)` as before.
- Return message is unchanged: "DAG session closed. State file removed."

## Todolist

- [ ] Read the `close_session` handler to understand current shape
- [ ] Replace the `fs.existsSync` + `fs.unlinkSync` direct pattern with: read state first via `readState(statePath)`, then guard
- [ ] Add session-plan path check using `state.plan_path`
- [ ] If session plan: read dag via `readDag(state.plan_path)`, write final node status + `progress.completed_at`, write dag back
- [ ] Guard against missing `dag.progress` (skip write if not present)
- [ ] Then call `fs.unlinkSync(statePath)` as before
- [ ] Return unchanged message: "DAG session closed. State file removed."

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts` — the `close_session` tool handler (search for `close_session: tool(`)
- Goal: Before deleting the dag-state file, read state and plan.json, write final progress into plan.json for session plans
- Constraints: Must call `readState()` before `unlinkSync`; guard on `plan_path` containing `.opencode/session-plans`; guard on `dag.progress` existence; leave return message unchanged
- Verify: plan.json receives `completed_at` on the final node and on `progress`; dag-state file is still deleted

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
