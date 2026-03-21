<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 06: Add Loop Guidance to plan-debug hypothesis-form.md

## Objective

The debug planning flow produces execution sessions that contain the canonical debug loop: test → diagnose → fix → verify, where the diagnose+fix leg loops back on failure. The `hypothesis-form.md` node is where the planning agent decides what that debug session loop structure looks like — it proposes a root cause and the investigation approach. Add a section to `files/planning/plan-debug/prompts/hypothesis-form.md` that instructs the planning agent to explicitly design the loop structure for the debug execution session it is creating: identify the loop head (first node to repeat), the exit condition (verified passing), the `remaining_visits` count, and the back-loop target.

## Scope

- **Edit:** `files/planning/plan-debug/prompts/hypothesis-form.md`
- **No other files**

## Constraints

- Do not alter the existing hypothesis-formation steps — the agent still needs to formulate a root-cause hypothesis
- The loop design guidance should appear as an additional step or note after hypothesis formulation, before the Advance section
- The guidance should name the canonical debug loop pattern explicitly: test → diagnose → fix → verify (back-loop to test or diagnose on failure)
- Match existing prompt style

## Todolist

- [ ] Read `files/planning/plan-debug/prompts/hypothesis-form.md` fully
- [ ] Add a step or section (e.g., "## Debug Session Loop Design") that instructs the agent:
  - Every debug execution session has at least one loop: the diagnose→fix→verify cycle
  - After forming the hypothesis, explicitly identify: (1) the loop head node, (2) the exit condition ("all verification steps pass"), (3) the back-loop target on failure, (4) the `remaining_visits` count (default: 3)
  - Note this loop structure in the hypothesis summary presented to the user — it will carry forward to the execution session plan
  - If the investigation approach suggests multiple distinct loop cycles (e.g., a data-gather loop followed by a fix loop), identify each separately
- [ ] Insert the section after the hypothesis-formulation steps, before the Advance section
- [ ] Verify no existing content was altered

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `files/planning/plan-debug/prompts/hypothesis-form.md`
- Goal: Add a "## Debug Session Loop Design" section after hypothesis formulation steps instructing the agent to explicitly design the debug execution loop (loop head, exit condition, back-loop target, `remaining_visits`)
- Constraints: Do not alter existing hypothesis-formulation steps; keep new content actionable; match existing style; place before Advance
- Verify: New section present with all four loop design elements; existing content unchanged

## Advance

Call `next_step()` when this subtask is complete.
