# Propose Plan

Call `question` to present the plan and ask for approval.

**Todo:** `["question"]`

> (1) Call the `question` tool with: "Does this plan look right?"
> (2) Option 1: "Approve — write the DAG" (writes plan.json and prompts; activate separately)
> (3) Option 2: "Rethink" (revise the plan before writing)
> (4) Present the plan as a bulleted summary: goal, phases, branch conditions, node count
> (5) Do not show raw JSON or code — prose only
> (6) Output constraint: return the user's choice

Route by node ID (not when-string): approval → `next_step({ next: "write-dag" })`; rethink → `next_step({ next: "propose-plan-2" })`.
