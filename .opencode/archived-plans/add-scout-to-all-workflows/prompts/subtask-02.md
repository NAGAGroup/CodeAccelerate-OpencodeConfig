<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 2 — plan-deep-research: Add Scout Node + Prompt

## Objective

Insert a `scout` node directly after `load-guidelines` in plan-deep-research, create the scout prompt file, and update the clarify exit path.

## Scope

**Edit:**
- `~/.config/opencode/planning/plan-deep-research/plan.json`

**Write:**
- `~/.config/opencode/planning/plan-deep-research/prompts/scout.md`

## Constraints

- Scout node must be inserted between `load-guidelines` and `research-intake`
- Scout's `next` should be `research-intake`
- Scout prompt should be research-focused: scouts gather context about the codebase/project to inform research direction (project structure, relevant docs, existing patterns)
- Remove `scout` from clarify's `next` array (clarify exits to `agent-routing` only)
- Do not add a `synthesize` node

## Todolist

- [ ] Insert `scout` node into `plan.json` after `load-guidelines`
- [ ] Write `prompts/scout.md` with research-focused scout prompt
- [ ] Update clarify's `next` array to remove `scout` reference

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `~/.config/opencode/planning/plan-deep-research/plan.json`, `~/.config/opencode/planning/plan-generic/prompts/scout.md`
- Goal: Insert scout node after load-guidelines, create prompt file, update clarify exit
- Constraints: Scout next → research-intake; no synthesize node
- Verify: plan.json has scout after load-guidelines; prompt file exists; clarify has no scout in next

## Advance

Call `next_step()` when this subtask is complete.
