# Info: Visit Counter Recommendations — {{DAG_TYPE}}

Review the loops identified and recommend `remaining_visits` counts for each decision node.

## The Rule

`remaining_visits` goes on the **decision node** — the node that chooses to loop back or exit. Each `next_step()` call on that node decrements the counter by 1. When it hits 0, the DAG enters `failed` state.

**Default: 3.** Adjust up for complex loops, down for simple ones.

## Your Task

For each loop identified in the previous step:

1. **Decision node name**: e.g., "assess"
2. **Proposed `remaining_visits`**: A number (default 3)
3. **Rationale**: 1 sentence on why this count

## Example Table

| Decision Node | Recommended Visits | Rationale |
|---------------|-------------------|-----------|
| assess | 3 | Q&A may need 2-3 clarifying exchanges |
| verify | 5 | Build/test cycles can be iterative |

## When to Adjust

- **Increase (4-5)** if the loop involves external factors (user input, builds, research iterations)
- **Keep at 3** for simple decision cycles
- **Decrease (2)** only if the loop is very simple and unlikely to repeat

## Constraints

- Do not modify plan.json — record recommendations only
- If no loops exist, note that and advance

## Advance

Call `next_step()` to proceed to gate analysis.
