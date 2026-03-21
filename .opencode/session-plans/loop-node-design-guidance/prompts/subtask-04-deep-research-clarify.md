<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04: Add Loop Guidance to plan-deep-research clarify.md

## Objective

The deep-research planning flow uses `clarify.md` as its loop node. The planning agent loops through it gathering session-design questions about the research scope before writing the research plan. The output session it is designing contains a `research-execute` loop node (the agent iterates through research rounds). Add a section to `files/planning/plan-deep-research/prompts/clarify.md` that instructs the planning agent to confirm the `remaining_visits` count for the research-execute loop and to surface any other loop nodes the research session will need.

## Scope

- **Edit:** `files/planning/plan-deep-research/prompts/clarify.md`
- **No other files**

## Constraints

- Do not alter the existing clarify loop mechanics (one question per visit discipline must remain)
- The new content should be brief — clarify is a tight loop
- The `research-execute` loop is the canonical loop in every deep-research session; the guidance should name it explicitly
- Match existing prompt style

## Todolist

- [ ] Read `files/planning/plan-deep-research/prompts/clarify.md` fully
- [ ] Add a section (e.g., "## Loop Node Awareness") that instructs the agent:
  - Every deep-research session has a `research-execute` loop node — confirm `remaining_visits` with the user (default: 3, but research sessions may benefit from more; suggest 4–5 for broad topics)
  - If the session design includes other loop nodes (e.g., a synthesis-refine loop), identify and confirm `remaining_visits` for each
  - Only one question per visit — `remaining_visits` confirmation counts as a clarifying question
  - Surface all loop node counts before agent-routing
- [ ] Insert the section before the Advance section
- [ ] Verify no existing content was altered

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-deep-research/prompts/clarify.md`
- Goal: Add a "## Loop Node Awareness" section naming the `research-execute` loop explicitly and instructing the agent to confirm `remaining_visits` with the user (one question per visit, suggest 4–5 for broad research)
- Constraints: Do not alter existing one-question-per-visit discipline; keep brief; match existing style; place before Advance
- Verify: New section present with explicit `research-execute` mention; existing content unchanged

## Advance

Call `next_step()` when this subtask is complete.
