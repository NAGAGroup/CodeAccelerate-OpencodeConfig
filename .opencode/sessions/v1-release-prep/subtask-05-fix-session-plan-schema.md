# Subtask 05 — fix-session-plan-schema

## Objective
Replace two stale agent references in `opencode/protocols/session-plan-schema.md`: the "DocWriter" example on line 155 and the "@CodeWriter" examples in the parallel delegation template around lines 175–183.

## TL;DR
Both DocWriter and CodeWriter agents were deleted. Their names appear in example/template text in the schema file and need to be replaced with generic placeholders.

## Scope
### Edit
- `opencode/protocols/session-plan-schema.md`

### Read
- `opencode/protocols/session-plan-schema.md` (current content)

### Write
- None

### Excluded
- All other files

## Constraints
- Only change the two stale agent references — do not alter any other content
- Use generic, agent-agnostic placeholder language (e.g. "session-local agent", "implementation agent")

## Changes Required

### Change 1 — Line ~155 (DocWriter reference)
**Current text (approximate):**
```
Anti-pattern to avoid: Asking DocWriter to produce a 5000-word document in a single task invocation
```
**Replace with:**
```
Anti-pattern to avoid: Asking any single agent to handle oversized scope (e.g., a 5000-word document or a full-codebase refactor) in one invocation
```
(Adjust phrasing slightly if needed to read naturally in context — the point is: remove "DocWriter", keep the anti-pattern guidance.)

### Change 2 — Lines ~175–183 (@CodeWriter reference)
**Current text (approximate):**
```
### Slot A — [short description]
- **Agent:** @CodeWriter
- **Model tier:** fast
- **Scope:** [specific files/scope slice for this slot]

### Slot B — [short description]
- **Agent:** @CodeWriter
- **Model tier:** fast
```
**Replace both `@CodeWriter` references with:**
```
- **Agent:** [session-local agent name]
```
(Both Slot A and Slot B should use the generic placeholder.)

## Todolist
- [ ] Read opencode/protocols/session-plan-schema.md to find exact line content
- [ ] Fix line ~155: replace DocWriter reference with generic language
- [ ] Fix lines ~175–183: replace @CodeWriter in Slot A with [session-local agent name]
- [ ] Fix lines ~175–183: replace @CodeWriter in Slot B with [session-local agent name]
- [ ] Verify no other stale agent references remain

## Delegation
**Agent:** @session-local-implementer  
**Reason:** Targeted file edit — removes two stale agent references and replaces with generic placeholders.
