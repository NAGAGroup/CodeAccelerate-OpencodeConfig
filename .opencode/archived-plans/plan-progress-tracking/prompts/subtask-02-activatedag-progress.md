<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — `activateDag` Writes Initial Progress

## Objective

Update `activateDag()` so that when a session plan (under `.opencode/session-plans/`) is activated, it writes an initial `progress` block into plan.json and marks the entry node as `in_progress`.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts` — specifically the `activateDag` function
- **Excluded:** Interfaces (done in subtask 01), handler functions (`next_step`, `close_session`)

## Constraints

- Only mutate plan.json when `planPath` is under `.opencode/session-plans/`. Built-in planning DAGs live in `~/.config/opencode/planning/` — skip them entirely. Use a simple `planPath.includes("session-plans")` or `planPath.includes(".opencode/session-plans")` check.
- The `progress` block to write:
  ```json
  {
    "current_node": "<entry node id>",
    "started_at": "<ISO timestamp>",
    "updated_at": "<ISO timestamp>"
  }
  ```
- The entry node's `DagNode` must have `status: "in_progress"` written into `dag.nodes[dag.entry]`
- After building the modified `dag` object, write it back with `fs.writeFileSync(planPath, JSON.stringify(dag, null, 2), "utf-8")`
- Use the existing `now()` helper for timestamps
- The dag-state file write is unchanged — do not modify that logic

## Todolist

- [ ] Read the `activateDag` function to understand its current shape
- [ ] Add a path check: `if (planPath.includes(".opencode/session-plans")) { ... }`
- [ ] Inside the guard, set `dag.progress = { current_node: dag.entry, started_at: now(), updated_at: now() }`
- [ ] Set `dag.nodes[dag.entry].status = "in_progress"`
- [ ] Write the modified `dag` back to `planPath` with `fs.writeFileSync`
- [ ] Confirm the dag-state write block below remains untouched

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts` — the `activateDag` function (locate it by searching for `function activateDag`)
- Goal: After reading the plan, write initial progress into plan.json if the plan is a session plan (path contains `.opencode/session-plans`)
- Constraints: Guard with path check; use `now()`; write dag back with `fs.writeFileSync(planPath, JSON.stringify(dag, null, 2), "utf-8")`; leave dag-state write unchanged
- Verify: The function writes a `progress` block and marks the entry node `in_progress` only for session plans

## Advance

Call `next_step()` when this subtask is complete.
