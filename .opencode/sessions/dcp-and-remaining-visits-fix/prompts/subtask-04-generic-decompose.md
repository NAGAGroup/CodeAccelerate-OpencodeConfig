<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04 — Update generic decompose.md

## Objective

The generic planning workflow's decompose node currently has no guidance about loop-capable nodes or `remaining_visits` counters. Add a step instructing HW to identify which subtasks will produce loop-capable nodes in the session plan (nodes whose `next` array includes themselves or a prior node), and to ask the user whether a non-default `remaining_visits` count is wanted for each. The default is 3. User-confirmed counts should be noted in context for use by the finalize node.

## Scope

- **Edit:** `opencode/planning/plan-generic/prompts/decompose.md`
- **Excluded:** All other files

## Constraints

- Add the loop-node identification step after the subtask decomposition step (step 3) and before presenting the draft to the user (step 4).
- The step should instruct HW to: (1) identify any subtasks that will produce looping nodes, (2) note the default of 3, (3) ask the user if a different count is wanted for any of them — one question per node if there are multiple.
- Keep the step concise — it's a brief addition, not a full new section.
- Do not change any other steps or constraints.

## Todolist

- [ ] Read `opencode/planning/plan-generic/prompts/decompose.md`
- [ ] Add loop-node identification step between step 3 and step 4
- [ ] Verify the step flow still reads logically

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-generic/prompts/decompose.md`
- Goal: Add a step to identify loop-capable nodes and ask user for per-node `remaining_visits` count (default: 3)
- Constraints: Insert between existing step 3 and step 4; keep concise
- Verify: File reads logically with the new step in place

## Advance

Call `next_step()` when this subtask is complete.
