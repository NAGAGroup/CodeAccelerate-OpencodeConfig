# INFO: Diagnosis Loops

If your investigation includes loops (diagnosis-test-refine cycles), understand this:

## Loop Structure

Diagnosis loops consist of **at least 2 nodes**. A loop cannot be a single node calling `next_step()` back to itself.

## Example Loop: Hypothesis Refinement

```
step-2 (gather-evidence)
  ↓ (always)
step-3 (evaluate-evidence)
  ↓ (branches)
  ├─ "hypothesis confirmed" → advance to step-4
  └─ "inconclusive / need more data" → loop back to step-2
```

The **evaluation node (step-3)** has two `next` options:
- One option confirms/falsifies hypothesis (exit loop)
- One option requests additional evidence (loop back)

## Key Principle

**Every diagnosis loop must have at least one evaluation node that decides: does the evidence confirm the hypothesis, or do we need more investigation?** This node's `remaining_visits` counter will cap diagnosis attempts. When exhausted, the project DAG asks: "Should we try a different hypothesis?"

Call `next_step()` to continue.
