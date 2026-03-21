# Finalize: Write the Project DAG

Your task is to **write the collaboration project DAG** that was just approved.

## What You Have

From planning:
- Design goal, success criteria, and constraints
- Collaboration shape and approach
- Chosen DAG shape (1A, 1B, 1D, 1E, or 1F)
- Design steps with user input points and decision gates
- Output artifact definition
- Agent routing: assignments and model tiers
- Loop/gate details (if applicable)
- User approval

## What You Write

You will create:
1. **plan.json** — The executable collaboration DAG matching the chosen shape
2. **session-overview.md** — Context for the collaborating agent
3. **prompts/{design-step}.md** — One prompt per design step
4. **prompts/finalize.md** — Prompt for the collaboration's finalize node

## How to Write plan.json

- **Nodes:** Match your collaboration shape (1A, 1B, 1D, 1E, 1F)
- **Node names:** Use design step names from decomposition
- **Node types:** "agent" for design nodes, "gate" for user decisions
- **`next` field:** Single string for linear; object with branches for loops/gates
- **`remaining_visits`:** Set on user gate nodes that gate feedback loops
- **`prompt`:** Worktree-relative path to prompt file (e.g., ".opencode/session-plans/{session-name}/prompts/design-step.md")
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

## Session-Overview Content

Write for the **collaborating agent**:
- Design goal and success criteria
- Artifact to be produced
- High-level collaboration structure
- Key feedback loops and user decision points
- Collaboration turn overview
- Constraints and context
- Note: "This design will evolve through collaborative feedback. User gates and refinement loops allow iterating toward success criteria."

## Design Prompts

For each design step:
- Clear instruction on what to design/explore
- What inputs are expected
- What deliverable to produce
- How to present to user
- How to advance to next node

## Output

Write `.opencode/session-plans/{design-name}/`:
```
plan.json
session-overview.md
prompts/
  session-overview.md
  {design-step-1}.md
  {design-step-2}.md
  ...
  finalize.md
```

Call `close_session()` when done.
