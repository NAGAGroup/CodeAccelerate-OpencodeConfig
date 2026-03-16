# Subtask 04 — fix-commands-secondary

## Objective
Fix secondary command gaps across context-audit.md, amend.md, context-list.md, and context-add.md: define the Discard execution path, add promotion criteria, normalize paths, add a commit step, add retroactive-notes exception, add inactive visual indicator, and document context-add conventions.

## Scope

### Edit
- `opencode/commands/context-audit.md`
- `opencode/commands/amend.md`
- `opencode/commands/context-list.md`
- `opencode/commands/context-add.md`

### Excluded
- No changes to continue.md or context-remove.md (those are subtask 03)
- No changes to protocols

## Constraints

### context-audit.md changes

**M-P5 (Medium) — Define Discard execution path in Step 6:**
Step 6 lists "Discard" as an option but doesn't specify what to do. Define it: "Discard means: set `active: false` on the file's YAML header and add `discarded_at: {date}`. Do NOT delete the file — it may contain historical context. If the file is in `.opencode/inbox/`, move it to `.opencode/archive/inbox/` if an archive exists."

**M-P6 (Medium) — Add promotion criteria to Step 4:**
Step 4 reviews items for promotion but gives no criteria for which tier they qualify for. Add guidance:
- **Promote to global context** (`~/.config/opencode/context/`): patterns true across ALL projects (e.g., deny-by-default permissions, HW commit conventions)
- **Promote to local context** (`.opencode/context/`): patterns specific to THIS repo (e.g., symlink path, specific agent decisions)
- **Keep as session note**: project-specific findings that aren't yet patterns, or time-bounded observations

**L-P4/M-C4 (Low/Medium) — Normalize paths:**
Replace relative paths like `opencode/protocols/context-management.md` with `~/.config/opencode/protocols/context-management.md` throughout the file.

### amend.md changes

**L-P3 (Low) — Add commit step after amendment:**
`/amend` edits session files but has no commit step. After the amendment is applied, add: "Commit the amended changes with `git commit -m 'amend: {session-name} — {brief description of amendment}'`. This commit is an addendum to the session record, not a WIP commit."

**M-C2 (Medium) — Add retroactive-notes exception:**
Section 3 (or wherever the scope of amendment is defined) should note: "Exception: adding retroactive session notes (in `.opencode/sessions/{name}/notes/`) is always permitted, even after session completion, as notes are historical records not session plan artifacts."

### context-list.md changes

**M-C1 (Medium) — Add visual inactive indicator:**
Currently, `active: false` entries are shown without any visual distinction. Add: "For any context file with `active: false` in its header, display with a `⚪ [inactive]` prefix. For files with `superseded_by:` set, display with a `→` arrow showing the superseding file: `⚪ [inactive → filename.md]`."

### context-add.md changes

**M-C3 (Medium) — Add context-management.md reference + document session:~ convention:**
Add a reference: "See `~/.config/opencode/protocols/context-management.md` for full YAML header fields, staleness rules, and inbox vs. context destination guidance."

Also document the `session: ~` convention: "Use `session: ~` (null) when the context file applies globally and was not created during a specific named session, or when the originating session name is not known. Use the actual session name (e.g., `session: audit-complete`) when the file was created as part of a specific session."

## Todolist
- [ ] context-audit.md: define Discard execution path in Step 6 (M-P5)
- [ ] context-audit.md: add promotion criteria to Step 4 (M-P6)
- [ ] context-audit.md: normalize paths to ~/.config/opencode/ (L-P4/M-C4)
- [ ] amend.md: add commit step after amendment (L-P3)
- [ ] amend.md: add retroactive-notes exception to amendment scope (M-C2)
- [ ] context-list.md: add visual inactive indicator for active:false entries (M-C1)
- [ ] context-add.md: add context-management.md reference + document session:~ convention (M-C3)

## Delegation
**Agent:** @session-local-implementer
**Model:** TBD by user — command prose edits with clear spec
