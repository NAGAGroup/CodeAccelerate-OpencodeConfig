# Finalize: Write the Project DAG

Your task is to **write the investigation project DAG** that was just approved.

## What You Have

From planning:
- Bug symptoms, reproduction path, and impact
- Primary and alternative hypotheses
- Investigation shape decision (branch / loop / both)
- Diagnosis steps with hypothesis testing details
- Test strategy per step
- Agent routing: assignments and model tiers
- Loop/gate details (if applicable)
- User approval from preview-gate

## What You Write

You will create:
1. **plan.json** — The executable investigation DAG matching the chosen shape
2. **session-overview.md** — Context for the investigating agent
3. **prompts/{diagnosis-step}.md** — One prompt per diagnosis step
4. **prompts/finalize.md** — Prompt for the investigation's finalize node

## How to Write plan.json

- **Nodes:** Match your investigation shape (3-7 diagnosis steps, gates/loops as needed)
- **Node names:** Use diagnosis step names from decomposition
- **Node types:** "agent" for investigation nodes, "gate" for hypothesis decisions
- **`next` field:** Single string for linear; object with branches for loops/gates
- **`remaining_visits`:** Set on evaluation nodes that gate diagnosis loops
- **`prompt`:** Worktree-relative path to prompt file (e.g., ".opencode/session-plans/{session-name}/prompts/diagnose.md")
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

**Structure based on branch/loop decision:**
- **Looping:** session-overview → diagnose-1 → evaluate → {loop-back to diagnose-1 with refined approach, or advance} → finalize
- **Branching:** session-overview → test-hypothesis-A → {branch: confirm A → finalize, or test-hypothesis-B → finalize}
- **Both:** Combination of loop and branch nodes

## Session-Overview Content

Write for the **investigating agent**:
- Bug symptoms and reproduction path
- Impact and severity
- Primary and alternative hypotheses
- High-level investigation structure (branch/loop/both)
- Key diagnosis loops and decision points
- Subtask overview
- Note: "This investigation may reveal the root cause early or require hypothesis branching. Each step produces evidence that guides the next."

## Diagnosis Prompts

For each diagnosis step:
- Clear instruction on what investigation to perform
- What evidence to gather and how
- What results confirm or falsify the hypothesis
- How to advance to next node
- (For complex steps) Mention: "If this step requires deep reasoning about code interactions, consider using `sequential-thinking`"

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
