<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 05 — Update Guidelines Documentation

## Objective

Document the new `progress` block and per-node `status`/`completed_at` fields in the canonical plan design guidelines reference. These are runtime-written fields — plan authors don't write them, but they appear in plan.json during and after session execution.

## Scope

- **Edit:** `opencode/planning/plan-design-guidelines.md`
- **Excluded:** All TypeScript files, all other markdown files

## Constraints

- Clearly mark the new fields as **runtime-written** (not authored). Authors should not include them in their plan.json files.
- Place the `progress` block documentation after the top-level field table.
- Place the per-node `status`/`completed_at` documentation after the node field table.
- Do not alter the existing field definitions — only add new sections.
- Keep the tone consistent with the existing doc (terse, table-driven where appropriate).

## Todolist

- [ ] Read `opencode/planning/plan-design-guidelines.md` fully to understand current structure
- [ ] Add a "Runtime Fields" subsection after the top-level field table documenting `progress`:
  - `progress.current_node` — string, currently executing node ID
  - `progress.started_at` — ISO timestamp, set when plan is activated
  - `progress.updated_at` — ISO timestamp, updated on each node transition
  - `progress.completed_at` — ISO timestamp (optional), set when `close_session()` is called
- [ ] Add per-node runtime fields after the node field table:
  - `status` — `"pending" | "in_progress" | "completed"` (optional, runtime only)
  - `completed_at` — ISO timestamp (optional, runtime only)
- [ ] Add a note that all runtime fields are written by the plugin and should not be authored manually

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-design-guidelines.md`
- Goal: Add "Runtime Fields" sections documenting `progress` (top-level) and `status`/`completed_at` (per-node) as plugin-written fields
- Constraints: Runtime fields must be clearly labeled as such; do not modify existing field definitions; match existing doc style
- Verify: New sections appear after their respective field tables; no existing content is removed or reworded

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
