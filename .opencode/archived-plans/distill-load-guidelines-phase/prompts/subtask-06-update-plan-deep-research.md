<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 06: Update plan-deep-research

## Objective

Apply the informational phase architecture to plan-deep-research, inserting the informational nodes before `review-gate`.

## Scope

**Read:**
- `files/planning/plan-deep-research/plan.json`
- `files/planning/plan-deep-research/prompts/`
- The informational phase design from Subtask 02

**Edit:**
- `files/planning/plan-deep-research/plan.json`

**Write:**
- New prompt files for informational nodes

## Constraints

- plan-deep-research has a research-centric flow with research-gate
- Informational phase should support the research loop: research-execute → accumulate → assess
- Include research-specific content: iteration planning, research gate decisions
- Maintain DAG invariants

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like

## Advance

Call `next_step()` when plan-deep-research is updated.
