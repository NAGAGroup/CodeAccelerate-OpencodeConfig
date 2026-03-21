# INFO: Visit Counters

If your chosen shape has loops, you must set `remaining_visits` on the loop's branching node.

## How remaining_visits Works

- **remaining_visits: N** — The agent can loop back N times before the DAG enters "failed" state
- **On failure:** The executing agent calls `reset_counters()` to ask: "Should we continue?"
- **Purpose:** Prevent infinite loops; force deliberate decisions about continuing

## Recommended Values

- **Build-test cycles:** `remaining_visits: 5` (reasonable number of attempts before shipping)
- **Refinement feedback loops:** `remaining_visits: 3` (fewer iterations; refinement is subjective)
- **Investigation loops (debug):** `remaining_visits: 4` (hypothesis testing needs some attempts)

## When to Use

Set `remaining_visits` on the **branching node** that gates the loop exit. For Shape 1B (linear with loop), that's the "verify" node.

Call `next_step()` to continue.
