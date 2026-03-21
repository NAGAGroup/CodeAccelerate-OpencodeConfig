<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02: Update plan-generic/prompts/finalize.md — Terminal Node Constraint

## Objective

Add a constraint to `planning/plan-generic/prompts/finalize.md` instructing the planning agent that the **final node of the session plan it generates must NOT include a `next` field**. Executing agents rely on the absence of `next` to know they must call `close_session()`. If a generated plan's last node has `next`, the session cannot close.

## Scope

**File:** `planning/plan-generic/prompts/finalize.md`

Read the file before editing. Locate the section where the agent is instructed to write `plan.json` (the execution DAG). Add a clearly visible constraint in that section — or in a dedicated `## Critical Constraints` block near the top of the write-plan instructions — stating:

> The final node in the generated `plan.json` MUST NOT have a `next` field. Omit it entirely. If `next` is present on the terminal node, executing agents cannot call `close_session()` and the session will be stuck.

The constraint should be impossible to miss. Use bold or a `> blockquote` callout. Do not bury it in a list of minor points.

## Constraints

- You MUST NOT change the Advance section of finalize.md (it already correctly uses `close_session()`)
- You MUST NOT restructure the file — add the constraint inline within the existing plan-writing instructions
- Match existing doc style and formatting

## Todolist

- [ ] Read `planning/plan-generic/prompts/finalize.md`
- [ ] Locate the plan.json writing instructions
- [ ] Insert the terminal node constraint in a clearly visible position
- [ ] Verify the Advance section still reads "Call `close_session()` exactly once"

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `planning/plan-generic/prompts/finalize.md`
- Goal: Add a clearly visible constraint that the generated plan's terminal node must omit `next`
- Constraints: Additive only; do not touch Advance section; match doc style
- Verify: Constraint is present and prominent; Advance section unchanged

## Advance

Call `next_step()` when this subtask is complete. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
