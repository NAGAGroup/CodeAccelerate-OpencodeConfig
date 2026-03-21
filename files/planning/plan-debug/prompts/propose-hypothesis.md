# Propose Investigation Shape & Hypothesis

Your task is to **propose the investigation approach and primary hypothesis**.

## What to Do

Based on your understanding of the bug, propose:
1. **Primary Hypothesis** — What is the most likely root cause? Why?
2. **Alternative Hypotheses** — What else could explain the symptoms? (2-3 alternatives)
3. **Investigation Approach** — Should we test hypotheses in sequence (serial) or explore multiple paths (parallel)?
4. **Diagnosis Shape** — Will this need iteration loops (test-refine cycles) or linear hypothesis testing?

## Output

- Primary hypothesis (clear statement)
- Alternative hypotheses (bullet list)
- Investigation approach (serial or parallel exploration)
- Proposed shape (1A-linear, 1B-with-loops, or 1D-branching)

Call `next_step()` to evaluate.
