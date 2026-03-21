# INFO: Loop Patterns

If your chosen DAG shape includes loops (1B, 1E, 1F), understand this:

## Loop Structure

Loops in DAGs consist of **at least 2 nodes**. A loop **cannot** be a single node calling `next_step()` back to itself — this would bypass the `remaining_visits` counter that prevents infinite iteration.

## Example Loop: Implementation-Test Cycle

```
step-2 (implement) 
  ↓ (always)
step-3 (test)
  ↓ (branches)
  ├─ "tests pass" → advance to step-4
  └─ "tests fail" → loop back to step-2
```

The **branching node (step-3)** has two `next` options:
- One option loops back to an earlier node (cycle)
- One option advances out of the loop (exit)

## Key Principle

**Every loop in your project DAG must have at least one branching node that allows exiting the loop.** This node's `remaining_visits` counter will cap iterations. When exhausted, the project DAG surfaces the loop to the user: "Should we continue refining or ship?"

Call `next_step()` to continue.
