# Evaluate Collaboration Shape

Your task is to **validate the collaboration decomposition**.

## Evaluation Questions

1. Are design steps well-scoped? (Each is a clear turn with deliverables)
2. Are decision gates explicit? (User input is clear at each step)
3. Does the decomposition match the user's collaboration style?
4. Can each step be executed by a designer independently?
5. Are feedback loops necessary or can refinement be sequential?
6. Is the turn-taking realistic? (Not too many turns, not too few)

## Decision

**If shape is solid:** Call `next_step()` to identify output artifact.

**If shape needs refinement:** Call `next_step({ next: "propose-collaboration-shape" })`.
