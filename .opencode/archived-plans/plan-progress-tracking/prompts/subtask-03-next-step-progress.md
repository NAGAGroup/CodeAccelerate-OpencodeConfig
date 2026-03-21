<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — `next_step` Updates Progress

## Objective

Update the `next_step` handler so that when it advances a session plan's DAG, it also updates the `progress` block and per-node status fields in plan.json. The departing node is marked `completed` with a `completed_at` timestamp; the arriving node is marked `in_progress`; `progress.current_node` and `progress.updated_at` are refreshed.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts` — specifically the `next_step` tool handler
- **Excluded:** Interfaces, `activateDag`, `close_session`

## Constraints

- Only mutate plan.json for session plans. Use the same guard as subtask 02: `state.plan_path.includes(".opencode/session-plans")`.
- The progress update must happen **after** the next-node is resolved and **before** (or as part of) the existing `fs.writeFileSync` that already writes `remaining_visits` back. If `remaining_visits` was decremented, the same write covers both. If not, a new write is needed.
- Fields to update:
  - `dag.nodes[state.current_node].status = "completed"` (the departing node)
  - `dag.nodes[state.current_node].completed_at = now()`
  - `dag.nodes[nextNodeId].status = "in_progress"` (the arriving node)
  - `dag.progress.current_node = nextNodeId`
  - `dag.progress.updated_at = now()`
- These mutations happen on the already-loaded `dag` object (which was read earlier in the handler). A single `fs.writeFileSync(state.plan_path, JSON.stringify(dag, null, 2), "utf-8")` at the end covers all mutations.
- Do not duplicate the write — consolidate with the existing `remaining_visits` write if both apply.
- Do not change the dag-state write logic (`writeState`).
- Handle the terminal-node case too: when `close_session()` will be called next, the departing node should still be marked `completed`.

## Todolist

- [ ] Read the `next_step` handler fully to understand the existing flow
- [ ] Identify where `remaining_visits` is decremented and where `dag` is written back
- [ ] Add the session-plan path guard: `if (state.plan_path.includes(".opencode/session-plans")) { ... }`
- [ ] Inside the guard (after resolving `nextNodeId`): mark departing node `completed` + `completed_at`, mark next node `in_progress`, update `dag.progress`
- [ ] Ensure a single consolidated `fs.writeFileSync` covers all dag mutations (remaining_visits + progress)
- [ ] Handle the terminal-node early-return path: mark departing node `completed` in that branch too
- [ ] Confirm `writeState` calls are unchanged

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts` — the full `next_step` tool handler (search for `next_step: tool(`)
- Goal: After resolving the next node, write progress updates into plan.json for session plans only
- Constraints: Path guard required; consolidate writes; handle terminal-node branch; leave `writeState` calls untouched
- Verify: Progress block and node statuses are updated on every non-terminal and terminal `next_step` call for session plans

## Advance

Call `next_step()` when this subtask is complete.
