<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 1 — plan-collaborative: Add Scout Node + Prompt

## Objective

Insert a `scout` node directly after `load-guidelines` in plan-collaborative, create the scout prompt file, and update the clarify exit path.

## Scope

**Edit:**
- `~/.config/opencode/planning/plan-collaborative/plan.json`

**Write:**
- `~/.config/opencode/planning/plan-collaborative/prompts/scout.md`

## Constraints

- Scout node must be inserted between `load-guidelines` and `idea-intake`
- Scout's `next` should be `idea-intake`
- Scout prompt file should be a general-purpose scout prompt (similar to plan-generic's scout.md but adapted for the collaborative planning context — planning agents need project structure, conventions, and existing workflow awareness)
- Remove `scout` from clarify's `next` array (clarify exits to `agent-routing` only)
- Do not add a `synthesize` node — scout findings feed directly into idea-intake/clarify

## Todolist

- [ ] Insert `scout` node into `plan.json` after `load-guidelines`
- [ ] Write `prompts/scout.md` with general-purpose scout prompt
- [ ] Update clarify's `next` array to remove `scout` reference

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `~/.config/opencode/planning/plan-collaborative/plan.json`, `~/.config/opencode/planning/plan-generic/prompts/scout.md`
- Goal: Insert scout node after load-guidelines, create prompt file, update clarify exit
- Constraints: Follow existing plan.json structure exactly; scout next → idea-intake; no synthesize node
- Verify: plan.json has scout node after load-guidelines; prompt file exists; clarify has no scout in next

## Advance

Call `next_step()` when this subtask is complete.
