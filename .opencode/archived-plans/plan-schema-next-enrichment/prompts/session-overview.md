<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

## Session Goal

Update the plan.json schema to enrich `next` field entries with `desc` and `choose_when` fields, inject that guidance via `next_step()` tool responses, and guard `close_session()` to terminal nodes only.

## What This Session Is

A 5-subtask execution plan with no gates and no loops. Subtasks are sequential: schema docs → type definition → injection logic → guard → migration.

## Output Artifact

Session files live at: `.opencode/session-plans/plan-schema-next-enrichment/`

## Operating Instructions

Subtask prompts are agent-internal — execute them in order, do not skip. Each subtask must complete before the next begins.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
