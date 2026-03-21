<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 5 — plan-debug: Reposition context-gather → scout (after load-guidelines)

## Objective

Rename the existing `context-gather` node to `scout` in plan-debug, reposition it to after `load-guidelines`, update its `next` to `bug-intake`, and remove it from its current position after `bug-intake`.

## Scope

**Edit:**
- `~/.config/opencode/planning/plan-debug/plan.json`

## Constraints

- Rename `context-gather` → `scout` everywhere it appears (node ID, next references)
- New position: after `load-guidelines`, before `bug-intake`
- Scout's `next` → `bug-intake`
- Remove any `scout` reference from `bug-intake`'s exit (it's now after load-guidelines, not after bug-intake)
- Keep `prompts/context-gather.md` as-is — do not rename or rewrite the prompt file (it has broader scope appropriate for early context gathering)
- Do not add a `synthesize` node

## Todolist

- [ ] Rename context-gather → scout in node ID
- [ ] Move scout node to after load-guidelines
- [ ] Update scout's next → bug-intake
- [ ] Remove any scout reference from bug-intake's exit

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `~/.config/opencode/planning/plan-debug/plan.json`
- Goal: Rename context-gather → scout; reposition to after load-guidelines; update next references
- Constraints: scout.next → bug-intake; do not rename prompt file; no synthesize node
- Verify: scout is after load-guidelines; no duplicate scout entries; plan.json is valid JSON

## Advance

Call `next_step()` when this subtask is complete.
