# Evaluate Review Criteria

Your task is to **validate the proposed review criteria**.

## Evaluation Questions

1. Are the criteria measurable? (Can we assess against them?)
2. Do they cover all quality dimensions that matter?
3. Are quality standards realistic and appropriate?
4. Will the evaluation methods yield useful results?
5. Does the focus match the artifact's risk profile?
6. Is the scope achievable?

## Decision

**If criteria are solid:** Call `next_step()` to identify review scope.

**If criteria need refinement:** Call `next_step({ next: "propose-review-criteria" })` to reconsider.
