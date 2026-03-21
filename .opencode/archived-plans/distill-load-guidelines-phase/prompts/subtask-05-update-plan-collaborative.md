<<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 05: Update plan-collaborative

## Objective

Apply the informational phase architecture to plan-collaborative, inserting the informational nodes before `review-gate`.

## Scope

**Read:**
- `files/planning/plan-collaborative/plan.json`
- `files/planning/plan-collaborative/prompts/`
- The informational phase design from Subtask 02

**Edit:**
- `files/planning/plan-collaborative/plan.json`

**Write:**
- New prompt files for informational nodes

## Constraints

- plan-collaborative is open-ended/exploratory — informational phase should be lighter touch here
- No automatic gate options for collaborative (user explicitly wants exploratory flow)
- Include collaborative-specific content: session design artifacts, living spec approach
- Maintain DAG invariants

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like

## Advance

Call `next_step()` when plan-collaborative is updated.
