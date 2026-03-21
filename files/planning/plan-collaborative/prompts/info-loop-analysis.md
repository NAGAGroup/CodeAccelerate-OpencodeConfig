# INFO: Dialogue Loops

If your collaboration includes loops (refinement feedback cycles), understand this:

## Loop Structure

Dialogue loops consist of **at least 2 nodes**. A loop cannot be a single node calling `next_step()` back to itself.

## Example Loop: Design-Feedback Cycle

```
step-2 (propose-design)
  ↓ (always)
step-3 (gather-feedback)
  ↓ (branches)
  ├─ "approved" → advance to step-4
  └─ "needs refinement" → loop back to step-2
```

The **feedback node (step-3)** has two `next` options:
- One option approves/accepts design (exit loop)
- One option requests refinement (loop back)

## Key Principle

**Every dialogue loop must have at least one user-facing node that decides: is the design ready, or does it need refinement?** This node's `remaining_visits` counter will cap feedback rounds. When exhausted, the project DAG asks: "Should we ship this version or pause for further work?"

Call `next_step()` to continue.
