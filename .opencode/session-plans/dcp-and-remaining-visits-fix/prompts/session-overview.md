<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session Overview — dcp-and-remaining-visits-fix

This session fixes two related problems: (1) the DCP compression system was destroying active planning context because `next_step`, `activate_plan`, and `close_session` inject prompts rather than returning them as tool outputs, and (2) four planning workflow prompt files need `remaining_visits` counter guidance updated.

## What This Session Does

7 subtasks, no gates, all sequential:

1. **plugin-return-prompt** — Refactor `planning-enforcement.ts` so `activate_plan`, `next_step`, and `close_session` return prompt content as tool results instead of injecting them. This makes the content protectable by DCP's `protectedTools`.
2. **dcp-jsonc-protected-tools** — Add `activate_plan`, `close_session`, `next_step` to `compress.protectedTools` in `dcp.jsonc`.
3. **dcp-override-prompts** — Strengthen the 4 DCP override prompt files: protect all content generated during the active DAG node, remove the coercive "MANDATORY" framing from `context-limit-nudge.md`.
4. **generic-decompose** — Add loop-node identification step and user-ask for `remaining_visits` count (default: 3).
5. **generic-finalize** — Expand `remaining_visits` guidance: default=3, user-confirmed counts, `reset_counters()` recovery.
6. **debug-finalize** — Replace hardcoded `remaining_visits: 5` with default=3, user-ask, `reset_counters()` recovery.
7. **collaborative-finalize** — Add `remaining_visits`/`reset_counters()` note to session-overview verbatim block and explore node guidance.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
