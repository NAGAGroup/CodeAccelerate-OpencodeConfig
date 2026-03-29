# Planning Gate

Present a clear summary of the proposed plan to the user for approval using the **`question`** tool.

## Todo

1. Write the full plan summary as prose in your response text — cover all items in the Summary format section below (task, DAG structure, subtasks, branch points, iteration depth, estimated dispatches). Do NOT embed any of this inside the `question` call.
2. `question` — Call the `question` tool with a single-sentence question: "Does this plan look right?" Use option label `"Approve — write the DAG"` (description: "Write plan.json and prompt files; activate separately with /activate-plan") and `"Rethink"` (description: "Adjust structure or decomposition before writing").

## Summary format

Include in your summary:

1. **Task** — One-sentence goal
2. **DAG structure** — Which primitives are composed (sequence, branch, iteration) and why
3. **Subtasks** — Numbered list with agent assignments
4. **Branch points** — What decisions exist and who makes them
5. **Iteration depth** — How many cycles are budgeted (if any)
6. **Estimated dispatches** — Total number of agent dispatches

> **Note:** The `when` conditions in plan.json for this branch node are matched against the user's selected option label. The labels `"Approve — write the DAG"` and `"Rethink"` are intentionally chosen to match the plan.json branch conditions — do not change them.

After the user responds, branching instructions will follow — proceed to DAG writing or restart decomposition as directed.
