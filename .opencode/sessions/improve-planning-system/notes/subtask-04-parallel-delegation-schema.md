# Subtask 04 — Parallel Delegation Schema

## What was done

Added parallel group delegation as a first-class opt-in feature to the planning system.

**`opencode/protocols/session-plan-schema.md`**
- New subsection "### Parallel Delegation (Optional)" added under the subtask spec section
- Defined `## Delegation — Parallel Group` header format with named slots (Slot A, Slot B, etc.)
- Each slot specifies: Agent, Model tier, Scope
- Corresponding `## Todolist` format uses per-slot subsections
- Rules: slots must have non-overlapping file scopes; `## Scope` section must list per-slot file lists
- Standard single-agent `## Delegation` format remains valid and unchanged

**`opencode/agents/headwrench.md`**
- Added `### Parallel Group Delegation` subsection to Delegation Rules section
- Detection: check for `## Delegation — Parallel Group` header in subtask file
- Launch: all Task tool calls in ONE message; await all results before proceeding to checkpoint
- Failure rule: if any slot fails, the entire subtask counts as failed for circuit breaker

## Commit
`10bff06` — feat: add parallel group delegation syntax to schema and HW mechanics

## Notes
- No issues during implementation
- Syntax is pure Markdown (no YAML/JSON); slots are plain `### Slot N` headers
- This feature is needed when a subtask has clearly independent file scopes (e.g., editing two unrelated protocols simultaneously)
