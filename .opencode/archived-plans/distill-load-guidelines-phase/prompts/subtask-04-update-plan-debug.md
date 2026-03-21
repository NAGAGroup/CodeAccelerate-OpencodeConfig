<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04: Update plan-debug

## Objective

Apply the informational phase architecture to plan-debug, inserting the informational nodes before `review-gate`.

## Scope

**Read:**
- `files/planning/plan-debug/plan.json`
- `files/planning/plan-debug/prompts/` (existing prompts)
- The informational phase design from Subtask 02

**Edit:**
- `files/planning/plan-debug/plan.json`

**Write:**
- New prompt files for informational nodes

## Constraints

- plan-debug has a unique flow: bug-intake → scout → hypothesis-form → confirm-mode → agent-routing → review-gate → finalize
- The informational phase should come after agent-routing but before review-gate (or after confirm-mode if that fits better)
- Include debug-specific informational content (e.g., hypothesis confidence checks)
- Maintain DAG invariants

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like

## Advance

Call `next_step()` when plan-debug is updated.
