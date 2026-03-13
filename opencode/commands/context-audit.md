---
description: "Run a unified interactive context audit for inbox promotion, archival, retrofits, and context review hygiene."
agent: headwrench
---

$ARGUMENTS

Run the context-management audit protocol defined in `opencode/protocols/context-management.md`.

This command is the authoritative replacement for legacy inbox-only review flow. It absorbs `/inbox` promotion behavior into one interactive audit with minimal cognitive burden: gather decisions during review, then execute only after one final user approval.

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

For each active inbox item (or when `[INBOX]` is present), show exactly this format:

```
[INBOX] inbox/ask-only-subagent-pattern.md
  Topic: agent-pattern | Created: 2026-03-10 | Session: agent-permissions-and-insurgent
  Summary: "Some subagents are designated ask-only — HW must get user confirmation..."
  → Promote to: [G] global context / [L] local context / [D] discard / [S] skip for now
```

Collect one-letter user decisions per item.

## Step 4 — Proposed Archive Actions

For each completed session with archivable notes, show exactly this format:

```
[ARCHIVE] improve-planning-system (7 notes, session completed)
  Proposed: Move .opencode/sessions/improve-planning-system/notes/ → .opencode/archive/improve-planning-system/notes/
  Promotion candidates: subtask-01-amend-overhaul.md (HIGH), subtask-04-parallel-delegation-schema.md (MEDIUM)
  → Promote any to inbox before archiving? [y/n per file]
```

Collect per-file promotion decisions and archival intent.

## Step 5 — User Approval

Present one consolidated execution plan containing all proposed actions from Steps 2–4 (promotions, retrofits, archival moves, discards, skips, and review updates) and ask for a single final approval.

Execute only approved actions.

## Step 6 — Execution

For each approved action, execute as follows:

- **Inbox promotion**: Create a new context file (global or local) with YAML header; mark the source inbox item `superseded_by: <new-context-file>`.
- **Session archival**: Create `.opencode/archive/{session-name}/notes/` if needed; move note files from session notes.
- **Inbox retrofits**: Add required YAML front-matter to inbox files missing headers.
- **Promoted-then-archive**: Create an inbox item for selected session-note findings, then archive the source session note.

When writing or updating metadata, follow the field definitions and invariants in `opencode/protocols/context-management.md`.

## Step 7 — Summary

Report final results in this structure:
- N inbox items promoted (X global, Y local)
- N notes archived from M sessions
- N inbox items retrofitted
- N items discarded

If any actions were deferred or skipped, list them explicitly under a final “Deferred” subsection.
