<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — Wiring: plugin tool, slash command, headwrench update

## Objective

Wire the new `plan-deep-research` planning mode into the system by: (1) adding a `plan_deep_research` plugin tool to `planning-enforcement.ts`, (2) creating the slash command file `opencode/commands/plan-deep-research.md`, and (3) updating `opencode/agents/headwrench.md` to list `plan-deep-research` as a fourth plan type. These three changes make the mode accessible to users via `/plan-deep-research`.

## Scope

**Edit:**
- `opencode/plugins/planning-enforcement.ts` — add `plan_deep_research` tool after `plan_collaborative`
- `opencode/agents/headwrench.md` — add `plan-deep-research` bullet to the Plan Types section

**Write (new file):**
- `opencode/commands/plan-deep-research.md` — slash command

**Reference (do not modify):**
- `opencode/plugins/planning-enforcement.ts` (lines 154–171) — `plan_collaborative` tool pattern to mirror
- `opencode/commands/plan-collaborative.md` — command file pattern to mirror

## Constraints

### Plugin tool (planning-enforcement.ts)

- Insert immediately after the closing `}` of the `plan_collaborative` tool definition (after line 171), before `activate_plan`
- Tool name: `plan_deep_research`
- Description: `"Start a /plan-deep-research planning session. Reads the plan-deep-research DAG and activates the research planning workflow for the current session."`
- DAG path: `~/.config/opencode/planning/plan-deep-research/plan.json`
- Pattern: identical to `plan_collaborative` — read the DAG file, call `activateDag(dagContent, server)`, return the prompt text

### Slash command (plan-deep-research.md)

- Mirror `opencode/commands/plan-collaborative.md` exactly, substituting:
  - Command name: `plan-deep-research`
  - Tool called: `plan_deep_research()`
  - Description: research-planning variant (one line)

### headwrench.md update

- Location: Plan Types section, after the Collaborative bullet (currently ends around line 69)
- Add a new bullet: `**Deep Research** — research-centric variant of Collaborative. Planning DAG: research-intake → clarify (loop) → research-gate (gate) → agent-routing → finalize. The activated session executes research iteratively: HW dispatches @DeepResearcher each iteration, surfaces findings, user steers. Terminal output is a completed research report.`

## Todolist

- [ ] Read `opencode/plugins/planning-enforcement.ts` lines 140–185 to find exact insertion point for the new tool
- [ ] Read `opencode/commands/plan-collaborative.md` to get exact command file structure
- [ ] Read `opencode/agents/headwrench.md` lines 60–75 to confirm exact location for the new Plan Types bullet
- [ ] Edit `planning-enforcement.ts` — insert `plan_deep_research` tool after `plan_collaborative`
- [ ] Write `opencode/commands/plan-deep-research.md`
- [ ] Edit `opencode/agents/headwrench.md` — add Deep Research bullet to Plan Types section
- [ ] [🚫 GATE] Verify: `plan_deep_research` appears in planning-enforcement.ts export/tool list (grep or read); command file exists; headwrench.md shows 4 plan types

## Delegation

**Agent:** @JuniorDev (parallel × 3)
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/plugins/planning-enforcement.ts` (lines 140–185), `opencode/commands/plan-collaborative.md`, `opencode/agents/headwrench.md` (lines 60–75)
- Goal: Add `plan_deep_research` tool to planning-enforcement.ts, write plan-deep-research command file, add Deep Research bullet to headwrench.md Plan Types — all per the exact constraints above
- Constraints: Plugin tool insertion point is immediately after `plan_collaborative` closes (before `activate_plan`); headwrench bullet must match the description text in constraints verbatim; command file must mirror plan-collaborative.md structure exactly
- Verify: All three changes exist; no existing functionality is altered; planning-enforcement.ts remains syntactically valid TypeScript

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
