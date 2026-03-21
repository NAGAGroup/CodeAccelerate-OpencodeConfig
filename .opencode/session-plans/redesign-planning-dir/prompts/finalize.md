<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Finalize: Write All Session Plan Artifacts

## Steps

1. **Commit all session files to git:**
   ```bash
   cd /home/jack/CodeAccelerate-OpencodeConfig
   git add .opencode/session-plans/redesign-planning-dir/
   git commit -m "plan: add redesign-planning-dir session"
   ```

2. **Present final session overview to the user:**
   - Subtask list (8 subtasks)
   - Gate locations (4 gates: 1 gate loop, 2 approval gates, 1 decision gate)
   - Execution path: ST01 → ST02 → (Gate 1) → ST03–ST04 → ST05 → (Gate 2) → ST06 → (Gate 3) → ST07 → ST08 (user decision) → finalize
   - Success criteria: All boilerplate eliminated, debug DAG fixed, collaborative/deep-research produce specs, loop language enforced, plan-deep-review decision made

3. **Provide activation command:**
   - User can run `/activate-plan redesign-planning-dir` to begin execution

## What NOT to Do

- Do NOT execute any of the subtasks
- Do NOT make decisions about plan-deep-review scope (ST08 is user-facing)
- Do NOT modify plan.json or any session files after this point
- Do NOT create any additional artifacts

## Advance

Call `close_session()` exactly once. Do NOT call `next_step()` — this is a terminal node.

