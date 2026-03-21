# Task 8: Finalize

Your task is to **present a summary of all work completed and request user approval to commit to main**.

## Agent: HeadWrench (HW Direct)

This is a gate and orchestration task. You present findings and close the session.

## What You Have Completed

By this point:
1. ✓ Written and user-approved the improvements spec
2. ✓ Updated plan-generic with all improvements
3. ✓ Updated plan-debug with all improvements + @ContextInsurgent emphasis
4. ✓ Updated plan-collaborative, plan-deep-research, plan-deep-review
5. ✓ Validated all 5 DAGs for consistency
6. ✓ Successfully built the project and verified dist/ output

## Your Output: Finalization Summary

Present to the user:

### Section 1: Work Completed
- All 5 planning DAGs updated with improvements
- Spec document written and applied
- Cross-DAG validation passed
- Build successful, dist/ clean

### Section 2: Improvements Implemented
Summarize what was done:
- **Intake Clarity:** Questions removed from all intake steps; moved to dedicated downstream steps with context
- **Agent Leverage:** @ContextScout parallel dispatch, @ContextInsurgent routing, sequential thinking integration
- **Tool Integration:** Web research tools (exa_web_search, context7) documented in scout phases
- **Flow Optimization:** All 11 improvements (10 from debug-review + intake question removal) applied across all DAGs
- **Consistency:** All 5 DAGs follow same patterns with domain-appropriate adaptations

### Section 3: Key Changes
List major modifications:
1. All intake steps have questions removed; intake now gathers raw information only
2. Clarify/evaluate-understanding steps now contain all context-dependent questions
3. Finalize node refactored (design-plan → preview-gate → write-prompts → finalize)
4. Scout prompts now explicitly instruct @ContextScout parallel dispatch
5. Agent-routing prompts now include @ContextInsurgent guidance
6. Sequential thinking tool mentioned in planning and generated DAG prompts
7. Web tools dispatch documented with decision criteria

### Section 4: Validation Results
- Cross-DAG validation passed: X checks out of Y
- Build passed on first attempt (or Nth attempt after fixes)
- dist/ structure valid and complete
- plan.json files syntactically correct

### Section 5: User Approval Gate

Ask the user:

> All improvements have been implemented, validated, and built successfully. Are you ready to:
> 
> 1. Commit all changes to main with a summary message?
> 2. Request further refinement before committing?

Provide two options:
- **Approve & Commit** — Proceed to commit with message
- **Hold for Review** — Hold changes; further refinement needed before committing

## If User Approves

1. Write a git commit message summarizing all improvements
2. Run git commands to stage and commit:
   ```bash
   git add -A
   git commit -m "Audit and improve planning DAGs: implement 10 improvements, agent leverage, and tool integration"
   ```
3. Verify commit succeeded
4. Archive this planning session by creating:
   ```
   .opencode/archived-plans/planning-audit-{date}/ with session plan files
   ```
5. Call `close_session()` to terminate the DAG

## If User Requests Hold

Document what refinements are needed. Recommend appropriate next steps (loop back to design-spec, update-plan-generic, etc.).

## Commit Message Format

Example:
```
Planning DAGs audit: implement 11 improvements + agent leverage

- Intake steps now ask no questions; questions moved to downstream steps with context
- Scout tasks now explicitly instruct @ContextScout parallel dispatch
- @ContextInsurgent routed in agent-routing for deep reasoning tasks
- Sequential thinking tool integrated in planning and generated DAGs
- Web research tools (Exa, context7) documented and routed in scout phases
- Finalize node refactored into design-plan → preview-gate → write-prompts → finalize
- All 11 improvements (10 from debug-review + intake question removal) applied across all 5 DAGs
- Cross-DAG consistency validated; build passing

Applies to: plan-generic, plan-debug, plan-collaborative, plan-deep-research, plan-deep-review
```

## Notes

- This is the terminal node; no further looping
- User approval is required before committing to main
- If the build had failures and fixes were applied, note that in the summary ("Build succeeded after N fixes")
- Archive the planning session for future reference
- Ensure all git operations complete cleanly
