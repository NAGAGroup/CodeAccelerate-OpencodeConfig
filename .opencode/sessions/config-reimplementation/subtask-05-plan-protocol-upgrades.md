# Subtask 05 — plan-protocol-upgrades

## Delegation
**Agent:** @config-implementer  
**Reason:** Multi-file protocol updates requiring targeted additions to plan-init.md, plan-shared.md, and commands/plan.md — standard implementation work.

---

## Objective

Upgrade the planning protocols to incorporate three research findings:

1. **Plan mode differentiation** — add plan/build/autoaccept modes to `plan-init.md`. Each mode produces different typed artifacts and has different autonomy levels. Add mode selection as a question during Phase 1 orientation, and document what each mode means.
2. **Multi-step 3-pass synthesis** — upgrade `plan-shared.md` Step 3 (sequential thinking synthesis) to explicitly use 3 passes: (1) decompose → enumerate subtasks, (2) validate → check dependencies and ordering, (3) optimize → identify parallelization opportunities and prune redundancy.
3. **Pre-execution validation gate** — add a pre-execution validation step to `plan-shared.md` or `plan-end.md` that checks: no circular dependencies in subtask ordering, all delegation assignments are valid agents, circuit breaker threshold is set, all gates have preceding content.

---

## Scope

### In Scope
- `opencode/protocols/plan-init.md`
- `opencode/protocols/plan-shared.md`
- `opencode/commands/plan.md` (minor update if needed to reflect mode)

### Out of Scope
- `plan-end.md`, `plan-generic.md`, `plan-collaborative.md`, `plan-debug.md`, `plan-deep-research.md`
- Implementing full DAG/JSON plan artifacts (Phase 3)
- Changing the overall 4-phase structure of planning

---

## Patterns

- Mode differentiation: add a `## Session Mode` section to plan-init.md output
- 3 modes: `plan` (full planning, no execution), `build` (planning + execution), `autoaccept` (execute without user confirmation gates)
- Default mode: `build`
- 3-pass synthesis: number each pass explicitly in the sequential thinking steps
- Pre-execution validation: a checklist of 4-5 items checked by HeadWrench before writing session files

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT remove the existing 4-step plan-init.md structure — add mode selection as a new step or integrate into Step 4
- Do NOT change the plan-shared.md steps 1, 2, 4, 5 — only enhance Step 3
- Pre-execution validation goes in plan-end.md (before writing session files) OR as a new step in plan-shared.md — implementer should choose the more natural placement
- Mode descriptions should be concise: 1-2 sentences each

---

## Context Files

- `opencode/protocols/plan-init.md` — current plan-init steps to understand integration point for mode selection
- `opencode/protocols/plan-shared.md` — current synthesis steps to understand where to add 3-pass structure
- `opencode/protocols/plan-end.md` — to understand where pre-execution validation fits
- `opencode/commands/plan.md` — to understand the 4-phase flow and invariants

---

## Success Criteria

- `plan-init.md` includes mode selection (plan/build/autoaccept) with clear descriptions and default: build
- `plan-shared.md` Step 3 explicitly names 3 passes: decompose → validate → optimize
- A pre-execution validation checklist exists (either in plan-shared.md Step 3 post-synthesis or in plan-end.md before writes)
- `plan.md` command references the mode if relevant (or notes no change needed)

---

## Todolist

- [ ] Read plan-init.md, plan-shared.md, plan-end.md, commands/plan.md
- [ ] Add mode selection to `plan-init.md` (plan/build/autoaccept, default: build)
- [ ] Enhance `plan-shared.md` Step 3 with explicit 3-pass synthesis (decompose → validate → optimize)
- [ ] Add pre-execution validation checklist to appropriate location (plan-end.md or plan-shared.md)
- [ ] Update `commands/plan.md` if mode affects the invariants section
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
