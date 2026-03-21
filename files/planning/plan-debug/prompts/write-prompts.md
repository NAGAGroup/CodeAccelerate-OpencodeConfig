# Write Prompts: Generate All Investigation Step Prompts

Your task is to **write all prompt files** for the investigation DAG that was just approved in preview-gate.

## What You Have

- Approved plan.json with nodes, branching, and looping
- Diagnosis steps with testing objectives
- Agent routing and model tiers per step
- Test strategy and success criteria

## What You Write

For the session plan directory `.opencode/session-plans/{bug-name}/`:

1. **plan.json** (validate and finalize)
   - Copy/refine the approved structure from design-plan
   - Ensure all node references are valid
   - Verify prompt paths are correct

2. **session-overview.md**
   - Bug symptoms and reproduction path
   - Impact and severity
   - Primary and alternative hypotheses with confidence levels
   - High-level investigation structure
   - Investigation shape: branch/loop/both decision
   - Key decision points and success criteria
   - Agent assignments for complex steps

3. **prompts/{diagnosis-step-1}.md** through **prompts/{diagnosis-step-N}.md**
   - For each diagnosis step:
     - Clear instruction on what investigation to perform
     - What evidence to gather and how
     - What results confirm, refine, or refute the hypothesis
     - When and how to advance to the next step
     - (For complex steps) Mention: "If this step requires reasoning about code interactions across modules, consider using `sequential-thinking`"

4. **prompts/finalize.md**
   - Instructions for the investigation's final node
   - What to deliver (root cause findings, evidence summary)
   - How to report results

## For Branching DAGs

If investigation branches (tests multiple hypotheses):
- Each branch should have clear entry and exit nodes
- Evaluation gates should have explicit conditions for choosing path-A vs. path-B
- Document which evidence supports each branch

## For Looping DAGs

If investigation loops (refine one hypothesis):
- Evaluation gate should specify: "Loop if evidence is inconclusive; advance if hypothesis is confirmed/refuted"
- `remaining_visits` should limit iterations (typically 2-3)
- Each loop iteration should refine test approach based on previous results

## Output

Write all files to `.opencode/session-plans/{bug-name}/`:
```
plan.json (final, validated)
session-overview.md
prompts/
  session-overview.md
  {diagnosis-step-1}.md
  {diagnosis-step-2}.md
  ...
  finalize.md
```

Validate:
- All prompt files are written
- All node IDs in plan.json exist
- All prompt paths in plan.json are correct
- plan.json is valid JSON

Call `next_step()` to finalize.
