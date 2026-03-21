# Planning Gate: User Approval

Present the full review plan to the user and request approval.

## What to Show

Present all planning decisions:
- Review target, purpose, and stakeholders
- Review criteria and quality standards
- In-scope/out-of-scope areas and coverage map
- Proposed DAG shape with justification
- Review decomposition: assessment steps and success criteria
- Agent routing: reviewer types and model tiers
- Review output: report structure and recommendations

## User Options

The user will choose one:

1. **Approve & Finalize** — Review plan is solid; proceed to write project DAG
2. **Clarify Scope** — Need more understanding of review target or purpose; loop back to review-intake
3. **Reconsider Criteria** — Quality criteria don't seem right; loop back to propose-review-criteria
4. **Refine Coverage** — Review steps or coverage needs adjustment; loop back to identify-review-scope

## Your Output

If **approved:** Call `next_step({ next: "finalize" })`

If **clarify scope:** Call `next_step({ next: "review-intake" })`

If **reconsider criteria:** Call `next_step({ next: "propose-review-criteria" })`

If **refine coverage:** Call `next_step({ next: "identify-review-scope" })`
