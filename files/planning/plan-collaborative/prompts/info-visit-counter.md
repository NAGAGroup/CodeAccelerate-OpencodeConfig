# INFO: Visit Counters for Refinement

If your collaboration includes feedback loops, you must set `remaining_visits` on the user gate node.

## How remaining_visits Works

- **remaining_visits: N** — The user can request refinement N times before the DAG asks: "Should we finalize this or take a break?"
- **On failure:** The executing agent calls `reset_counters()` to prompt: "Refinement limit reached. Finalize or pause?"
- **Purpose:** Prevent endless iteration; force deliberate decisions about shipping

## Recommended Values

- **Rapid design iterations:** `remaining_visits: 3` (quick feedback cycles)
- **Moderate design exploration:** `remaining_visits: 2` (limited rounds before deciding)
- **Deep design collaboration:** `remaining_visits: 4` (more room for refinement)

## When to Use

Set `remaining_visits` on the **user gate node** that gates the feedback loop exit. This node decides: "Is the design ready or does it need more work?"

Call `next_step()` to continue.
