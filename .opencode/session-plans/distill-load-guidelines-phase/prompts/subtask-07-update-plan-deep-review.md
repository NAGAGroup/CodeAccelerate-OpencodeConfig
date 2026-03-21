<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 07: Update plan-deep-review

## Objective

Apply the informational phase architecture to plan-deep-review, inserting the informational nodes before `review-gate`.

## Scope

**Read:**
- `files/planning/plan-deep-review/plan.json`
- `files/planning/plan-deep-review/prompts/`
- The informational phase design from Subtask 02

**Edit:**
- `files/planning/plan-deep-review/plan.json`

**Write:**
- New prompt files for informational nodes

## Constraints

- plan-deep-review has review-centric flow
- Include review-specific informational content
- Maintain DAG invariants

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like

## Advance

Call `next_step()` when plan-deep-review is updated.
