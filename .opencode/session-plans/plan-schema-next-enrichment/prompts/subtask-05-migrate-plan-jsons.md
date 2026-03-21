<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

## Objective

Migrate all existing planning DAG files under `opencode/planning/` to the new `next` field object format. Each `next` array of strings must become an object where keys are the node IDs and values contain `desc` and `choose_when` fields.

## Scope

- **Edit:** All `plan.json` files under `opencode/planning/`:
  - `opencode/planning/plan-generic/plan.json`
  - `opencode/planning/plan-debug/plan.json`
  - `opencode/planning/plan-collaborative/plan.json`
  - `opencode/planning/plan-deep-research/plan.json`
  - `opencode/planning/plan-deep-review/plan.json`
- **Excluded:** Archived plans, session plans

## Constraints

- For each `next` array entry, infer `desc` from the target node's purpose (read the node's prompt file for context) and write a brief 1-2 sentence `desc`
- `choose_when` should be 1-2 sentences explaining when an agent should choose that branch
- Terminal nodes (no `next`) remain unchanged
- String `next` values (linear paths) remain as-is (no object wrapper needed)
- Preserve all other fields: `id`, `type`, `prompt`, `remaining_visits`, `status`, etc.

## Todolist

- [ ] Read all 5 plan.json files
- [ ] Read target node prompt files to understand each branch's purpose
- [ ] Migrate plan-generic/plan.json `next` arrays to object format
- [ ] Migrate plan-debug/plan.json `next` arrays to object format
- [ ] Migrate plan-collaborative/plan.json `next` arrays to object format
- [ ] Migrate plan-deep-research/plan.json `next` arrays to object format
- [ ] Migrate plan-deep-review/plan.json `next` arrays to object format

## Delegation

**Agent:** @JuniorDev (parallel × 5, one per plan)
**Model:** haiku-like
**Prompt structure:**
- Read: The target `plan.json` and its referenced prompt files for each node in `next` arrays
- Goal: Convert each `next` array to `{"node-id": {"desc": "...", "choose_when": "..."}}` format. Write descriptive `desc` and `choose_when` for each branch.
- Constraints: Preserve all other fields; terminal nodes unchanged; string `next` unchanged
- Verify: All `next` arrays converted to objects; plan.json is valid JSON

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
