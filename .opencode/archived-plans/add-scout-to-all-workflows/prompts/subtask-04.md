<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 4 — plan-deep-review: Reposition Existing Scout

## Objective

Move the existing `scout` node from after `clarify` to directly after `load-guidelines`, update its `next` to `review-intake`, remove it from clarify's exit path, and remove the orphaned `synthesize` node.

## Scope

**Edit:**
- `~/.config/opencode/planning/plan-deep-review/plan.json`

**Delete:**
- Remove `synthesize` node entry entirely
- Remove all references to `synthesize` in `next` arrays

## Constraints

- Scout's new position: after `load-guidelines`, before `review-intake`
- Scout's `next` → `review-intake`
- Remove `scout` from clarify's `next` array
- Remove `synthesize` node entirely — it becomes orphaned when scout moves
- scout prompt file at `prompts/scout.md` already exists — do not recreate it

## Todolist

- [ ] Move scout node in plan.json to after load-guidelines
- [ ] Update scout's next → review-intake
- [ ] Remove scout from clarify's next array
- [ ] Remove synthesize node entry
- [ ] Remove all synthesize references from next arrays

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `~/.config/opencode/planning/plan-deep-review/plan.json`
- Goal: Reposition scout to after load-guidelines; remove orphaned synthesize; update next arrays
- Constraints: scout.next → review-intake; remove synthesize entirely; no new prompt file needed
- Verify: scout is after load-guidelines; no synthesize references remain; plan.json is valid JSON

## Advance

Call `next_step()` when this subtask is complete.
