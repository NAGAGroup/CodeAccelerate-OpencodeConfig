# Subtask 06: update-agent-routing

## Objective

Update `opencode/planning/plan-collaborative/prompts/agent-routing.md` to align role language with the session-designer framing established by the other rewrites in this session.

## Scope

**File:** `opencode/planning/plan-collaborative/prompts/agent-routing.md`

**Current problem:** The agent-routing node references "the rough goal and open questions identified during this planning session" in a way that could imply the agent should engage with topic content. Minor consistency update needed.

**Required changes:**
1. Ensure the opening role statement uses session-designer language (consistent with the other rewritten prompts)
2. When referencing "open questions," clarify these are session agenda items — not topic research questions
3. Any language that could be read as "analyze the topic" should be tightened

## Constraints

- This is a minor consistency update — do not restructure the node's logic or delegation instructions
- Keep the existing step structure and delegation guidance intact
- Only update role/framing language for consistency

## Todolist

- [ ] Read current `agent-routing.md`
- [ ] Identify any language inconsistent with session-designer framing
- [ ] Update role language for consistency
- [ ] Verify delegation routing logic is untouched

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-collaborative/prompts/agent-routing.md`
- Goal: Minor consistency update. Add a brief role-boundary statement at the top consistent with the session-designer framing. Tighten any language that could be read as "engage with the topic's content." Do not change the delegation routing logic or step structure.
- Constraints: Preserve all existing delegation guidance. Only role/framing language changes.
- Verify: Opening and any topic references use session-designer language; delegation logic is unchanged
