# Info: Loop Analysis — {{DAG_TYPE}}

Identify all loop patterns in this {{DAG_TYPE}} session plan and summarize each one.

## Your Task

Review the session plan you've been building. Identify every cycle in the DAG where execution could repeat:

- Look for `next` fields that point backward to prior nodes
- Each back-edge is one loop
- Name the loop by its decision node (the node that chooses to continue or exit)

## For Each Loop, Provide

1. **Loop name**: e.g., "the clarify loop"
2. **Decision node**: The node that decides to loop back or exit
3. **Purpose**: 1-2 sentences on why this loop exists
4. **Exit condition**: When does the loop terminate?

## Example

```
Loop: the Q&A loop
Decision node: assess
Purpose: Gathers clarifying context iteratively until enough is known
Exit condition: assess decides "enough context gathered" → advances to synthesize
```

## Constraints

- Do not modify the plan.json — this is analysis only
- Keep summaries brief (1-2 sentences each)

## Advance

Call `next_step()` when all loops are identified and summarized.
