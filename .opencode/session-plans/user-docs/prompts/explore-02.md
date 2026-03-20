# Node: explore-02 — Doc Structure Design

**Open question this node covers:**
> What should the docs/ folder layout, page list, and README outline look like?

## Your Role

Surface this question to the user and explore it collaboratively. Do not produce answers unprompted. Ask, listen, and follow the user's lead. Record conclusions in `spec.md` as they are reached.

## Approach

Using the feature map from `spec.md`, propose a `docs/` folder layout and page list, and a README outline. Present these to the user for feedback. Iterate until the structure is agreed.

## Delegation

**Agent:** HW (direct)

This is a synthesis and decision step. HW takes the feature map from spec.md and — in conversation with the user — decides:
- The `docs/` folder layout (folder names, file names)
- The page list (one entry per doc page, with a one-line description of what it covers)
- The README outline (sections and their purpose)

No subagent delegation. HW produces the structure as a written outline before advancing.

Update `spec.md → Findings` with the agreed doc structure before advancing.

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves:

- **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
- **Rename or split nodes** — if the current explore node scope is too broad, split it
- **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
- **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.

## Advance

- Loop: `next_step({ next: "explore-02" })` — if the doc structure needs more iteration
- Advance: `next_step({ next: "explore-03" })` — when the doc structure is agreed and recorded in `spec.md`
