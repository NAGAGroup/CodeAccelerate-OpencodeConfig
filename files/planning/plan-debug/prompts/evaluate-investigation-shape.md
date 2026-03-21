# Evaluate Investigation Shape

Your task is to **validate the investigation decomposition**.

## Evaluation Questions

1. Are diagnosis steps well-scoped? (Each is testable; each produces evidence)
2. Are hypothesis branches explicit? (Clear decision points)
3. Does the decomposition handle both likely and unlikely hypotheses?
4. Can each step be executed by an investigator independently?
5. Is the sequence logical? (Early steps produce inputs for later ones)
6. Are loops necessary or can we test hypotheses serially?

## Decision

**If shape is solid:** Call `next_step()` to propose test strategy.

**If shape needs refinement:** Call `next_step({ next: "propose-investigation-shape" })`.
