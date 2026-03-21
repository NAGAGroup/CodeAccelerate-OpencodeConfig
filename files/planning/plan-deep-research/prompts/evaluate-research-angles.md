# Evaluate Research Angles

Your task is to **validate the proposed research angles**.

## Evaluation Questions

1. Is the primary angle central to the research question?
2. Are secondary angles truly distinct? (Not redundant)
3. Will exploring these angles answer the research question?
4. Can we gather evidence for each angle?
5. Does the evidence hierarchy reflect actual importance?
6. Is the investigation approach realistic?

## Decision

**If angles are solid:** Call `next_step()` to propose sources.

**If angles need refinement:** Call `next_step({ next: "propose-research-angles" })` to reconsider.
