<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 05 — Update generic finalize.md

## Objective

The generic planning workflow's finalize node has two problems: (1) stale v1 artifacts — references to `activate_session` (a tool that doesn't exist), a `spec.json` file (not part of the current spec), and ambiguous prompt path guidance; and (2) weak `remaining_visits` guidance — just one line with no default, no user-ask reference, no `reset_counters()` recovery. Fix both in one pass.

## Scope

- **Edit:** `opencode/planning/plan-generic/prompts/finalize.md`
- **Excluded:** All other files

## Constraints

**v1 cleanup:**
- Remove step 3 (`activate_session`) entirely — this tool does not exist.
- Remove `spec.json` from the list of files to write (step 2). The session spec is `index.md` only.
- All prompt files (session-overview AND subtask prompts) must be specified as living under `.opencode/sessions/{session-name}/prompts/`. The current spec puts subtask files flat under `.opencode/sessions/{session-name}/` — fix this to `prompts/subtask-NN-{name}.md`.
- In `plan.json` (step 4), prompt paths must be fully qualified: `.opencode/sessions/{session-name}/prompts/session-overview.md` and `.opencode/sessions/{session-name}/prompts/subtask-NN-{name}.md`.

**remaining_visits guidance:**
- Expand the current one-liner "include `remaining_visits` on any loop-capable nodes" to specify:
  - Default value is 3
  - Use the user-confirmed count from the decompose node if the user specified one; otherwise use 3
  - After the `plan.json` spec block, add a note explaining `reset_counters()`: if a session's loop node exhausts its counter and the DAG enters `failed` state, the user can call `reset_counters()` to reset all counters and resume.

**Do not change** the delegation assignment step, the git commit step, the subtask prompt structure requirements, or the final overview presentation step.

## Todolist

- [ ] Read `opencode/planning/plan-generic/prompts/finalize.md`
- [ ] Remove `activate_session` step
- [ ] Remove `spec.json` from the file list
- [ ] Fix prompt paths to all be under `prompts/` subdirectory
- [ ] Fix `plan.json` prompt path examples to use fully qualified paths
- [ ] Expand `remaining_visits` guidance with default=3, user-confirmed counts, and `reset_counters()` recovery note
- [ ] Verify the file reads correctly end-to-end

## Delegation

**Agent:** @QuickDoc
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-generic/prompts/finalize.md`
- Goal: Remove v1 cruft (activate_session, spec.json, flat prompt paths) and expand remaining_visits guidance
- Constraints: See constraints section above; do not change unrelated steps
- Verify: No activate_session, no spec.json, all prompt paths under prompts/, remaining_visits has default + reset_counters() note

## Advance

Call `next_step()` when this subtask is complete.
