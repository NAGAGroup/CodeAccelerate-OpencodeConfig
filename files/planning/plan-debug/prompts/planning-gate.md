# Planning Gate: User Approval

Present the full investigation plan to the user and request approval.

## What to Show

Present all planning decisions:
- Bug symptoms, reproduction path, and impact
- Primary and alternative hypotheses
- Chosen investigation approach and shape
- Diagnosis decomposition: steps, hypothesis testing, and decision points
- Test strategy: method, evidence, expected outcomes per step
- Agent routing: assignments and model tiers
- Key design details: diagnosis loops, hypothesis gates, decision criteria

## User Options

The user will choose one:

1. **Approve & Finalize** — Investigation plan is solid; proceed to write project DAG
2. **Clarify Bug** — Need more understanding of symptoms or context; loop back to bug-intake
3. **Reconsider Hypothesis** — Primary hypothesis doesn't seem right; loop back to propose-hypothesis
4. **Refine Investigation** — Diagnosis steps need adjustment; loop back to propose-investigation-shape

## Your Output

If **approved:** Call `next_step({ next: "finalize" })`

If **clarify bug:** Call `next_step({ next: "bug-intake" })`

If **reconsider hypothesis:** Call `next_step({ next: "propose-hypothesis" })`

If **refine investigation:** Call `next_step({ next: "propose-investigation-shape" })`
