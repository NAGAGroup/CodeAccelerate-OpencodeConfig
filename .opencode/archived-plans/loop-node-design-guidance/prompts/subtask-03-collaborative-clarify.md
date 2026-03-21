<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03: Add Loop Guidance to plan-collaborative clarify.md

## Objective

The collaborative planning flow uses `clarify.md` as its loop node — the planning agent loops through it gathering session-design questions before writing the seed plan. But `clarify.md` also governs the structure of the *output* session the agent is designing: that output session typically contains its own loop nodes (e.g., explore→iterate, ideate→refine). Add a section to `files/planning/plan-collaborative/prompts/clarify.md` that instructs the planning agent to identify and explicitly note any loop nodes needed in the session design it is building, and to ask the user about `remaining_visits` for each before advancing to agent-routing.

## Scope

- **Edit:** `files/planning/plan-collaborative/prompts/clarify.md`
- **No other files**

## Constraints

- Do not alter the existing clarify loop mechanics (the "ask one question per visit" discipline must remain intact)
- The new content should appear as a distinct step or note — not mixed into the existing clarify question flow
- It should be brief: the clarify node is a tight loop; the new guidance should not expand it into a multi-step workflow
- Match existing prompt style

## Todolist

- [ ] Read `files/planning/plan-collaborative/prompts/clarify.md` fully
- [ ] Add a section (e.g., "## Loop Node Awareness") that instructs the agent:
  - When gathering session-design context, identify any steps in the planned session that will need to loop (e.g., explore, iterate, refine phases)
  - For each identified loop node: note the proposed `remaining_visits` (default: 3) and include it as one of the clarifying questions if not yet confirmed
  - Only one question per visit — loop node `remaining_visits` confirmation counts as a clarifying question
  - This information must be surfaced before agent-routing so the gate presents a complete picture
- [ ] Insert the section at an appropriate location in the file (after the core question-asking steps, before the Advance section)
- [ ] Verify no existing content was altered

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-collaborative/prompts/clarify.md`
- Goal: Add a "## Loop Node Awareness" section instructing the planning agent to identify loop nodes in the session being designed and confirm `remaining_visits` with the user (one question per visit, counts as a clarifying question)
- Constraints: Do not alter existing clarify loop discipline; keep new content brief; match existing style; place before the Advance section
- Verify: New section present; existing content unchanged

## Advance

Call `next_step()` when this subtask is complete.
