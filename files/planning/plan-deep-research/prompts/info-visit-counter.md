# INFO: Visit Counters for Research

If your research includes evidence-gathering loops, you must set `remaining_visits` on the synthesis/evaluation node.

## How remaining_visits Works

- **remaining_visits: N** — The researcher can loop back N times gathering evidence before the DAG asks: "Is research conclusive or should we investigate new angles?"
- **On failure:** The executing agent calls `reset_counters()` to prompt: "Evidence collection limit reached. Conclude research or refocus?"
- **Purpose:** Prevent endless research; force deliberate decisions about sufficiency

## Recommended Values

- **Focused research (1-2 angles):** `remaining_visits: 2` (limited iterations before synthesis)
- **Multi-angle research:** `remaining_visits: 3` (more room for evidence gathering across angles)
- **Deep exploratory research:** `remaining_visits: 4` (allow iterative discovery and refinement)

## When to Use

Set `remaining_visits` on the **synthesis/evaluation node** that gates the evidence-gathering loop exit. This node decides: "Do we have sufficient evidence or should we gather more?"

Call `next_step()` to continue.
