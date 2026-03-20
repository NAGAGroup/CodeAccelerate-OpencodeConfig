# Node: explore-03 — Write Root README

**Open question this node covers:**
> What should the root-level README contain?

## Your Role

Surface this question to the user and explore it collaboratively. Do not produce answers unprompted. Ask, listen, and follow the user's lead. Record conclusions in `spec.md` as they are reached.

## Approach

Using the README outline from `spec.md`, write the root `README.md`. Present the draft to the user for review. Iterate on feedback until approved.

## Delegation

**Agent:** @QuickDoc (haiku-like)

Single-file write task. HW provides @QuickDoc with:
- The agreed README outline from `spec.md`
- The feature map from `spec.md`
- Audience note: non-technical end users
- Target file: `README.md` at repo root

@QuickDoc writes the full `README.md`. HW reviews the output with the user before advancing.

Update `spec.md → Findings` to note README status (draft / approved) before advancing.

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves:

- **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
- **Rename or split nodes** — if the current explore node scope is too broad, split it
- **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
- **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.

## Advance

- Loop: `next_step({ next: "explore-03" })` — if the README needs revision before moving on
- Advance: `next_step({ next: "explore-04" })` — when the README is approved
