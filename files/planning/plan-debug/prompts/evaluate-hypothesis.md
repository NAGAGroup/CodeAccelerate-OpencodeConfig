# Evaluate Hypothesis & Approach

Your task is to **validate the proposed hypothesis and investigation approach**.

## Evaluation Questions

1. Is the primary hypothesis testable? (Can we gather evidence?)
2. Are alternative hypotheses truly different paths? (Not redundant)
3. Will the investigation shape handle this hypothesis testing?
4. Can we design diagnosis steps that either confirm or falsify each hypothesis?
5. Does the approach match the bug's severity and reproduction complexity?

## Decision

**If hypothesis approach is solid:** Call `next_step()` to decompose diagnosis steps.

**If hypothesis needs refinement:** Call `next_step({ next: "propose-hypothesis" })` to reconsider.
