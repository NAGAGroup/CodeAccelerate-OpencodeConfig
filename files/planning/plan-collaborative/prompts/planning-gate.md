# Planning Gate: User Approval

Present the full collaboration plan to the user and request approval.

## What to Show

Present all planning decisions:
- Design goal, success criteria, and constraints
- Collaboration shape and approach
- Proposed DAG shape (1A-1F) with justification
- Collaboration decomposition: design steps, user input points, and decision gates
- Output artifact: type, format, and scope
- Agent routing: assignments and model tiers
- Key design details: dialogue loops, user gates, refinement criteria

## User Options

The user will choose one:

1. **Approve & Finalize** — Collaboration plan is solid; proceed to write project DAG
2. **Clarify Goal** — Need more understanding of design goal or constraints; loop back to intake
3. **Reconsider Shape** — Collaboration approach doesn't fit; loop back to propose-success-criteria
4. **Refine Steps** — Design steps need adjustment; loop back to propose-collaboration-shape

## Your Output

If **approved:** Call `next_step({ next: "finalize" })`

If **clarify goal:** Call `next_step({ next: "intake" })`

If **reconsider shape:** Call `next_step({ next: "propose-success-criteria" })`

If **refine steps:** Call `next_step({ next: "propose-collaboration-shape" })`
