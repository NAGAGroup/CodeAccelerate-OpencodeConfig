# Planning Gate: User Approval

Present the full research plan to the user and request approval.

## What to Show

Present all planning decisions:
- Research question, scope, and purpose
- Primary and secondary research angles
- Evidence hierarchy and validation strategy
- Proposed DAG shape with justification
- Research decomposition: steps, angle coverage, and dependencies
- Success criteria: completeness, sufficiency, and quality
- Agent routing: assignments and model tiers
- Key design details: research loops, angle gates, synthesis approach

## User Options

The user will choose one:

1. **Approve & Finalize** — Research plan is solid; proceed to write project DAG
2. **Clarify Question** — Need more understanding of research question or scope; loop back to research-intake
3. **Reconsider Angles** — Research angles don't seem right; loop back to propose-research-angles
4. **Refine Steps** — Research steps need adjustment; loop back to propose-research-shape

## Your Output

If **approved:** Call `next_step({ next: "finalize" })`

If **clarify question:** Call `next_step({ next: "research-intake" })`

If **reconsider angles:** Call `next_step({ next: "propose-research-angles" })`

If **refine steps:** Call `next_step({ next: "propose-research-shape" })`
