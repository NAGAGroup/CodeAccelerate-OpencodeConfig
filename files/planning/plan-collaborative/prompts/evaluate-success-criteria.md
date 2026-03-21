# Evaluate Success Criteria & Shape

Your task is to **validate the success criteria and collaboration approach**.

## Evaluation Questions

1. Are the success criteria measurable? (Can we confirm when the design meets them?)
2. Do they align with the user's design goal?
3. Is the collaboration shape appropriate? (Rapid for quick decisions, deep for exploratory work)
4. Will the DAG shape handle iteration and user feedback?
5. Can the artifact be produced within the proposed timeline?

## Decision

**If criteria and shape are solid:** Call `next_step()` to decompose collaboration steps.

**If needs refinement:** Call `next_step({ next: "propose-success-criteria" })` to reconsider.
