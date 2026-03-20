# Node: explore-04 — Write docs/ Pages

**Open question this node covers:**
> What should each docs/ page contain?

## Your Role

Surface this question to the user and explore it collaboratively. Do not produce answers unprompted. Ask, listen, and follow the user's lead. Record conclusions in `spec.md` as they are reached.

## Approach

Using the page list and doc structure from `spec.md`, write all `docs/` pages. Dispatch one @QuickDoc per page in parallel. Present drafts to the user for review. Iterate on feedback until all pages are approved.

## Delegation

**Agent:** @QuickDoc (haiku-like, parallel — one per docs page)

Dispatch one @QuickDoc per page simultaneously. For each page, HW provides:
- The page's entry from the doc structure (file name, one-line description of what it covers)
- Relevant feature context extracted from the feature map in `spec.md`
- Audience note: non-technical end users
- Target file: `docs/{page-name}.md`

All @QuickDocs run in parallel. HW reviews all output with the user. Iterate on any pages that need revision — dispatch a fresh @QuickDoc (do not re-delegate to the same instance).

Update `spec.md → Findings` to note which pages are approved before advancing.

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves:

- **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
- **Rename or split nodes** — if the current explore node scope is too broad, split it
- **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
- **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.

## Advance

- Loop: `next_step({ next: "explore-04" })` — if any pages still need revision
- Advance: `next_step({ next: "explore-05" })` — when all docs/ pages are approved
