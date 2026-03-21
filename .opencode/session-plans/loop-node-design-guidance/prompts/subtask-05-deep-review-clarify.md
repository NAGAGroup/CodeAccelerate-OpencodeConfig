<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 05: Add Loop Guidance to plan-deep-review clarify.md

## Objective

The deep-review planning flow uses `clarify.md` as its loop node. The output session it is designing typically contains a `fix-execute` or `review-execute` loop node where fixes are applied iteratively. Add a section to `files/planning/plan-deep-review/prompts/clarify.md` that instructs the planning agent to identify loop nodes in the review session being designed and confirm `remaining_visits` with the user before advancing to agent-routing.

## Scope

- **Edit:** `files/planning/plan-deep-review/prompts/clarify.md`
- **No other files**

## Constraints

- Do not alter the existing clarify loop mechanics (one question per visit discipline must remain)
- The new content should be brief
- Name the canonical deep-review loop (fix/verify iteration) explicitly
- Match existing prompt style

## Todolist

- [ ] Read `files/planning/plan-deep-review/prompts/clarify.md` fully
- [ ] Add a section (e.g., "## Loop Node Awareness") that instructs the agent:
  - Deep-review sessions typically include a fix-and-verify loop node — confirm `remaining_visits` with the user (default: 3)
  - If the session design includes additional loops (e.g., a multi-pass review loop), identify and confirm `remaining_visits` for each
  - Only one question per visit — `remaining_visits` confirmation counts as a clarifying question
  - All loop node counts must be known before agent-routing
- [ ] Insert the section before the Advance section
- [ ] Verify no existing content was altered

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-deep-review/prompts/clarify.md`
- Goal: Add a "## Loop Node Awareness" section naming the fix-and-verify loop explicitly and instructing the agent to confirm `remaining_visits` with the user (one question per visit)
- Constraints: Do not alter existing one-question-per-visit discipline; keep brief; match existing style; place before Advance
- Verify: New section present; existing content unchanged

## Advance

Call `next_step()` when this subtask is complete.
