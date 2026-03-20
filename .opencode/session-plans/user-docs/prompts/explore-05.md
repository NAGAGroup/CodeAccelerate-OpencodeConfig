# Node: explore-05 — Review & Commit

**Open question this node covers:**
> Are the written docs complete, accurate, and ready to commit?

## Your Role

Surface this question to the user and explore it collaboratively. Do not produce answers unprompted. Ask, listen, and follow the user's lead. Record conclusions in `spec.md` as they are reached.

## Approach

Do a final review pass of all written files with the user. Confirm all docs are complete and accurate. Then commit.

## Delegation

**Agent:** HW (direct)

Shell access required for git operations. No subagent delegation in this node.

HW:
1. Lists all written doc files for the user to confirm completeness
2. Makes any final judgment edits surfaced during review
3. Runs `git add` and `git commit` with an appropriate commit message once user approves

Update `spec.md → Findings` to note commit status before advancing.

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves:

- **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
- **Rename or split nodes** — if the current explore node scope is too broad, split it
- **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
- **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.

## Advance

- Loop: `next_step({ next: "explore-05" })` — if review surfaces issues that need fixing before commit
- Advance: `next_step({ next: "spec-gate" })` — when docs are committed and session is ready to close
