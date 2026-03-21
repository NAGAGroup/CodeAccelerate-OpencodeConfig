# Evaluate Research Shape

Your task is to **validate the research decomposition**.

## Evaluation Questions

1. Are research steps well-scoped? (Each is a clear research phase)
2. Do all research angles get covered?
3. Are dependencies explicit? (Evidence flows clearly)
4. Can each step be executed by a researcher independently?
5. Are loops necessary or can we research angles sequentially?
6. Is the synthesis realistic? (Can findings be integrated?)

## Decision

**If shape is solid:** Call `next_step()` to identify success criteria.

**If shape needs refinement:** Call `next_step({ next: "propose-research-shape" })`.
