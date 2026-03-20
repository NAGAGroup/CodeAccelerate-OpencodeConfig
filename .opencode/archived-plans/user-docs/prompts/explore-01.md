# Node: explore-01 — Codebase Exploration

**Open question this node covers:**
> What features, flows, and concepts in this codebase need to be documented?

## Your Role

Surface this question to the user and explore it collaboratively. Do not produce answers unprompted. Ask, listen, and follow the user's lead. Record conclusions in `spec.md` as they are reached.

## Approach

Before engaging the user, dispatch multiple @ContextScouts in parallel to build a feature map of the codebase. Present findings to the user for validation and gap-filling.

## Delegation

**Agent:** @ContextScout (parallel × 3, haiku-like)

Dispatch three scouts simultaneously, each covering a distinct area:

1. **Scout 1 — Project structure & entry points**
   - Read: top-level directory, `package.json` / `pyproject.toml` / equivalent, main entry file(s)
   - Goal: Understand what this project is, how it is structured, and how a user would start using it
   - Verify: Returns a clear description of what the product does and its main entry points

2. **Scout 2 — Core features and user-facing functionality**
   - Read: source files containing primary user-facing logic, commands, or UI components
   - Goal: Identify all features and flows a non-technical end user would interact with
   - Verify: Returns a named list of features with a one-line description of each

3. **Scout 3 — Configuration, setup, and installation flows**
   - Read: config files, setup scripts, environment requirements, any onboarding-related files
   - Goal: Understand what a new user must do to install, configure, and run this project
   - Verify: Returns a clear list of setup steps and any configuration options

If any area turns out to require deep cross-file reasoning (e.g., a complex plugin or extension system), escalate that area to **@ContextInsurgent** (sonnet-like) as a follow-up before presenting findings to the user.

After scouts return, synthesize their findings into a feature map and present it to the user. Ask: "Does this capture everything that should be documented? Anything missing or out of scope?"

Update `spec.md → Findings` with the agreed feature map before advancing.

## Session Authority

This is a collaborative session plan. You have full authority to restructure it as the session evolves:

- **Add explore nodes** — if a new area of exploration emerges, add it to `plan.json` and write its prompt file
- **Rename or split nodes** — if the current explore node scope is too broad, split it
- **Update `spec.md`** — record findings, revise open questions, add new ones as they surface
- **Restructure `plan.json`** — change node order, add branches, remove nodes that become irrelevant

**One hard constraint:** The node ID you are currently executing must still exist in `plan.json` when you call `next_step()`. Do not delete or rename the current node mid-execution.

When in doubt, bias toward restructuring — a plan that reflects the actual session is more useful than one that doesn't.

## Advance

- Loop: `next_step({ next: "explore-01" })` — if more codebase exploration is needed before moving on
- Advance: `next_step({ next: "explore-02" })` — when the feature map is agreed and recorded in `spec.md`
