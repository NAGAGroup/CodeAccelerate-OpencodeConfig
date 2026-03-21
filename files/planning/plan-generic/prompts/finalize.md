# Finalize: Write the Project DAG

Your task is to **write the project DAG** that was just approved.

## What You Have

From planning:
- Task goal and acceptance criteria
- Chosen DAG shape (1A-1F) with design decisions
- Decomposition: subtasks with boundaries and dependencies
- Agent routing: assignments and model tiers
- Loop/gate details (if shape includes them)
- User approval

## What You Write

You will create:
1. **plan.json** — The executable project DAG matching the chosen shape
2. **session-overview.md** — Context for the executing agent (task-specific, not generic)
3. **prompts/{subtask}.md** — One prompt per subtask
4. **prompts/finalize.md** — Prompt for the project DAG's finalize node

## How to Write plan.json

- **Nodes:** Match your chosen shape (1A-1F)
- **Node names:** Use subtask names from decomposition
- **Node types:** "agent" for execution nodes, "gate" for decision points
- **`next` field:** Single string for linear; object with branches for loops/gates
  - **String format:** `"next": "node-id"` (single path)
  - **Array format:** `"next": ["node-1", "node-2"]` (multiple paths, no metadata)
  - **Object format (branching):** `"next": { "node-1": { "desc": "...", "choose_when": "..." }, ... }`
  - **CONSTRAINT:** Keys in object-format `next` MUST be actual node IDs. Do NOT use generic labels like "pass", "fail", "yes", "no" as keys.
- **`remaining_visits`:** Set on loop-branching nodes (evaluation/decision nodes in loops)
- **`prompt`:** Worktree-relative path to prompt file (e.g., ".opencode/session-plans/{session-name}/prompts/implement.md")
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

### Example: Correct Branching with Object-Format `next`

```json
{
  "id": "evaluate-approach",
  "type": "gate",
  "prompt": ".opencode/session-plans/example/prompts/evaluate-approach.md",
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

**Keys are actual node IDs:** `"implement-solution"` and `"explore-alternatives"` are real nodes in the DAG. **NOT** generic labels like `"pass"` or `"fail"`.

## Session-Overview Content

Write for the **executing agent**:
- Task goal and acceptance criteria
- High-level DAG shape overview
- Key decision points (gates) and unknowns
- Subtasks at a glance
- Constraints and context
- Note: "This DAG may be restructured during execution as new information emerges. Gates and loops handle unknowns."

## Subtask Prompts

For each subtask node:
- Clear instruction on what to do
- What inputs are expected
- What outputs are expected
- How to advance to next node

## Output

Write `.opencode/session-plans/{task-name}/`:
```
plan.json
session-overview.md
prompts/
  session-overview.md
  {subtask-1}.md
  {subtask-2}.md
  ...
  finalize.md
```

Call `close_session()` when done.
