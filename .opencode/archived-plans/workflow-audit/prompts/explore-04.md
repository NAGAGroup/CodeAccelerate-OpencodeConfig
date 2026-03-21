<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Node: explore-04 — Deep Research Workflow Redesign

**Goal for this node:** Read the current Deep Research workflow files, work with the user to redesign the DAG and prompts collaboratively, then distill the redesign as concrete findings into `spec.md`.

## Your Role

Read the current state, then drive a collaborative redesign conversation. One question or proposal at a time. The user leads — you follow, ask, and record.

Do **not** produce a full redesign unprompted. Surface one element at a time, get user confirmation, then move to the next.

## Files to Read

Before engaging the user, read these files to understand the current state:

- `opencode/planning/plan-deep-research/plan.json`
- `opencode/planning/plan-deep-research/prompts/research-intake.md`
- `opencode/planning/plan-deep-research/prompts/clarify.md`
- `opencode/planning/plan-deep-research/prompts/research-gate.md`
- `opencode/planning/plan-deep-research/prompts/agent-routing.md`
- `opencode/planning/plan-deep-research/prompts/finalize.md`

## Approach

1. Summarize the current DAG in one line for the user
2. Surface the proposed redesign (or one element of it at a time) for discussion
3. Ask, listen, revise
4. Once the user is satisfied with the redesign, distill it as findings into `spec.md`

## Recording Findings

Update `spec.md` under **Deep Research Workflow** with:
- Proposed DAG (before/after)
- Each concrete change with rationale
- Label findings clearly (e.g., "DeepRes-1 — move `load-guidelines` to second node")

## Advance

- To continue the Deep Research redesign: `next_step({ next: "explore-04" })`
- When Deep Research redesign is done and findings are recorded: `next_step({ next: "spec-gate" })`

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves.

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.
