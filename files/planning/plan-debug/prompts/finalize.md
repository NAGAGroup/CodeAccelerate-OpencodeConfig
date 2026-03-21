# Finalize: Write the Project DAG

Your task is to **write the investigation project DAG** that was just approved.

## What You Have

From planning:
- Bug symptoms, reproduction path, and impact
- Primary and alternative hypotheses
- Chosen investigation shape (1A, 1B, 1D, 1E, or 1F)
- Diagnosis steps with hypothesis testing details
- Test strategy per step
- Agent routing: assignments and model tiers
- Loop/gate details (if applicable)
- User approval

## What You Write

You will create:
1. **plan.json** — The executable investigation DAG matching the chosen shape
2. **session-overview.md** — Context for the investigating agent
3. **prompts/{diagnosis-step}.md** — One prompt per diagnosis step
4. **prompts/finalize.md** — Prompt for the investigation's finalize node

## How to Write plan.json

- **Nodes:** Match your investigation shape (1A, 1B, 1D, 1E, 1F)
- **Node names:** Use diagnosis step names from decomposition
- **Node types:** "agent" for investigation nodes, "gate" for hypothesis decisions
- **`next` field:** Single string for linear; object with branches for loops/gates
- **`remaining_visits`:** Set on evaluation nodes that gate diagnosis loops
- **`prompt`:** Relative path to prompt file
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

## Session-Overview Content

Write for the **investigating agent**:
- Bug symptoms and reproduction path
- Impact and severity
- Primary and alternative hypotheses
- High-level investigation structure
- Key diagnosis loops and decision points
- Subtask overview
- Note: "This investigation may reveal the root cause early or require hypothesis branching. Each step produces evidence that guides the next."

## Diagnosis Prompts

For each diagnosis step:
- Clear instruction on what investigation to perform
- What evidence to gather and how
- What results confirm or falsify the hypothesis
- How to advance to next node

## Output

Write `.opencode/session-plans/{bug-name}/`:
```
plan.json
session-overview.md
prompts/
  session-overview.md
  {diagnosis-step-1}.md
  {diagnosis-step-2}.md
  ...
  finalize.md
```

Call `close_session()` when done.
