# Node Library Catalogue

## session-overview
**Use:** First node of every plan. Briefs the executing agent on the task — it has no other context source.
**Parameter:** `TASK_CONTEXT` — full briefing: user goal, findings, scope decisions, constraints.

## session-overview-refresher
**Use:** Immediately after every `compress` node. Re-establishes task context and behavioral contract after compression wipes agent memory.
**Parameter:** `TASK_CONTEXT` — same content as the session-overview briefing, updated for anything that changed during execution. Include a read instruction if a notes file was created.

## implement
**Use:** Dispatches a JuniorDev subagent to make a targeted code change.
**Parameters:**
- `DESCRIPTION` (required) — short one-line label for the task dispatch.
- `IMPLEMENTATION_TASK` (optional) — what needs to change and why, conceptual not line-level. Omit if the executing agent needs to compose this from findings gathered during execution.
