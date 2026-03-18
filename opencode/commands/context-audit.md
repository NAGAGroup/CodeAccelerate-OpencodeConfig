---
description: "Run a unified interactive context audit for inbox promotion, archival, retrofits, and context review hygiene."
agent: headwrench
---

Run the context-management audit protocol defined in `~/.config/opencode/protocols/context-management.md`. Any scope or filter arguments provided by the user are: `$ARGUMENTS`

Absorb all inbox promotion, archival, retrofit, and context-review decisions into one interactive audit with minimal cognitive burden: gather decisions during review, then execute only after one final user approval.

## Step 1 — Inventory

Scan and count the full context system:
- Inbox items: total / active / superseded / missing headers (retrofit needed)
- Context files: global (`~/.config/opencode/context/`) and local (`.opencode/context/`)
- Session notes: total / in active sessions / in completed sessions (archivable)
- Completed sessions with non-archived notes

## Step 2 — Flag Issues

Present a numbered issue list using only these flag types and meanings:

- `[INBOX]` — N inbox items pending promotion review. Indicates items awaiting human decision on whether to promote to context.
- `[ARCHIVE]` — Completed session `X` has `N` notes ready to archive. Indicates a completed session with notes not yet moved to archive.
- `[RETROFIT]` — Inbox item `file.md` is missing metadata header. Indicates an item that needs YAML front-matter added.
- `[MISCLASSIFIED]` — Inbox item `file.md` appears to be a session outcome, not a reusable pattern. Heuristic: contains single session name prominently with no generalizable rule. Should be moved to session notes or discarded.
- `[SUPERSEDED]` — Inbox item `old.md` is marked `superseded_by: new.md`. Already handled; flagged for optional cleanup.
- `[CONTEXT-REVIEW]` — Context file `file.md` has not been reviewed in >90 days (via `last_reviewed` header). Indicates files that may benefit from a refresh check.

## Step 3 — Process Inbox Queue

For each active inbox item (or when `[INBOX]` is present), use a **single `question` tool call** containing one question per inbox item. Each question should show the item's topic, summary, and session. Use these options for each:

- `Global context` — promote to `~/.config/opencode/context/`
- `Local context` — promote to `.opencode/context/`
- `Discard` — mark superseded, no promotion
- `Skip for now` — leave in inbox, take no action

Do not call the `question` tool once per item. Bundle all inbox items into one call.

## Step 4 — Proposed Archive Actions

When reviewing inbox items for promotion, use the following criteria to determine the correct destination tier:

- **Promote to global context** (`~/.config/opencode/context/`): patterns that are true across **all** projects (e.g., deny-by-default permissions, commit message conventions that apply repo-agnostically)
- **Promote to local context** (`.opencode/context/`): patterns specific to **this** repo (e.g., a project-specific symlink path, agent decisions scoped to this codebase)
- **Keep as session note**: project-specific findings that aren't yet patterns, or time-bounded observations that may not generalise

For each completed session with archivable notes, use a **single `question` tool call** bundling:
- One question per session: "Archive `{session-name}`?" with options Yes / No
- One question per promotion candidate (if any): "Promote `{note-file}` to inbox before archiving?" with options Yes / No

All archive questions go in one call alongside each other.

## Step 5 — User Approval

Present one consolidated execution plan containing all proposed actions from Steps 2–4 (promotions, retrofits, archival moves, discards, skips, and review updates) and ask for a single final approval.

Execute only approved actions.

## Step 6 — Execution

For each approved action, execute as follows:

- **Inbox promotion**: Create a new context file (global or local) with YAML header; mark the source inbox item `superseded_by: <new-context-file>`.
- **Session archival**: Create `.opencode/archive/sessions/{session-name}/` if needed; move the entire session directory from `.opencode/sessions/`.
- **Inbox retrofits**: Add required YAML front-matter to inbox files missing headers.
- **Promoted-then-archive**: Create an inbox item for selected session-note findings, then archive the source session note.
- **Discard**: Set `active: false` on the file's YAML front-matter header and add `discarded_at: {date}`. Do NOT delete the file — it may contain historical context. If the file is in `.opencode/inbox/`, move it to `.opencode/archive/inbox/` if an archive exists.

When writing or updating metadata, follow the field definitions and invariants in `~/.config/opencode/protocols/context-management.md`.

## Step 7 — Summary

Report final results in this structure:
- N inbox items promoted (X global, Y local)
- N notes archived from M sessions
- N inbox items retrofitted
- N items discarded

If any actions were deferred or skipped, list them explicitly under a final “Deferred” subsection.
