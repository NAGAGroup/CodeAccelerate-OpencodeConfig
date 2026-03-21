# INFO: Visit Counters for Diagnosis

If your investigation includes diagnosis loops, you must set `remaining_visits` on the evaluation node.

## How remaining_visits Works

- **remaining_visits: N** — The investigator can loop back N times gathering evidence before the DAG asks: "Should we pursue a different hypothesis?"
- **On failure:** The executing agent calls `reset_counters()` to prompt: "Evidence inconclusive. Try different hypothesis or escalate?"
- **Purpose:** Prevent endless investigation; force deliberate decisions about continuing

## Recommended Values

- **Single hypothesis testing:** `remaining_visits: 3` (three attempts to gather confirming evidence)
- **Complex bugs with multiple hypotheses:** `remaining_visits: 2` (limit per hypothesis, then branch)
- **Intermittent bugs:** `remaining_visits: 4` (may need more evidence collection)

## When to Use

Set `remaining_visits` on the **evaluation node** that gates the diagnosis loop exit. This node decides: "Is the hypothesis confirmed or should we gather more evidence?"

Call `next_step()` to continue.
