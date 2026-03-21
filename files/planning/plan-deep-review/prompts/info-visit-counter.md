# INFO: Visit Counters

If your review project DAG has loops or iterations, you must set `remaining_visits` on the loop's branching nodes.

## How remaining_visits Works

- **remaining_visits: N** — The agent can loop back N times before the DAG enters "failed" state
- **On failure:** The executing agent calls `reset_counters()` to ask: "Should we continue?"
- **Purpose:** Prevent infinite loops; force deliberate decisions about continuing

## When to Use in Deep-Review

Review DAGs are typically linear (no loops), but if you've chosen a shape with iteration:
- **Multi-phase review with feedback loops:** `remaining_visits: 3` (reasonable number of refinement attempts)
- **Detailed analysis with re-evaluation:** `remaining_visits: 2-3` (you want to encourage moving forward)

## For Linear Reviews

If your deep-review DAG has no loops (most common), you don't need visit counters. All review nodes simply advance sequentially.

Call `next_step()` to continue.
