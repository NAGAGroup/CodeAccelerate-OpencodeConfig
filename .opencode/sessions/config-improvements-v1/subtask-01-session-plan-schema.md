# Subtask 01 — session-plan-schema

## Delegation
**Agent:** @session-local-implementer (config-implementer)  
**Reason:** File editing of markdown protocol documents; requires careful structural additions to existing schemas.

## Objective
Extend the session plan schema to support DAG-based execution artifacts, richer spec.json state tracking, and add two new required sections (## Context Files and ## Success Criteria) to the subtask file template.

## Todolist
- Read `~/.config/opencode/protocols/session-plan-schema.md` in full before making any edits
- Read `~/.config/opencode/protocols/plan-end.md` in full before making any edits
- Add `plan.json` DAG artifact spec section to session-plan-schema.md
- Extend spec.json schema definition in session-plan-schema.md with step_outputs, completed_steps, failed_steps, last_checkpoint, and circuit_breaker fields
- Add `## Context Files` and `## Success Criteria` as required sections in the subtask file schema
- Update plan-end.md to include: (a) a step to write plan.json during finalization, and (b) instructions to add ## Context Files + ## Success Criteria sections to each subtask file

## Scope
**Edit:**
- `~/.config/opencode/protocols/session-plan-schema.md`
- `~/.config/opencode/protocols/plan-end.md`

**Write:** none

**Excluded:** All other files. Do not modify headwrench.md, spec.json files in sessions/, or any other protocol.

## Patterns
- Keep the existing document structure and voice — add new sections, don't rewrite existing ones
- New plan.json section should appear after the existing spec.json section
- Use fenced code blocks for schema examples (JSON or YAML as appropriate)
- ## Context Files goes after ## Constraints in the subtask file section; ## Success Criteria goes after ## Todolist

## Constraints
- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT modify any files outside the Scope list above.
- Additive changes only — do not remove or rename existing sections; only add new content.
- The plan.json DAG artifact is optional during session bootstrap (not all sessions need a DAG) but required when plan-end.md creates it.
- circuit_breaker state field values: "CLOSED" | "OPEN" | "HALF-OPEN"

## Success Criteria
- session-plan-schema.md contains a `plan.json` section with step_id, dependencies[], parallelizable_with[], success_criteria, context_boundary fields documented
- session-plan-schema.md spec.json schema section includes: step_outputs{}, completed_steps[], failed_steps[], last_checkpoint (ISO string), circuit_breaker{consecutive_failures, threshold, state}
- session-plan-schema.md subtask file section lists ## Context Files and ## Success Criteria as required sections
- plan-end.md step list includes writing plan.json and populating ## Context Files + ## Success Criteria in subtask files

## Context Files
- `~/.config/opencode/protocols/session-plan-schema.md` — the primary target; read before editing
- `~/.config/opencode/protocols/plan-end.md` — secondary target; read before editing
- `.opencode/sessions/config-improvements-v1/notes/round-01-findings.md` — background on DAG design rationale (reference only, do not edit)

---
*Checkpoint: WIP commit after this subtask completes. Circuit breaker threshold: 3.*
