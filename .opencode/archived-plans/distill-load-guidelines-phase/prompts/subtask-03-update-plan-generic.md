<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03: Update plan-generic

## Objective

Apply the informational phase architecture to plan-generic, inserting the informational nodes before `review-gate`.

## Scope

**Read:**
- `files/planning/plan-generic/plan.json`
- `files/planning/plan-generic/prompts/` (existing prompts)
- The informational phase design from Subtask 02

**Edit:**
- `files/planning/plan-generic/plan.json` — restructure the DAG to insert informational nodes before `review-gate`

**Write:**
- New prompt files under `files/planning/plan-generic/prompts/` for each new informational node

## Constraints

- Keep plan-generic's unique Q&A loop structure (clarify → assess → decompose)
- The informational phase must come after decompose but before review-gate
- Each informational node must have a single cognitive purpose
- Maintain DAG invariants: every loop has an exit, every path reaches a terminal node
- Prompts should be generic enough to apply across DAG types but clearly indicate "this is for plan-generic"

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-generic/plan.json`, informational phase design from Subtask 02 context
- Goal: Update plan.json to insert informational nodes before review-gate; write corresponding prompt files
- Constraints: Maintain existing Q&A loop; one cognitive thing per node; no breaking invariants

## Advance

Call `next_step()` when plan-generic is updated and all new prompt files are written.
