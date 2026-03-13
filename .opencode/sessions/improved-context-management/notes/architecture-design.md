# Architecture Design — Tiered Context Management

**Session:** improved-context-management  
**Subtask:** 02 — Design tiered context architecture  
**Status:** Ready for G1 gate review

---

## 1. Context Tiers

The system defines 4 tiers, ordered from most stable to most ephemeral. Agents see tiers 1–3 during planning; tier 4 is injected at runtime per task.

| Tier | Name | Location | Stability | Reading Rule |
|------|------|----------|-----------|-------------|
| 1 | Config | `~/.config/opencode/protocols/`, `~/.config/opencode/agents/`, `~/.config/opencode/commands/`, `~/.config/opencode/opencode.json` | Very high | Always read; no staleness |
| 2 | Inbox | `.opencode/inbox/` | High | Read items where `active: true` (or field absent); skip where `superseded_by:` is set |
| 3 | Session Notes | `.opencode/sessions/*/notes/` | Session-scoped | Read only from sessions where `spec.json` has `status: in_progress`; completed-session notes are archived |
| 4 | Subtask File | `.opencode/sessions/{name}/subtask-NN-{name}.md` | Always fresh | Injected at runtime; current task scope only |

**Not a context source:**
- `.opencode/context/` — confirmed stale; will be deleted in subtask 06
- `.opencode/archive/` — historical record only; NOT read during planning

---

## 2. Staleness Rules

### Session Notes (Tier 3)

| Session Status | Note Status | Action |
|----------------|-------------|--------|
| `in_progress` | Active | Read during planning |
| `completed` | Archivable | Move to `.opencode/archive/{session-name}/notes/`; not read during planning |
| `pending` (not started) | Active | Read during planning |

**Trigger for archival:** Manual, via `/context-audit` command. The session-close checkpoint does NOT auto-archive — archival requires human review (promotion candidates must be considered first).

**Promotion path:** Before a session's notes are archived, valuable findings that would benefit future sessions should be summarized into a new inbox item. The session note is then archived. The inbox item becomes the permanent reference.

### Inbox Items (Tier 2)

| Condition | Status | Reading Rule |
|-----------|--------|-------------|
| `active: true` (or field absent) | Active | Read |
| `active: false` | Inactive | Skip |
| `superseded_by: some-file.md` | Superseded | Skip |

Inbox items do not expire based on age. They are only deactivated by:
1. Setting `active: false` explicitly
2. A newer item setting `supersedes: this-file.md` on itself and `superseded_by: newer-file.md` on this file

### Config Files (Tier 1)

No staleness mechanism. Config files are updated via protocol sessions whenever they need to change.

---

## 3. Inbox Metadata Header

Every inbox file must start with a YAML front-matter block. New files written after this protocol takes effect are required to include it. Existing files (9 files) will be retrofitted in subtask 06.

### Required Format

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

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `topic` | string | Yes | 2–4 word topic tag (e.g., `agent-permissions`, `slash-commands`) |
| `session` | string | Yes | Name of the session that created this item |
| `created` | date | Yes | ISO 8601 date (YYYY-MM-DD) |
| `active` | bool | No | Default `true` when absent. Set `false` to deactivate without deleting. |
| `supersedes` | filename or `~` | No | Filename of the older item this replaces. Use `~` when not applicable. |
| `superseded_by` | filename or `~` | No | Filename of the newer item that replaces this. Set when superseded. Use `~` otherwise. |

### Backwards Compatibility

If `active` is absent, treat as `active: true`. Existing inbox files without headers remain active by default until retrofitted.

---

## 4. Conflict Resolution

When two inbox items address the same topic and one supersedes the other:

1. **New item** gets `supersedes: old-item.md` in its header
2. **Old item** gets `superseded_by: new-item.md` in its header
3. ContextScout skips the old item when `superseded_by` is set
4. The old item is retained in `.opencode/inbox/` (not deleted) for historical reference

When a conflict exists but neither item is definitively correct (genuine contradiction), both items should be resolved in the same session — do not leave contradictory active items in the inbox. Write a new authoritative item that supersedes both.

---

## 5. Archival Process

### Destination

```
.opencode/archive/{session-name}/notes/
```

Example: Notes from session `improve-planning-system` → `.opencode/archive/improve-planning-system/notes/`

### Trigger

Manual, via `/context-audit` command. HeadWrench executes file moves after user approves.

### Steps

1. `/context-audit` identifies completed sessions with non-archived notes
2. For each note, user decides: **promote to inbox**, **archive only**, or **keep in session**
3. For promotion candidates: HeadWrench creates a new inbox item summarizing the finding; user reviews the summary
4. Once promotion is settled, HeadWrench moves the note file from `.opencode/sessions/{name}/notes/` to `.opencode/archive/{name}/notes/`
5. The session's `spec.json` is not modified by archival (it remains a historical record)

### What is NOT archived

- Notes from sessions with `status: in_progress` or `status: pending`
- Inbox items (inbox is permanent unless explicitly deactivated)
- The session's `index.md`, `spec.json`, and `subtask-NN-*.md` files (these stay in place forever as historical records)

---

## 6. ContextScout Reading Scope

When ContextScout performs situational awareness (during `/plan`):

### In Scope (always read)

- `~/.config/opencode/protocols/` — all protocol files
- `~/.config/opencode/agents/` — all agent definitions
- `~/.config/opencode/commands/` — all slash commands
- `~/.config/opencode/opencode.json` — global config
- `.opencode/inbox/` — all items where `active: true` (or field absent) AND `superseded_by` is `~` (or absent)
- `.opencode/sessions/*/notes/` — only sessions with `spec.json` showing `status: in_progress` or `status: pending`

### Out of Scope (do not read during planning)

- `.opencode/archive/` — historical only
- `.opencode/sessions/*/notes/` where that session's `status: completed`
- Inbox items with `active: false` or `superseded_by:` set
- `.opencode/context/` — stale, will be deleted

### Notes on reading completed sessions

ContextScout may still read `index.md` and `spec.json` from completed sessions to understand project history — but NOT the session's `notes/` directory unless explicitly asked to investigate a specific historical finding.

---

## 7. Slash Command: `/context-audit`

**Location:** `~/.config/opencode/commands/context-audit.md`

**Purpose:** Interactive guided cleanup of the context system. HeadWrench runs the audit and presents findings; user approves proposed actions; HeadWrench executes.

### Procedure (HeadWrench executes this when `/context-audit` is invoked)

**Step 1 — Inventory**
- Count inbox items total / active / superseded
- Count session note files total / in active sessions / in completed sessions (archivable)
- Count completed sessions with non-archived notes
- List any inbox items missing the metadata header (need retrofitting)
- List any inbox items with `superseded_by:` set (redundant, could be cleaned up)

**Step 2 — Flag Issues**
Present a numbered list of issues found:
- `[ARCHIVE]` — completed session `X` has `N` notes ready to archive
- `[RETROFIT]` — inbox item `file.md` is missing metadata header
- `[MISCLASSIFIED]` — inbox item `file.md` appears to be a session outcome, not a reusable pattern (heuristic: contains single session name prominently in title/content with no generalizable rule)
- `[SUPERSEDED]` — inbox item `old.md` is superseded by `new.md` (already marked; ok to leave or clean up)

**Step 3 — Proposed Actions**
For each flagged issue, propose a specific action with the exact file operation.

Example:
```
[ARCHIVE] improve-planning-system (7 notes, session completed)
  Proposed: Move .opencode/sessions/improve-planning-system/notes/ → .opencode/archive/improve-planning-system/notes/
  Promotion candidates: subtask-01-amend-overhaul.md (HIGH), subtask-04-parallel-delegation-schema.md (MEDIUM)
  → Do you want to promote any of these to inbox before archiving? [y/n per file]
```

**Step 4 — User Approval**
User approves or rejects each action. HeadWrench executes only approved actions.

**Step 5 — Execution**
For each approved action:
- `mkdir -p .opencode/archive/{session-name}/notes/`
- `mv .opencode/sessions/{session-name}/notes/{file} .opencode/archive/{session-name}/notes/{file}`
- For inbox retrofits: add YAML front-matter to the file
- For promoted notes: write new inbox item summarizing the finding, then archive the source note

**Step 6 — Summary**
Report: N notes archived, N inbox items retrofitted, N promotions created.

---

## 8. Checkpoint Protocol Changes Required

**Step 5 — Write Session Notes:** Add guidance that session notes are session-scoped and will be archived when the session completes. Notes written at checkpoint should document findings for the *future session* lifecycle, knowing they'll eventually be archived. No behavior change — just awareness.

**Step 6 — Write Inbox:** Add:
1. Requirement to include the YAML metadata header on every new inbox item
2. Guidance on using `supersedes:` / `superseded_by:` when writing an item that replaces an older one
3. Updated inbox qualification guidance: distinguish "reusable pattern" (inbox) from "session outcome" (session note)

---

## 9. Cleanup Actions for Subtask 06

Specific actions to perform during cleanup (after G1 approval and protocol files are written):

### Inbox Retrofits

Add metadata headers to all 9 existing inbox files:

| File | topic | session | active | supersedes | superseded_by |
|------|-------|---------|--------|-----------|---------------|
| docwriter-format-autonomy.md | docwriter-behavior | roadmap-and-feature-tracking | true | ~ | ~ |
| improve-planning-system-session-complete.md | N/A | N/A | N/A | N/A | N/A | → **Move to session notes** (misclassified) |
| primary-vs-subagent-permission-model.md | agent-permissions | agent-permissions-and-insurgent | true | ~ | ~ |
| tool-visible-output-session-prompt.md | tool-visibility | mermaid-tool-plugin | true | ~ | ~ |
| opencode-global-config-is-symlink.md | config-paths | session-context-plugin | true | ~ | ~ |
| ask-only-subagent-pattern.md | agent-pattern | agent-permissions-and-insurgent | true | ~ | ~ |
| stale-project-local-context.md | context-management | roadmap-and-feature-tracking | true | ~ | ~ |
| agent-ignore-header-pattern.md | slash-commands | agent-permissions-and-insurgent | true | ~ | ~ |
| only-codewriter-needed-permission-fix.md | agent-permissions | deny-by-default-agent-permissions | true | ~ | ~ |

Note: `only-codewriter-needed-permission-fix.md` and `primary-vs-subagent-permission-model.md` both address agent permissions but from different angles — no supersession needed; they are complementary.

### Session Notes Archival

Archive completed sessions. Order by "most historical / least relevant first":

**Completed sessions eligible for archival (all notes):**
1. `fix-plan-schema-and-workflow` — 1 note; session-close summary; foundational but superseded by improve-planning-system
2. `roadmap-and-feature-tracking` — 3 notes; LOW relevance except stale-context rule (already in inbox)
3. `rewrite-user-docs` — 3 notes; LOW relevance (docs were rewritten; historical)
4. `audit-session-compaction-plugin` — 3 notes; MEDIUM relevance; plugin bugs fixed
5. `mermaid-tool-plugin` — 2 notes; MEDIUM relevance; ascii-injection pattern already in inbox
6. `v0.1.0-release-prep` — 4 notes; LOW relevance; release done
7. `todolist-enforcement` — 2 notes; MEDIUM relevance; describes 3-layer todo stack (in headwrench.md now)
8. `ade-subagent-to-skill` — 1 note; LOW relevance; ADE is now a skill
9. `rewrite-user-docs` — already listed
10. `deny-by-default-agent-permissions` — 2 notes; MEDIUM relevance; outcome already in inbox
11. `concepts-why-this-works` — no notes yet
12. `improve-planning-system` — 7 notes; HIGH relevance; promote subtask-01-amend-overhaul.md and fix-plan-schema-and-workflow/session-close.md before archiving

**Do NOT archive:**
- `lockdown-workflows-and-agents` — PENDING session; notes are active context
- `agent-permissions-and-insurgent` — COMPLETED but notes have HIGH value (permissions-audit.md is 633 lines; consider promoting key findings to inbox before archiving)
- `session-context-plugin` — COMPLETED; plugin-api-import-patterns.md is MEDIUM relevance; consider promoting before archiving
- `improved-context-management` — this is the CURRENT session

### Filesystem Cleanup

- **Delete** `.opencode/context/` (empty, stale, flagged)
- **Create** `.opencode/archive/` directory (archival destination)
- **Move** `improve-planning-system-session-complete.md` from `.opencode/inbox/` to `.opencode/sessions/improve-planning-system/notes/improve-planning-system-session-complete.md` before archiving that session

---

## Summary

This design solves the three original problems:

| Problem | Solution |
|---------|---------|
| Accumulated session notes overwhelming agents | Completed-session notes archived to `.opencode/archive/`; ContextScout only reads `in_progress`/`pending` session notes |
| Stale info | Inbox items have `active`/`superseded_by` fields; archived notes excluded from planning reads |
| Competing info | `supersedes`/`superseded_by` chain makes precedence explicit; `/context-audit` flags unresolved conflicts |
