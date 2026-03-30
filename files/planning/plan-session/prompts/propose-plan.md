# Propose Plan

Present the complete plan to the user for approval. By this point, sequential thinking has produced a full plan — DAG structure plus node-by-node decomposition. Present it clearly, then ask for approval.

**You MUST call the question tool — do not skip this step.**

**IMPORTANT:** The option labels `'Approve — write the DAG'` and `'Rethink'` must be used exactly as written — the DAG branches on these exact strings.

## What to present

Write the full plan as prose in your response text (do NOT embed this inside the `question` call):

1. **Task** — One-sentence goal
2. **DAG structure** — ASCII diagram of the complete node tree, including branch paths and terminal nodes
3. **Node decomposition** — Table with columns: Node ID | Node type | Agent | Todo | What it does | Branch conditions (if any)

   The `Todo` column must contain the exact todo array for each node (e.g., `["task","task","task"]` for parallel scouts, `["question"]` for a decision gate). These exact values will be written into `plan.json`.
4. **Estimated dispatches** — Estimated dispatches — count the number of `task` todo items across all nodes in the DAG (each `task` entry in a node's todo array = one agent dispatch).

## Todo

1. `question` — Call the `question` tool with a single-sentence question: "Does this plan look right?" Use option label `"Approve — write the DAG"` (description: "Write plan.json and prompt files; activate separately with /activate-plan") and `"Rethink"` (description: "Adjust the plan before writing").

   If the user selects 'Rethink,' call `next_step()` — the session will advance to a revision cycle. In the revision node, the user will be asked what to change before the plan is re-presented. Do not repeat the same plan unchanged.

After the user selects an option, call `next_step()` to advance to the appropriate branch.
