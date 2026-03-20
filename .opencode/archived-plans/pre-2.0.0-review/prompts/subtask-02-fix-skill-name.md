<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Fix skill display name in headwrench.md

## Objective

The `opencode/agents/headwrench.md` file references the delegation skill as "agent-delegation-expert skill" in its Planning section. The actual skill invocation is `skill("delegation")` — the skill name is simply `delegation`. Update the display text to match the real invocation so users aren't confused when they look at the skill tool call.

## Scope

- **Edit:** `opencode/agents/headwrench.md`

## Constraints

- Locate the phrase "agent-delegation-expert skill" (or similar) and replace the display reference with "delegation"
- Do not rewrite surrounding prose; update only the skill name reference
- The change should make the text consistent with how `skill("delegation")` is called in practice

## Todolist

- [ ] Read `opencode/agents/headwrench.md` to locate the skill name reference
- [ ] Replace "agent-delegation-expert skill" with "delegation" (preserving surrounding prose)
- [ ] Verify the edit is the only change made to the file

## Delegation

**Agent:** @QuickDoc | **Tier:** haiku | Single-file doc edit with a targeted name correction.

## Advance

Call `next_step()` when this subtask is complete.
