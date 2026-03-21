# INFO: Research Loops

If your research includes loops (evidence-gathering-synthesis cycles), understand this:

## Loop Structure

Research loops consist of **at least 2 nodes**. A loop cannot be a single node calling `next_step()` back to itself.

## Example Loop: Evidence Gathering Cycle

```
step-2 (collect-primary-sources)
  ↓ (always)
step-3 (synthesize-evidence)
  ↓ (branches)
  ├─ "sufficient evidence" → advance to step-4
  └─ "need more sources" → loop back to step-2
```

The **synthesis node (step-3)** has two `next` options:
- One option confirms evidence is sufficient (exit loop)
- One option requests additional evidence collection (loop back)

## Key Principle

**Every research loop must have at least one synthesis/evaluation node that decides: do we have enough evidence to answer the research question, or do we need more investigation?** This node's `remaining_visits` counter will cap evidence-gathering iterations. When exhausted, the project DAG asks: "Should we conclude with current evidence or extend research?"

Call `next_step()` to continue.
