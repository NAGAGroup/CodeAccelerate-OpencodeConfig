# Finalize: Write the Project DAG

Your task is to **write the research project DAG** that was just approved.

## What You Have

From planning:
- Research question, scope, and purpose
- Primary and secondary research angles
- Evidence hierarchy and validation strategy
- Chosen DAG shape (1A, 1B, 1D, 1E, or 1F)
- Research steps with angle coverage and dependencies
- Success criteria for completeness and evidence sufficiency
- Agent routing: assignments and model tiers
- Loop/gate details (if applicable)
- User approval

## What You Write

You will create:
1. **plan.json** — The executable research DAG matching the chosen shape
2. **session-overview.md** — Context for the researching agent
3. **prompts/{research-step}.md** — One prompt per research step
4. **prompts/finalize.md** — Prompt for the research's finalize node

## How to Write plan.json

- **Nodes:** Match your research shape (1A, 1B, 1D, 1E, 1F)
- **Node names:** Use research step names from decomposition
- **Node types:** "agent" for research nodes, "gate" for angle decisions
- **`next` field:** Single string for linear; object with branches for loops/gates
- **`remaining_visits`:** Set on synthesis/evaluation nodes that gate evidence loops
- **`prompt`:** Worktree-relative path to prompt file (e.g., ".opencode/session-plans/{session-name}/prompts/research-step.md")
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

## Session-Overview Content

Write for the **researching agent**:
- Research question and scope
- Purpose and intended use of findings
- Primary and secondary research angles
- High-level research structure
- Key evidence-gathering phases and synthesis points
- Research angle gates and how they work
- Success criteria and research brief expectations
- Note: "This research will be guided by the evidence hierarchy and may discover new angles or gaps. Synthesis nodes help integrate findings progressively."

## Research Prompts

For each research step:
- Clear instruction on what research to conduct
- Which angles to investigate
- What sources to use
- What evidence to gather
- How to validate findings
- How to advance to next node

## Output

Write `.opencode/session-plans/{research-name}/`:
```
plan.json
session-overview.md
prompts/
  session-overview.md
  {research-step-1}.md
  {research-step-2}.md
  ...
  finalize.md
```

Call `close_session()` when done.
