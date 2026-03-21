<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 01 — Extend TypeScript Interfaces

## Objective

Add a `progress` block to `PlanDag` and optional `status`/`completed_at` fields to `DagNode`. These types will be used by subsequent subtasks to write progress into plan.json at runtime.

## Scope

- **Edit:** `opencode/plugins/planning-enforcement.ts` (type block, lines 6–33)
- **Excluded:** All other files; do not touch the `activateDag` or handler functions yet

## Constraints

- The `DagNode.status` field must be optional: `"pending" | "in_progress" | "completed"` — it is not present in authored plan.json files and is written only at runtime
- The `DagNode.completed_at` field must be optional: `string` (ISO timestamp)
- The `PlanDag.progress` block must be optional (plan.json files on disk won't have it initially):
  ```typescript
  progress?: {
    current_node: string
    started_at: string
    updated_at: string
    completed_at?: string
  }
  ```
- Do not add any new interfaces — extend only the existing `DagNode` and `PlanDag` interfaces
- Do not change any existing fields

## Todolist

- [ ] Open `opencode/plugins/planning-enforcement.ts` and read lines 6–33 to confirm current interface shape
- [ ] Add `status?: "pending" | "in_progress" | "completed"` to `DagNode`
- [ ] Add `completed_at?: string` to `DagNode`
- [ ] Add `progress?: { current_node: string; started_at: string; updated_at: string; completed_at?: string }` to `PlanDag`
- [ ] Verify no existing fields were removed or renamed

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts` lines 6–33
- Goal: Extend `DagNode` with optional `status` and `completed_at` fields; extend `PlanDag` with optional `progress` block
- Constraints: All new fields are optional. Do not modify any existing fields. Do not touch any functions.
- Verify: Both interfaces are extended; TypeScript compiles without errors on those type definitions

## Advance

Call `next_step()` when this subtask is complete.
