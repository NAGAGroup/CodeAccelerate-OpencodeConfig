# Planning Gate

Present a clear summary of the proposed plan to the user for approval using the **`question`** tool.

## Todo

1. `question` — Present the full plan summary (task, DAG structure, subtasks with agents, branch points, iteration depth, estimated dispatches) and ask the user to approve or request rethinking.

## Summary format

Include in your question:

1. **Task** — One-sentence goal
2. **DAG structure** — Which primitives are composed (sequence, branch, iteration) and why
3. **Subtasks** — Numbered list with agent assignments
4. **Branch points** — What decisions exist and who makes them
5. **Iteration depth** — How many cycles are budgeted (if any)
6. **Estimated dispatches** — Total number of agent dispatches

Offer options like "Approach is sound — proceed" and "Need to rethink".

You MUST call the `question` tool — do not present the summary as plain text.
