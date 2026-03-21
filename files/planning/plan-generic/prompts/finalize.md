# Finalize Planning DAG (Phase 1: Design Plan)

Your task is to **design the project DAG structure** that will be presented to the user for approval.

## What You Have

From planning:
- Task goal and acceptance criteria
- Chosen DAG shape (1A-1F) with design decisions
- Decomposition: subtasks with boundaries and dependencies
- Agent routing: assignments and model tiers
- Loop/gate details (if shape includes them)

## Phase 1: Design Plan (This Step)

Draft the **plan.json structure** (DAG shape, nodes, branching, loops):

- **Nodes:** Match your chosen shape (1A-1F)
- **Node names:** Use subtask names from decomposition
- **Node types:** "agent" for execution nodes, "gate" for decision points
- **`next` field:** Single string for linear; object with branches for loops/gates
  - **String format:** `"next": "node-id"` (single path)
  - **Object format (branching):** `"next": { "node-1": { "desc": "...", "choose_when": "..." }, ... }`
  - **CONSTRAINT:** Keys in object-format `next` MUST be actual node IDs. Do NOT use generic labels like "pass", "fail", "yes", "no" as keys.
- **`remaining_visits`:** Set on loop-branching nodes (evaluation/decision nodes in loops)
- **`prompt`:** Placeholder paths (e.g., "planning/plan-generic/prompts/{subtask}.md")
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

### Example: Correct Branching with Object-Format `next`

```json
{
  "id": "evaluate-approach",
  "type": "gate",
  "prompt": "planning/plan-generic/prompts/evaluate-approach.md",
  "next": {
    "implement-solution": {
      "desc": "Approach is sound; proceed to implementation",
      "choose_when": "Analysis shows the approach addresses all requirements"
    },
    "explore-alternatives": {
      "desc": "Approach has gaps; explore other directions",
      "choose_when": "Analysis reveals the approach doesn't address all requirements"
    }
  }
}
```

**Keys are actual node IDs:** `"implement-solution"` and `"explore-alternatives"` are real nodes. **NOT** generic labels like `"pass"` or `"fail"`.

## Output

Present the draft plan.json structure (as JSON or ASCII representation) to be shown in Phase 2.

Call `next_step()` to advance to preview-gate.
