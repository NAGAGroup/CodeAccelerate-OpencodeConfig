# Subtask 03 — fix-commands-critical

## Objective
Fix critical command gaps: add 3-layer todo stack reconstruction and session status check to `continue.md`, align its reload procedure with headwrench.md Session Bootstrap, and add supersession chain validation to `context-remove.md`.

## Scope

### Edit
- `opencode/commands/continue.md`
- `opencode/commands/context-remove.md`

### Excluded
- No changes to any other command files (those are in subtask 04)
- No changes to protocols

## Constraints

### continue.md changes

**H-C1/H-P7 (High) — Add 3-layer todo stack reconstruction:**
`/continue` currently reloads context but does NOT reconstruct the 3-layer todo stack. Add a step that explicitly:
1. Creates/updates Layer 1 (session summary todo) from spec.json + index.md goal
2. Extracts Layer 2 todos from the current subtask file `## Todolist`
3. Creates Layer 3 (fixed 8-step checkpoint todos)
This must mirror the Session Bootstrap procedure in headwrench.md exactly.

**L-C1 (Low) — Add completed-session status check:**
At the very start of `/continue`, before loading anything, check `spec.json` status. If status is `"completed"`, surface a message: "Session `{name}` is already complete. No work remaining. Consider running `/context-audit` to review session notes for promotion candidates." Then stop — do not load or reconstruct anything.

**M-C5 (Medium) — Align reload procedure with Session Bootstrap:**
Compare the current `/continue` reload procedure with the Session Bootstrap section in headwrench.md. They should be identical in context-loading order (Tier 2 → Tier 3 → Tier 4 → Tier 5). Update `/continue` to match exactly: "Read all active files in `~/.config/opencode/context/` (Tier 2), then `.opencode/context/` (Tier 3), then session notes from in_progress/pending sessions in `.opencode/sessions/*/notes/` (Tier 4), then the current `subtask-NN-{name}.md` file (Tier 5). Skip files with `active: false` or `superseded_by:` set."

### context-remove.md changes

**H-C2/H-P8 (High) — Add supersession chain validation:**
`/context-remove` currently allows deleting a file that other files reference as their `superseded_by` target. This creates orphaned supersession chains. Add a validation step before deletion:
1. After user confirms removal, grep `.opencode/context/`, `opencode/context/`, and `.opencode/inbox/` for any file whose `superseded_by:` field references the file being removed
2. If any dependent files found, surface: "Warning: the following files reference `{filename}` as their `superseded_by` target: [list]. Removing it will orphan their supersession chain. Proceed? (y/n)"
3. If user confirms, remove the file AND update dependent files' `superseded_by:` to `~` (null) with a note "original supersession target removed"
4. If user cancels, abort removal

## Todolist
- [ ] continue.md: add completed-session status check at start (L-C1)
- [ ] continue.md: align reload procedure with Session Bootstrap — 5-tier order (M-C5)
- [ ] continue.md: add 3-layer todo stack reconstruction step (H-C1/H-P7)
- [ ] context-remove.md: add supersession chain validation (H-C2/H-P8)

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — command prose edits with clear spec
