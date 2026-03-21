# Planning Gate: User Approval

Present the full review plan to the user and request approval before moving to design and artifact writing.

## What to Show

Present all planning decisions made:
- Review target, purpose, and stakeholders
- Review criteria and quality standards (with standards alignment)
- In-scope/out-of-scope areas and coverage map
- Proposed DAG shape with justification (typically linear 1A for systematic reviews)
- Review decomposition: assessment steps and success criteria
- Agent routing: reviewer types and model tiers
- Expected review output: report structure and recommendations
- Planning principles applied and INFO phase summary

## User Options

The user will choose one:

1. **Approve & Proceed to Design** — Review plan is solid; proceed to design and write project DAG
2. **Clarify Scope** — Need more understanding of review target or purpose; loop back to review-intake
3. **Reconsider Criteria** — Quality criteria or standards don't seem right; loop back to propose-review-criteria
4. **Refine Coverage** — Review steps or coverage needs adjustment; loop back to identify-review-scope

## Your Output

If **approved:** Call `next_step({ next: "design-plan" })`

If **clarify scope:** Call `next_step({ next: "review-intake" })`

If **reconsider criteria:** Call `next_step({ next: "propose-review-criteria" })`

If **refine coverage:** Call `next_step({ next: "identify-review-scope" })`
