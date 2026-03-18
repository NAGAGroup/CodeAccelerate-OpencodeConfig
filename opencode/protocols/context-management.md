# Context Management Protocol

## Overview

This protocol defines how context is organized, tiered, and maintained throughout the OpenCode system. It solves three critical problems:

1. **Accumulated session notes overwhelming agents**: Completed-session notes are archived; ContextScout reads only active session notes during planning.
2. **Stale or conflicting information**: Context files and inbox items use explicit `supersedes`/`superseded_by` chains and staleness rules to prevent obsolete data from being read.
3. **Unclear authority and promotion process**: The inbox serves as a staging queue; `/context-audit` is the unified mechanism for promoting, reviewing, and archiving context.

> See the **Conflict Resolution** section below for rules on handling contradictions between context files at different tiers.

---

## Context Tiers

The system defines **5 tiers**, ordered from most stable to most ephemeral. All agents read Tiers 1–4 during planning; Tier 5 is injected at runtime for the current subtask only.

| Tier | Name | Location | Stability | Reading Rule |
|------|------|----------|-----------|-------------|
| 1 | Global Config | `~/.config/opencode/protocols/`, `~/.config/opencode/agents/`, `~/.config/opencode/commands/`, `~/.config/opencode/opencode.json` | Very high | Always read; no staleness mechanism |
| 2 | Global Context | `~/.config/opencode/context/` | High | Permanent, user-curated; read by all projects |
| 3 | Local Context | `.opencode/context/` | High | Permanent, project-specific; read by agents in this project |
| 4 | Session Notes | `.opencode/sessions/*/notes/` | Session-scoped | Read only from sessions where `spec.json` has `status: in_progress` or `status: pending`; archived when session completes |
| 5 | Subtask File | `.opencode/sessions/{name}/subtask-NN-{name}.md` | Always fresh | Injected at runtime; current task scope only |

### The Inbox (Staging Queue)

**`.opencode/inbox/` is NOT a tier.** It is a write-only staging queue for candidate context items. Agents do not read the inbox during normal operation. Items are promoted from the inbox into Tier 2 (global context) or Tier 3 (local context) via the `/context-audit` command.

### The Archive (Historical Record)

**`.opencode/archive/` is NOT a tier.** It stores completed-session notes for historical reference. The archive is never read during planning — it exists purely as a recovery point should historical context be needed.

---

## Inbox vs Context Destinations

Use this decision tree when writing a new context item:

| A finding is... | Goes in... |
|-----------------|-----------|
| A pattern or rule reusable across any project | `~/.config/opencode/context/` (global, Tier 2) |
| A project-specific fact or convention | `.opencode/context/` (local, Tier 3) |
| A candidate that needs human review first | `.opencode/inbox/` (staging queue) |
| A session-specific finding (not generalizable) | `.opencode/sessions/{name}/notes/` (Tier 4) |

**Rule**: Checkpoints always write to the inbox (staging), never directly to context. Human review via `/context-audit` is what moves items into permanent context.

> **When in doubt, write to inbox — never directly to context/ without human review.**

---

## Metadata Headers (YAML Front-Matter)

All files in `.opencode/inbox/` and `.opencode/context/` directories (both global and local) must include a YAML front-matter block for auditability. New files written after this protocol takes effect must include it. Existing files will be retrofitted during cleanup.

### Inbox Item Header

```yaml
---
topic: short-topic-tag
session: session-name-that-created-this
created: YYYY-MM-DD
active: true
supersedes: ~
superseded_by: ~
---
```

### Context File Header (Tier 2 and Tier 3)

```yaml
---
topic: short-topic-tag
tier: global          # or: local
promoted_from: inbox  # or: direct (written directly to context/)
session: session-name-origin
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
supersedes: ~
superseded_by: ~
---
```

### Field Definitions

| Field | Files | Required | Description |
|-------|-------|----------|-------------|
| `topic` | both | Yes | 2–4 word topic tag (e.g., `agent-permissions`, `slash-commands`). Used for organizing and flagging related items. |
| `session` | both | Yes | Name of the session that created this item. Enables tracking origin and cleanup. |
| `created` | both | Yes | ISO 8601 date (YYYY-MM-DD) when the item was first written. |
| `active` | inbox | No | Boolean; default `true` when absent. Set to `false` to deactivate an inbox item without deleting it. Inactive items are skipped during `/context-audit` reviews. |
| `tier` | context | Yes | `global` or `local`. Must match the directory location. Explicit to catch misplacements. |
| `promoted_from` | context | Yes | `inbox` (item came through the promotion queue) or `direct` (written directly to context, bypassing the inbox — used when a context file was written directly during session bootstrap, checkpoint, or when you write a context file as part of a session plan). Tracks provenance. |
| `last_reviewed` | context | No | ISO 8601 date. Updated by `/context-audit` each time the item is reviewed. Helps identify stale files. |
| `supersedes` | both | No | Filename of the older item this replaces. Use `~` when not applicable. Enables explicit version chains. |
| `superseded_by` | both | No | Filename of the newer item that replaces this. Use `~` otherwise. ContextScout skips items where this is set. |

### Backwards Compatibility

If `active` is absent on an inbox item, treat it as `active: true`. Existing inbox files without headers remain active by default until retrofitted.

---

## Staleness Rules

### Session Notes (Tier 4)

Session notes follow the lifecycle of their session:

| Session Status | Note Status | Action |
|----------------|-------------|--------|
| `in_progress` | Active | Read during planning |
| `pending` (not started) | Active | Read during planning |
| `completed` | Archivable | Move entire session directory to `.opencode/archive/sessions/{session-name}/`; no longer read during planning |

**Archival trigger**: Manual, via `/context-audit` command. The session-close checkpoint does NOT auto-archive — archival requires human review because valuable findings should be promoted to persistent context before the notes are archived.

**Promotion path**: Before a session's notes are archived, findings that benefit future sessions should be promoted. Write a new inbox item summarizing the finding; the human then approves promotion to global or local context during the next `/context-audit` run. The original session note is then archived.

### Context Files (Tiers 2 and 3)

Context files do not expire based on age. They remain readable indefinitely unless:
1. Explicitly superseded by setting `superseded_by: new-file.md` in the header, or
2. Deleted during a `/context-audit` review.

### Config Files (Tier 1)

No staleness mechanism. Config files are updated via protocol sessions whenever they need to change.

---

## Conflict Resolution

When two items (inbox or context) address the same topic and one supersedes the other:

1. **New item** includes `supersedes: old-item.md` in its header.
2. **Old item** is updated to include `superseded_by: new-item.md` in its header.
3. **ContextScout skips** items where `superseded_by:` is set to a non-tilde value.
4. **Old item is retained** in place (not deleted) for historical reference.

When a genuine contradiction exists (neither item is definitively correct), both items should be resolved in the same session. Write a new authoritative item that supersedes both, explaining the resolution.

---

## Archival Process

### Destination

```
.opencode/archive/sessions/{session-name}/
```

Example: Session `improve-planning-system` moves entirely to `.opencode/archive/sessions/improve-planning-system/`

### Trigger

Manual, via `/context-audit` command. You execute file moves and directory creation after the user approves each action.

### Steps

1. `/context-audit` identifies completed sessions with non-archived notes.
2. For each note, the user decides: **promote to inbox** (for later context promotion), **archive only**, or **keep in session**.
3. For promotion candidates: create a new inbox item summarizing the finding; the user reviews the summary.
4. Once promotion is settled, move the entire session directory from `.opencode/sessions/{name}/` to `.opencode/archive/sessions/{name}/`.
5. The session's `spec.json` is not modified by archival (it remains a historical record).

### What Is NOT Archived

- Sessions with `status: in_progress` or `status: pending`
- Inbox items (inbox is the queue; items are deactivated or promoted, not archived)
- Context/ files (these are permanent until explicitly deleted or superseded)

---

## ContextScout Reading Scope

When ContextScout performs situational awareness at the start of a planning session or on request:

### In Scope (always read)

- `~/.config/opencode/protocols/` — all protocol files
- `~/.config/opencode/agents/` — all agent definitions
- `~/.config/opencode/commands/` — all slash commands
- `~/.config/opencode/opencode.json` — global configuration
- `~/.config/opencode/context/` — all global context files (Tier 2)
- `.opencode/context/` — all local context files (Tier 3)
- `.opencode/sessions/*/notes/` — only from sessions with `spec.json` showing `status: in_progress` or `status: pending`

### Out of Scope (do not read during planning)

- `.opencode/archive/` — historical only; never read automatically
- `.opencode/sessions/*/notes/` — where that session's `status: completed`
- `.opencode/inbox/` — staging queue; not for agent consumption during normal planning

### Historical Session Context

ContextScout may read `index.md` and `spec.json` from completed sessions to understand project history, but NOT the session's `notes/` directory unless explicitly asked to investigate a specific historical finding.

---

## The `/context-audit` Command

**Location**: `~/.config/opencode/commands/context-audit.md`

**Purpose**: Unified, interactive review of the entire context system. Absorbs legacy inbox management functions. You run the audit, present findings, collect user decisions, and execute approved actions.

### Procedure (7 Steps)

#### Step 1 — Inventory

Scan the entire context system and count:
- Inbox items: total / active / superseded / missing headers (need retrofitting)
- Context files: global (`~/.config/opencode/context/`) and local (`.opencode/context/`)
- Session notes: total / in active sessions / in completed sessions (archivable)
- Completed sessions with non-archived notes

#### Step 2 — Flag Issues

Present a numbered list of issues found. Use the following flag types:

- `[INBOX]` — N inbox items pending promotion review. Indicates items awaiting human decision on whether to promote to context.
- `[ARCHIVE]` — Completed session `X` has `N` notes ready to archive. Indicates a completed session with notes not yet moved to archive.
- `[RETROFIT]` — Inbox item `file.md` is missing metadata header. Indicates an item that needs YAML front-matter added.
- `[MISCLASSIFIED]` — Inbox item `file.md` appears to be a session outcome, not a reusable pattern. Heuristic: contains single session name prominently with no generalizable rule. Should be moved to session notes or discarded.
- `[SUPERSEDED]` — Inbox item `old.md` is marked `superseded_by: new.md`. Already handled; flagged for optional cleanup.
- `[CONTEXT-REVIEW]` — Context file `file.md` has not been reviewed in >90 days (via `last_reviewed` header). Indicates files that may benefit from a refresh check.

#### Step 3 — Process Inbox Queue

For each active inbox item (or on `[INBOX]` trigger), present:

```
[INBOX] inbox/ask-only-subagent-pattern.md
  Topic: agent-pattern | Created: 2026-03-10 | Session: agent-permissions-and-insurgent
  Summary: "Some subagents are designated ask-only — HW must get user confirmation..."
  → Promote to: [G] global context / [L] local context / [D] discard / [S] skip for now
```

User responds with one letter per item.

#### Step 4 — Proposed Archive Actions

For each completed session with archivable notes:

```
[ARCHIVE] improve-planning-system (7 notes, session completed)
  Proposed: Move .opencode/sessions/improve-planning-system/ → .opencode/archive/sessions/improve-planning-system/
  Promotion candidates: subtask-01-amend-overhaul.md (HIGH), subtask-04-parallel-delegation-schema.md (MEDIUM)
  → Promote any to inbox before archiving? [y/n per file]
```

User indicates which files (if any) to promote before archival, and confirms archival.

#### Step 5 — User Approval

User approves or rejects each proposed action. You execute only approved actions.

#### Step 6 — Execution

For each approved action, you execute:

- **Inbox promotion**: Create a new context/ file (global or local) with YAML header; mark the inbox item `superseded_by: <new-context-file>`.
- **Session archival**: Create `.opencode/archive/sessions/{session-name}/` (if needed); move the entire session directory from `.opencode/sessions/`.
- **Inbox retrofits**: Add YAML front-matter to files missing headers.
- **Promoted-then-archive**: Create an inbox item for the finding, then archive the source session note.

#### Step 7 — Summary

Report results:
- N inbox items promoted (X global, Y local)
- N notes archived from M sessions
- N inbox items retrofitted
- N items discarded

---

## Checkpoint Protocol Integration

The global checkpoint protocol (in `~/.config/opencode/protocols/checkpoint.md`) interacts with context management at two steps:

### Step 5 — Write Session Notes

When writing session notes, remember they are session-scoped and will be archived when the session completes. Notes should document findings knowing they may eventually be promoted or archived. Use the filename convention `kebab-case-topic.md`.

### Step 6 — Write Inbox

When writing inbox items:

1. **Include YAML metadata header** on every new inbox item (topic, session, created, active).
2. **Use `supersedes:`/`superseded_by:`** when writing an item that replaces an older one. Set both the new item's `supersedes:` field and update the old item's `superseded_by:` field.
3. **Qualify for inbox**: Inbox is for candidates awaiting promotion. If something is clearly reusable and the destination tier (global vs local) is obvious, consider writing directly to context/ instead. Use this decision tree:
   - "Would a future session benefit from knowing this?" → Inbox (for review) or direct to context/ (if obvious).
   - "Is this specific to the current session only?" → Session notes, not inbox.

---

## Invariants

- **No reading from inactive tiers**: Agents read Tiers 1–4 during planning; never read Tier 5 (which is injected at runtime), inbox, or archive.
- **Supersession is explicit**: `superseded_by:` must be set for items to be skipped; absence means the item is active.
- **Metadata is authoritative**: Headers are the source of truth for staleness, promotion status, and relationships.
- **Archival is manual**: Sessions do not auto-archive; human review via `/context-audit` is mandatory.
- **Backwards compatibility**: Missing `active` field on inbox items defaults to `true`.
- **Tiering is deterministic**: The location of a file determines its tier; `tier:` header must match.

---

## Example Workflows

### Promoting an Inbox Item to Global Context

1. **Write inbox item** during checkpoint with `promoted_from: inbox` placeholder (or wait for user review).
2. **Run `/context-audit`** — finds the item in `[INBOX]` list.
3. **User selects `[G]` global context** — create `~/.config/opencode/context/<topic>.md` with `promoted_from: inbox` and `tier: global`.
4. **Inbox item updated** — set `superseded_by: <new-context-file>` to mark it complete.
5. **Next planning cycle** — new item is read from Tier 2; old inbox item is skipped.

### Archiving a Completed Session

1. **Session marked `status: completed`** in `spec.json`.
2. **Run `/context-audit`** — finds the session in `[ARCHIVE]` list with its notes.
3. **User reviews promotion candidates** — selects which (if any) to promote to inbox first.
4. **Execute** — create inbox items for promoted notes; move the entire session directory to `.opencode/archive/sessions/{session}/`.
5. **Next planning cycle** — archived notes are never read; only promoted-then-archived findings exist in context.

### Resolving a Contradiction

1. **Two context files** `agent-permissions-v1.md` and `agent-permissions-v2.md` contradict each other.
2. **New authoritative file** `agent-permissions-final.md` is written with clear resolution.
3. **Both old files updated** with `superseded_by: agent-permissions-final.md`.
4. **Next planning cycle** — ContextScout reads only `agent-permissions-final.md`; old files are skipped.

---

## Relationship to Other Protocols

- **Checkpoint Protocol**: Steps 5–6 write session notes and inbox items. This protocol defines the headers, qualifying rules, and promotion process.
- **Session Plan Schema**: Session notes are stored in `.opencode/sessions/{name}/notes/` following Tier 4 conventions.
- **Plan Workflow**: ContextScout reads Tiers 1–4 before situational awareness and planning begin.

---

## Summary

The context-management protocol establishes a **five-tier hierarchy** with explicit staleness rules, **metadata headers** for auditability, and a **unified `/context-audit` command** for promotion and archival. Agents read only active, non-archived tiers during planning. Human judgment via `/context-audit` is the authoritative mechanism for moving context between tiers and managing historical records.
