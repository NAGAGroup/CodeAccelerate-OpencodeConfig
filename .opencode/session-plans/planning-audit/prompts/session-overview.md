# Planning Audit Session: Improving Planning DAGs

## What You're Doing

You are executing a comprehensive audit of all 5 planning DAGs used by CodeAccelerate-OpenCode. The goal is to implement systematic improvements targeting:

1. **Agent leverage** — Scout tasks must explicitly use @ContextScout in parallel; decompose phases must route @ContextInsurgent; planning prompts must encourage sequential thinking
2. **Flow optimization** — Implement the 10 improvements proposed by debug-review agent (INFO phase optimization, preview gates, early branching clarity, finalize split, etc.)
3. **Tool integration** — Web research tools (Exa, context7) must be routed and documented in planning scout phases; project DAG execution prompts must encourage web tool use

## Task Goal

Implement all 11 improvements (10 from debug-review + 1 user addition) plus ContextInsurgent leverage, web tools integration, and sequential thinking across all 5 planning DAGs (generic, debug, collaborative, deep-research, deep-review).

## Acceptance Criteria

1. Intake steps have NO questions; all questions moved to downstream steps with context (all 5 DAGs)
2. Scout tasks explicitly instruct use of @ContextScout agents in parallel (all 5 DAGs)
3. Sequential thinking integration added to planning prompts and encouraged in generated DAGs
4. @ContextInsurgent explicitly leveraged in agent-routing and decomposition guidance
5. Web research tools (Exa, context7) routed and documented in scout phases
6. All 11 improvements applied across all 5 DAGs
7. Build passes; dist/ output is clean and valid
8. All changes committed to main with clear summary

## Constraints

- **Backward compatibility NOT required** — DAG structure can be refactored aggressively
- Build must pass cleanly
- dist/ structure must be valid

## DAG Shape: 1F (Complex DAG)

This session uses a **1F shape** with:
- **Design phase:** Write improvement spec (spec-approval-gate decides if proceeding)
- **Implementation phase:** Sequential DAG updates (generic → debug → parallel update of 3 others)
- **Validation phase:** Cross-DAG consistency audit
- **Verification phase:** Build & verify
- **Correction phase:** Fix-rebuild loop on failure (remaining_visits: 3)
- **Finalization phase:** User approval and commit

## Subtasks at a Glance

| Task | Agent | Outputs |
|------|-------|---------|
| 1. Design Improvements Spec | HW direct | `.opencode/planning-audit-spec.md` |
| 2. Update plan-generic | @JuniorDev or HW | Modified scout.md, agent-routing.md, finalize.md, plan.json |
| 3. Update plan-debug | @JuniorDev | Modified debug DAG prompts + plan.json |
| 4. Update collab/deep-research/deep-review | @JuniorDev ×3 parallel | Modified prompts + plan.json for each |
| 5. Cross-DAG Validation | @ContextScout | Validation report (consistency audit) |
| 6. Build & Verify | HW direct | Build output, dist/ verification |
| 7. Fix-Rebuild | HW direct | Fixed issues, re-build (loop up to 3 times) |
| 8. Finalize | HW direct | Commit message, session archive |

## Key Decision Points

- **Spec Approval Gate** (after task 1): User approves spec before proceeding to DAG updates
- **Build Verification** (task 6): Branches on success/failure; up to 3 fix attempts before escalation
- **User Finalize Gate** (task 8): User approves all work and commits to main

## Notes

- Tasks 4 (update-plan-parallel) dispatches 3 agents in parallel to update collaborative, deep-research, and deep-review DAGs
- The spec document (task 1) is authoritative; all downstream updates reference it
- Sequential thinking will be encouraged in both planning DAG prompts AND the generated project DAG execution prompts
- @ContextInsurgent will be explicitly routed in agent-routing prompts for complex decomposition tasks

Proceed to task 1 to begin.
