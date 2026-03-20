# Subtask 03 — planning-modes

## Delegation
**Agent:** @session-local-implementer (config-implementer)  
**Reason:** Editing planning protocol markdown files with targeted structural additions.

## Objective
Add mode-specific artifact differentiation, a 3-pass synthesis note, pre-execution validation, and circuit breaker behavior clarification to the planning protocols. These are additive improvements to plan-generic.md and plan-shared.md.

## Todolist
- Read `~/.config/opencode/protocols/plan-generic.md` in full
- Read `~/.config/opencode/protocols/plan-shared.md` in full
- Update plan-generic.md: add mode-specific artifact differentiation section and pre-execution validation checklist
- Update plan-shared.md: add 3-pass synthesis pipeline to the sequential thinking step; clarify circuit breaker behavior
- [🚫 GATE] User reviews subtasks 01–03 changes (schema, context management, planning modes) before proceeding to subtask 04

## Scope
**Edit:**
- `~/.config/opencode/protocols/plan-generic.md`
- `~/.config/opencode/protocols/plan-shared.md`

**Write:** none

**Excluded:** All other files. Do not touch plan-init.md, plan-end.md, plan-debug.md, plan-deep-research.md, plan-collaborative.md, or any other file.

## Patterns
- Mode-specific artifacts section for plan-generic.md:
  - `plan` mode → analytical report (no execution artifacts, no spec.json writes)
  - `build` mode → DAG execution plan (spec.json + plan.json DAG artifact with step dependencies)
  - `autoaccept` / `yolo` mode → compressed action sequence with risk flags (flat ordered steps, no DAG)
- Pre-execution validation checklist (add to plan-generic.md, run before "start"):
  1. All context files referenced in subtask ## Context Files sections exist
  2. All agents in ## Delegation sections are defined (in .opencode/agents/ or global agents/)
  3. No circular dependencies in subtask file ordering
  4. spec.json currentSubtask matches first pending subtask
- 3-pass synthesis pipeline (add to plan-shared.md sequential thinking step):
  1. Decompose — identify all subtasks and their scope boundaries
  2. Validate — check for missing dependencies, file conflicts, and over-scoped subtasks
  3. Optimize — reorder for parallelization opportunities and critical-path efficiency
- Circuit breaker behavior: when consecutive failures reach threshold → STOP, surface failing subtask to user with error context, do NOT auto-restart or auto-escalate

## Constraints
- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify any files outside the Scope list above.
- Additive only — do not remove or restructure existing content; insert new sections/notes.
- The 3-pass synthesis pipeline is a guideline for HeadWrench's sequential thinking step, not a mandatory rigid procedure.
- The pre-execution validation checklist is lightweight — HW performs it directly, not via subagent.

## Success Criteria
- plan-generic.md contains a section describing mode-specific artifact types for plan/build/autoaccept modes
- plan-generic.md contains a pre-execution validation checklist with 4 checks
- plan-shared.md sequential thinking step references the 3-pass pipeline (decompose → validate → optimize)
- plan-shared.md documents circuit breaker behavior: threshold hit → stop + surface to user, not auto-restart

## Context Files
- `~/.config/opencode/protocols/plan-generic.md` — primary edit target
- `~/.config/opencode/protocols/plan-shared.md` — primary edit target

---

### Gate
- [🚫 GATE] After this subtask completes, HeadWrench stops and surfaces the following to the user for review:
  - What changed in subtask 01 (session-plan-schema.md + plan-end.md)
  - What changed in subtask 02 (context-management.md + context file frontmatter + headwrench.md)
  - What changed in subtask 03 (plan-generic.md + plan-shared.md)
  - Approval condition: user explicitly approves before proceeding to subtask 04 (skills + specialist crew)

---
*Checkpoint: WIP commit after this subtask completes. Circuit breaker threshold: 3.*
