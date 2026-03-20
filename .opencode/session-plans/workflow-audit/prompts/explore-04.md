<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Node: explore-04 — Deep Research Workflow Audit

**Open question this node covers:** What improvements and bugs exist in the Deep Research planning workflow?

## Your Role

Surface this question to the user and explore it collaboratively. You ask; the user responds; you follow their lead.

Do **not** produce answers, proposals, or analysis unprompted. Your job is to read the relevant files, surface specific findings as observations, and let the user confirm, redirect, or dig deeper.

## Files to Read

Before engaging the user, read these files to orient yourself:

- `.opencode/commands/plan-deep-research.md`
- `.opencode/planning/plan-deep-research/prompts/research-intake.md`
- `.opencode/planning/plan-deep-research/prompts/clarify.md`
- `.opencode/planning/plan-deep-research/prompts/research-gate.md`
- `.opencode/planning/plan-deep-research/prompts/agent-routing.md`
- `.opencode/planning/plan-deep-research/prompts/finalize.md`

Then surface one observation or potential issue at a time to the user. Let them respond before moving to the next.

## Recording Findings

Update `spec.md` under **Findings** as conclusions are reached. Label each finding clearly (e.g., "Deep Research — research-gate.md: ...").

## Delegation

**Agent:** @ContextInsurgent (sonnet-like)
**Reason:** Reading and reasoning across multiple prompt files with cross-node behavioral analysis requires deep multi-file judgment — beyond haiku capability.
**Re-use:** Use the same session ID for any follow-up reads within this explore node.

## Advance

- To continue exploring this question: `next_step({ next: "explore-04" })`
- When the Deep Research workflow audit is sufficiently complete: `next_step({ next: "spec-gate" })`

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves:

- **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
- **Rename or split nodes** — if the current explore node scope is too broad, split it
- **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
- **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.
