<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: loop-node-design-guidance

## Goal

Add detailed loop node design guidance to `plan-design-guidelines.md` and to the relevant prompt file in each plan type (plan-generic, plan-collaborative, plan-deep-research, plan-deep-review, plan-debug), so the planning agent always knows how to recognize and properly design loop nodes without user correction mid-session.

## What This Session Is

7 subtasks. No gate nodes. No loop nodes. All subtasks are additive, non-destructive edits to markdown files followed by a build verification step.

- ST01–ST06 add loop node design guidance to specific markdown files
- ST07 runs `bun run build` to verify the registry builds cleanly

ST01–ST06 are independent and can be delegated in parallel.

## Output Artifacts

All session files live under:
```
.opencode/session-plans/loop-node-design-guidance/
```

Files being modified during execution:
- `files/planning/plan-design-guidelines.md`
- `files/planning/plan-generic/prompts/decompose.md`
- `files/planning/plan-collaborative/prompts/clarify.md`
- `files/planning/plan-deep-research/prompts/clarify.md`
- `files/planning/plan-deep-review/prompts/clarify.md`
- `files/planning/plan-debug/prompts/hypothesis-form.md`

## Operating Instructions

- Execute subtasks in DAG order — ST01 through ST07
- ST01–ST06 may be dispatched in parallel (all independent)
- ST07 must run after all edits are complete
- Do not skip subtasks
- Subtask prompts are self-contained — read them fully before executing

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
