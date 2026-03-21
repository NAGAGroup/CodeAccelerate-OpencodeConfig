# Finalize: Write the Project DAG

Your task is to **write the review project DAG** that was just approved.

## What You Have

From planning:
- Review target, purpose, and stakeholders
- Review criteria and quality standards
- In-scope/out-of-scope areas and coverage map
- Chosen DAG shape (typically 1A-linear, or 1C if risk-based)
- Assessment steps with coverage and success criteria
- Agent routing: reviewer types and model tiers
- Review output definition
- User approval

## What You Write

You will create:
1. **plan.json** — The executable review DAG
2. **session-overview.md** — Context for the reviewing agent
3. **prompts/{assessment-step}.md** — One prompt per assessment step
4. **prompts/finalize.md** — Prompt for the review's finalize node

## How to Write plan.json

- **Nodes:** Match your review shape (typically 1A-linear)
- **Node names:** Use assessment step names from decomposition
- **Node types:** "agent" for review steps, "gate" for risk-based decisions (if any)
- **`next` field:** Single string for linear; object with branches if gates present
- **`prompt`:** Relative path to prompt file
- **Entry:** First node (usually "session-overview")
- **Terminal:** Finalize node with no `next` field

## Session-Overview Content

Write for the **reviewing agent**:
- Review target and scope
- Review purpose and stakeholder context
- Quality criteria and standards
- High-level review structure
- Coverage map: which areas get deep review
- Assessment step overview
- Report expectations
- Note: "Conduct systematic evaluation against defined criteria. Findings should be specific, actionable, and tied to quality standards."

## Assessment Prompts

For each review step:
- Clear instruction on what to evaluate
- Which criteria/areas this step covers
- Quality standards to apply
- What findings format is needed
- How to present findings
- How to advance to next node

## Output

Write `.opencode/session-plans/{review-name}/`:
```
plan.json
session-overview.md
prompts/
  session-overview.md
  {assessment-step-1}.md
  {assessment-step-2}.md
  ...
  finalize.md
```

Call `close_session()` when done.
