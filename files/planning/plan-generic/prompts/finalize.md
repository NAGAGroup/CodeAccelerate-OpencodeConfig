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
- **`remaining_visits`:** Set on loop-branching nodes
- **`prompt`:** Worktree-relative path to prompt file (e.g., ".opencode/session-plans/{session-name}/prompts/implement.md")
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

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
