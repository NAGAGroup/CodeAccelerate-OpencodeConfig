# Propose Plan

Present the complete plan to the user for approval. By this point, sequential thinking has produced a full plan — DAG structure plus node-by-node decomposition. Present it clearly, then ask for approval.

**You MUST call the question tool — do not skip this step.**

## What to present

Write the full plan as prose in your response text (do NOT embed this inside the `question` call):

1. **Task** — One-sentence goal
2. **DAG structure** — ASCII diagram of the complete node tree, including branch paths and terminal nodes
3. **Node decomposition** — Table with columns: Node ID | Node type | Agent | Todo | What it does | Branch conditions (if any)

   The `Todo` column must contain the exact todo array for each node (e.g., `["task","task","task"]` for parallel scouts, `["question"]` for a decision gate). These exact values will be written into `plan.json`.
4. **Estimated dispatches** — Total agent dispatches across all nodes

## Todo

1. `question` — Call the `question` tool with a single-sentence question: "Does this plan look right?" Use option label `"Approve — write the DAG"` (description: "Write plan.json and prompt files; activate separately with /activate-plan") and `"Rethink"` (description: "Adjust the plan before writing").

> **Note:** The `when` conditions in plan.json for this branch node are matched against the user's selected option label. The labels `"Approve — write the DAG"` and `"Rethink"` are intentionally chosen to match the plan.json branch conditions — do not change them.

After the user responds, branching instructions will follow — proceed to DAG writing or refine the plan as directed.
