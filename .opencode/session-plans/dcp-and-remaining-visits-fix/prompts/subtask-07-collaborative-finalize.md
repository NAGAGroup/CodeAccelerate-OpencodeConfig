<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 07 — Update collaborative finalize.md

## Objective

The collaborative planning workflow's finalize node produces explore nodes with loopback `next` arrays but no `remaining_visits` counter. The session-overview verbatim block also has no mention of `remaining_visits` or `reset_counters()`. Add a note to the explore node guidance that `remaining_visits` can optionally be added to loop nodes, and add a brief mention of `reset_counters()` recovery to the session-overview verbatim block.

## Scope

- **Edit:** `opencode/planning/plan-collaborative/prompts/finalize.md`
- **Excluded:** All other files

## Constraints

- The session-overview verbatim block (lines 90–116) is marked "write verbatim — do not modify." To add `remaining_visits`/`reset_counters()` info, add it to the "What This Session Is" bullet list — one new bullet explaining that if an explore node accumulates too many unresolved visits, `remaining_visits` can be set on it (default: 3) and `reset_counters()` called to recover if exhausted.
- The explore node `plan.json` template currently has no `remaining_visits` on explore nodes. Do NOT add it to the template — collaborative loops are user-driven and unbounded by design. Instead, add a note after the template explaining that `remaining_visits` can optionally be added to any explore node if bounded looping is desired.
- Do not modify the spec.md stub, spec-gate, finalize-output, or Session Authority section.
- The verbatim constraint on session-overview.md means this subtask is editing the verbatim block in finalize.md — the instruction to write it verbatim will then include the new bullet. The verbatim content itself is being updated.

## Todolist

- [ ] Read `opencode/planning/plan-collaborative/prompts/finalize.md`
- [ ] Add `remaining_visits`/`reset_counters()` bullet to the session-overview verbatim block in finalize.md
- [ ] Add optional `remaining_visits` note after the plan.json template (not inside it)
- [ ] Verify the verbatim block still reads coherently with the new bullet
- [ ] Verify no other sections were changed

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-collaborative/prompts/finalize.md`
- Goal: Add remaining_visits/reset_counters() note to session-overview verbatim block and an optional-use note after the plan.json template
- Constraints: Do not add remaining_visits to the plan.json template; do not touch spec.md stub, spec-gate, finalize-output, or Session Authority section
- Verify: New bullet in verbatim block, optional note after template, no other changes

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
