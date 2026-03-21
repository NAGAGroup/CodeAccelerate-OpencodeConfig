# Planning Gate: User Approval

Present the full planning summary to the user and request approval.

## What to Show

Present all planning decisions:
- Task goal, acceptance criteria, constraints
- Chosen DAG shape (1A-1F) with justification
- Decomposition: subtasks, boundaries, dependencies
- Agent routing: assignments and model tiers
- Key design details: loops, gates, decision points

## User Options

The user will choose one:

1. **Approve & Finalize** — Planning decisions are solid; proceed to write project DAG
2. **Clarify Task** — Need more understanding of task or context; loop back to clarify
3. **Reconsider Shape** — Selected shape doesn't fit; loop back to propose-shape
4. **Refine Decomposition** — Subtask breakdown needs adjustment; loop back to propose-decomposition

## Your Output

If **approved:** Call `next_step({ next: "finalize" })`

If **needs clarification:** Call `next_step({ next: "clarify" })`

If **reconsider shape:** Call `next_step({ next: "propose-shape" })`

If **refine decomposition:** Call `next_step({ next: "propose-decomposition" })`
