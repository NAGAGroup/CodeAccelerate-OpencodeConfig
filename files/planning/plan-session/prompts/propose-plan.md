# Propose Plan

## Your Role

Present the complete plan as prose, call the `question` tool for approval, then call `next_step()` with the correct branch node ID.

## Todo

1. `question` — Call the `question` tool with a single-sentence question: "Does this plan look right?" Use option label `"Approve — write the DAG"` (description: "Write plan.json and prompt files; activate separately with /activate-plan") and `"Rethink"` (description: "Adjust the plan before writing").

---

## Call the Question Tool First

Before presenting any content, dispatch the `question` tool immediately:

> **REQUIRED:** Call `question` with the exact options above. This is your first stated action in this node.

You MUST call the question tool — do not skip this step. Use these option labels exactly as written in your question call. After the user selects, route by calling next_step with the correct node ID (see routing below). The `when` field in plan.json is human-readable — routing is performed by your explicit next_step call, not by string matching.

## Sequential Thinking Guidelines

Each call to `sequential-thinking_sequentialthinking` MUST contain exactly one question or concept. Do NOT batch multiple questions into a single tool call. Do NOT output raw JSON thought content outside of tool calls. Set `thoughtNumber` and `totalThoughts` accurately on every call.

Minimal example of a single tool call:
```
sequential-thinking_sequentialthinking({
  thought: "One specific question or concept to reason through...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})
```

## What to Present

Write the full plan as prose in your response text (do NOT embed this inside the `question` call):

1. **Task** — One-sentence goal
2. **DAG structure** — ASCII diagram of the complete node tree, including branch paths and terminal nodes
3. **Node decomposition** — Table with columns: Node ID | Node type | Agent | Todo | What it does | Branch conditions (if any)

   The `Todo` column must contain the exact todo array for each node (e.g., `["task","task","task"]` for parallel scouts, `["question"]` for a decision gate). These exact values will be used when building the DAG.
4. **Estimated dispatches** — Count the number of `task` entries across all nodes' todo arrays (each `task` = one agent dispatch). Do NOT count `question`, `bash`, `validate_dag`, `sequential-thinking_sequentialthinking`, or `compress` entries — those are HW's own actions, not dispatches.

## Routing After User Selection

After the user selects an option:
- "Approve — write the DAG" → call `next_step({ next: "write-dag" })`
- "Rethink" → call `next_step({ next: "propose-plan-2" })`
- Any other answer → treat as "Rethink" and call `next_step({ next: "propose-plan-2" })`.
