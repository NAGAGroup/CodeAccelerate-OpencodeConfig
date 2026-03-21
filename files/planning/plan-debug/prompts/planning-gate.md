# Planning Gate: Review Before Design

Your task is to **review the complete investigation plan** with the user and decide whether to proceed or refine.

## What to Show

Present all planning decisions:
- Bug symptoms, reproduction path, and impact
- Primary and alternative hypotheses (with confidence levels)
- **Investigation shape decision:** Branch (multiple hypotheses), Loop (refine one), or Both?
- Diagnosis decomposition: steps, hypothesis testing, and decision points
- Test strategy: method, evidence, expected outcomes per step
- Agent routing: assignments and model tiers
- Key design details: diagnosis loops, hypothesis gates, decision criteria

## What to Emphasize

- **Hypothesis Clarity:** Is the primary hypothesis clear and actionable?
- **Shape Soundness:** Does the branch/loop/both decision make sense for the bug's complexity?
- **Diagnosis Steps:** Are the 3-7 steps well-defined and testable?
- **Success Criteria:** Clear evidence that confirms or refutes each hypothesis?

## User Options

The user will choose one:

1. **Approve & Proceed to Design** — Investigation plan is solid; design the DAG structure
2. **Clarify Bug** — Need more understanding of symptoms or context; loop back to bug-intake
3. **Reconsider Hypothesis** — Primary hypothesis doesn't seem right; loop back to propose-hypothesis
4. **Refine Investigation** — Diagnosis steps or branch/loop decision needs adjustment; loop back to propose-investigation-shape

## Your Output

If **approved:** Call `next_step()` → proceeds to design-plan

If **clarify bug:** Call `next_step()` → returns to bug-intake

If **reconsider hypothesis:** Call `next_step()` → returns to propose-hypothesis

If **refine investigation:** Call `next_step()` → returns to propose-investigation-shape
