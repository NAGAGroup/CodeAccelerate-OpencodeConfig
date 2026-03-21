<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session Overview: terminal-node-instruction

## Goal

Add explicit instructions — to `plan-design-guidelines.md` and all four planning flow `finalize.md` prompts — that the final (terminal) node of any generated session plan must NOT include a `next` field. Without this instruction, executing agents have no signal to call `close_session()` and the session cannot close out properly.

## What This Session Is

5 subtasks, no gates, no loops. All edits are additive doc changes.

- **Subtask 01:** Update `plan-design-guidelines.md` to extend the "Terminal Nodes" section with an explicit rule for generated session plans
- **Subtasks 02–05:** Update each of the four planning flow `finalize.md` prompts (`plan-generic`, `plan-debug`, `plan-collaborative`, `plan-deep-research`) to add a constraint that the last node of the generated plan must omit `next` entirely

## Output Artifacts

Session files live at: `.opencode/session-plans/terminal-node-instruction/`

Files modified by this session:
- `planning/plan-design-guidelines.md`
- `planning/plan-generic/prompts/finalize.md`
- `planning/plan-debug/prompts/finalize.md`
- `planning/plan-collaborative/prompts/finalize.md`
- `planning/plan-deep-research/prompts/finalize.md`

## Operating Instructions

Execute subtask prompts in order. Do not skip any subtask. Each prompt is self-contained — read it fully before acting. Subtasks 02–05 may be dispatched in parallel.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
