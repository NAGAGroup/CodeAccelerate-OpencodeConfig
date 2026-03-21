# Evaluate Sources & Evidence Paths

Your task is to **validate the proposed evidence strategy**.

## Evaluation Questions

1. Are the sources accessible? (Can we actually get to them?)
2. Are primary sources sufficient to answer the research question?
3. Is the evidence collection method appropriate?
4. Can we validate findings across sources?
5. Is the synthesis strategy realistic?
6. Are we avoiding circular reasoning or echo chambers?

## Decision

**If sources and strategy are solid:** Call `next_step()` to propose research shape.

**If sources need adjustment:** Call `next_step({ next: "propose-sources" })` to refine.
