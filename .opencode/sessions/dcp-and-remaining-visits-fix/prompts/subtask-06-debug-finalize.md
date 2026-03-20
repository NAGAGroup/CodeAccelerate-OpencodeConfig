<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 06 — Update debug finalize.md

## Objective

The debug planning workflow's finalize node hardcodes `"remaining_visits": 5` on the diagnose node and presents it to the user as "max 5 diagnose visits" with no explanation of how to change it or recover if it's exhausted. Update it to use the default of 3, add a user-ask step so HW can confirm the count during planning, and document `reset_counters()` recovery.

## Scope

- **Edit:** `opencode/planning/plan-debug/prompts/finalize.md`
- **Excluded:** All other files

## Constraints

- Replace `"remaining_visits": 5` in the `plan.json` template with `"remaining_visits": 3` (the default).
- Add a step before the file-writing step instructing HW to ask the user if they want a different `remaining_visits` count for the diagnose node (default: 3). One question, asked directly. Use the user-confirmed count when writing `plan.json`.
- In the presentation step (step 4), update "max 5 diagnose visits" to reflect the default of 3 and note that the count was confirmed with the user.
- After the `plan.json` template in step 2, add a note explaining `reset_counters()`: if the diagnose loop exhausts its counter and the DAG enters `failed` state, the user can call `reset_counters()` to reset all counters and resume.
- Do not change the session-overview verbatim block, the diagnose/fix/verify prompt instructions, the commit step, or the constraints section.

## Todolist

- [ ] Read `opencode/planning/plan-debug/prompts/finalize.md`
- [ ] Add user-ask step for remaining_visits count before the file-writing step
- [ ] Replace `remaining_visits: 5` with `remaining_visits: 3` in the plan.json template
- [ ] Add `reset_counters()` recovery note after the plan.json template
- [ ] Update presentation step to reflect default=3 and user-confirmed count
- [ ] Verify the file reads correctly end-to-end

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-debug/prompts/finalize.md`
- Goal: Replace hardcoded remaining_visits: 5 with default=3, add user-ask, add reset_counters() recovery note
- Constraints: See constraints section above; do not touch session-overview verbatim block
- Verify: remaining_visits: 3, user-ask step present, reset_counters() documented, presentation updated

## Advance

Call `next_step()` when this subtask is complete.
