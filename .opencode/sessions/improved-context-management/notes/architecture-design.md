# Architecture Design — Tiered Context Management

**Session:** improved-context-management  
**Subtask:** 02 — Design tiered context architecture  
**Status:** Ready for G1 gate review (revised — 5-tier model with inbox-as-queue)

---

## 1. Context Tiers

The system defines 5 tiers, ordered from most stable to most ephemeral. Tiers 1–4 are read during planning; tier 5 is injected at runtime per task.

| Tier | Name | Location | Stability | Reading Rule |
|------|------|----------|-----------|-------------|
| 1 | Global Config | `~/.config/opencode/protocols/`, `~/.config/opencode/agents/`, `~/.config/opencode/commands/`, `~/.config/opencode/opencode.json` | Very high | Always read; no staleness |
| 2 | Global Context | `~/.config/opencode/context/` | High | Permanent, user-curated; read by all projects |
| 3 | Local Context | `.opencode/context/` | High | Permanent, project-specific; read by agents in this project |
| 4 | Session Notes | `.opencode/sessions/*/notes/` | Session-scoped | Read only from sessions where `spec.json` has `status: in_progress` or `status: pending`; completed-session notes are archived |
| 5 | Subtask File | `.opencode/sessions/{name}/subtask-NN-{name}.md` | Always fresh | Injected at runtime; current task scope only |

**Inbox (`.opencode/inbox/`) is NOT a tier.** It is a write-only staging queue for candidate context items. Agents do not read the inbox during normal operation. Items are promoted from inbox into Tier 2 (global context) or Tier 3 (local context) via `/context-audit`.

**Archive (`.opencode/archive/`) is NOT a tier.** Historical record only; never read during planning.

---

## 2. Inbox — Staging Queue

The inbox is a human-maintained queue. Checkpoints and agents write candidate observations there; humans review and promote them to permanent context via `/context-audit`.

### Inbox vs Context/ — Decision Rule

| A finding is... | Goes in... |
|-----------------|-----------|
| A pattern or rule reusable across any project | `~/.config/opencode/context/` (global, Tier 2) |
| A project-specific fact or convention | `.opencode/context/` (local, Tier 3) |
| A candidate that needs human review first | `.opencode/inbox/` (staging queue) |
| A session-specific finding (not generalizable) | `.opencode/sessions/{name}/notes/` (Tier 4) |

Checkpoints always write to inbox (staging), never directly to context/. Human review via `/context-audit` is what moves items into permanent context.

---

## 3. Metadata Headers

All files in inbox and context/ directories must include a YAML front-matter block for auditability. New files written after this protocol takes effect are required to include it. Existing files will be retrofitted in subtask 06.

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
promoted_from: inbox  # or: direct (written directly into context/)
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
| `topic` | both | Yes | 2–4 word topic tag (e.g., `agent-permissions`, `slash-commands`) |
| `session` | both | Yes | Name of the session that created this item |
| `created` | both | Yes | ISO 8601 date (YYYY-MM-DD) |
| `active` | inbox | No | Default `true` when absent. Set `false` to deactivate without deleting. |
| `tier` | context | Yes | `global` or `local` — mirrors the directory, but makes it explicit |
| `promoted_from` | context | Yes | `inbox` (came through queue) or `direct` (written directly) |
| `last_reviewed` | context | No | Updated by `/context-audit` each time the item is reviewed |
| `supersedes` | both | No | Filename of the older item this replaces. Use `~` when not applicable. |
| `superseded_by` | both | No | Filename of the newer item that replaces this. Use `~` otherwise. |

### Backwards Compatibility

If `active` is absent on an inbox item, treat as `active: true`. Existing inbox files without headers remain active by default until retrofitted.

---

## 4. Staleness Rules

### Session Notes (Tier 4)

| Session Status | Note Status | Action |
|----------------|-------------|--------|
| `in_progress` | Active | Read during planning |
| `pending` (not started) | Active | Read during planning |
| `completed` | Archivable | Move to `.opencode/archive/{session-name}/notes/`; not read during planning |

**Trigger for archival:** Manual, via `/context-audit` command. The session-close checkpoint does NOT auto-archive — archival requires human review (promotion candidates must be considered first).

**Promotion path:** Before a session's notes are archived, valuable findings that would benefit future sessions should be promoted. The note goes into `.opencode/inbox/` (staging); the human then approves promotion to global or local context/ during the next `/context-audit` run. The original session note is then archived.

### Context Files (Tiers 2 and 3)

Context files do not expire based on age. They are only deactivated by:
1. Setting `superseded_by: new-file.md` explicitly
2. Deletion during a `/context-audit` review

### Config Files (Tier 1)

No staleness mechanism. Config files are updated via protocol sessions whenever they need to change.

---

## 5. Conflict Resolution

When two items (inbox or context) address the same topic and one supersedes the other:

1. **New item** gets `supersedes: old-item.md` in its header
2. **Old item** gets `superseded_by: new-item.md` in its header
3. ContextScout skips items where `superseded_by:` is set
4. The old item is retained in place (not deleted) for historical reference

When a genuine contradiction exists (neither item is definitively correct), both items should be resolved in the same session — write a new authoritative item that supersedes both.

---

## 6. Archival Process

### Destination

```
.opencode/archive/{session-name}/notes/
```

Example: Notes from session `improve-planning-system` → `.opencode/archive/improve-planning-system/notes/`

### Trigger

Manual, via `/context-audit` command. HeadWrench executes file moves after user approves.

### Steps

1. `/context-audit` identifies completed sessions with non-archived notes
2. For each note, user decides: **promote to inbox** (for later context promotion), **archive only**, or **keep in session**
3. For promotion candidates: HeadWrench creates a new inbox item summarizing the finding; user reviews the summary
4. Once promotion is settled, HeadWrench moves the note file from `.opencode/sessions/{name}/notes/` to `.opencode/archive/{name}/notes/`
5. The session's `spec.json` is not modified by archival (it remains a historical record)

### What is NOT archived

- Notes from sessions with `status: in_progress` or `status: pending`
- Inbox items (inbox is the queue; items are deactivated or promoted, not archived)
- Context/ files (these are permanent until explicitly deleted or superseded)
- The session's `index.md`, `spec.json`, and `subtask-NN-*.md` files (stay in place as historical records)

---

## 7. ContextScout Reading Scope

When ContextScout performs situational awareness (during `/plan`):

### In Scope (always read)

- `~/.config/opencode/protocols/` — all protocol files
- `~/.config/opencode/agents/` — all agent definitions
- `~/.config/opencode/commands/` — all slash commands
- `~/.config/opencode/opencode.json` — global config
- `~/.config/opencode/context/` — all global context files (Tier 2)
- `.opencode/context/` — all local context files (Tier 3)
- `.opencode/sessions/*/notes/` — only sessions with `spec.json` showing `status: in_progress` or `status: pending`

### Out of Scope (do not read during planning)

- `.opencode/archive/` — historical only
- `.opencode/sessions/*/notes/` where that session's `status: completed`
- `.opencode/inbox/` — staging queue; not for agent consumption

### Notes on completed sessions

ContextScout may still read `index.md` and `spec.json` from completed sessions to understand project history — but NOT the session's `notes/` directory unless explicitly asked to investigate a specific historical finding.

---

## 8. Slash Command: `/context-audit`

**Location:** `~/.config/opencode/commands/context-audit.md`

**Purpose:** Unified interactive cleanup of the entire context system. Absorbs the old `/inbox` command. HeadWrench runs the audit and presents findings; user approves proposed actions; HeadWrench executes.

### Procedure (HeadWrench executes this when `/context-audit` is invoked)

**Step 1 — Inventory**
- Count inbox items total / active / superseded / missing headers (need retrofitting)
- Count context/ files: global (`~/.config/opencode/context/`) and local (`.opencode/context/`)
- Count session note files total / in active sessions / in completed sessions (archivable)
- Count completed sessions with non-archived notes

**Step 2 — Flag Issues**
Present a numbered list of issues found:
- `[INBOX]` — `N` inbox items pending promotion review
- `[ARCHIVE]` — completed session `X` has `N` notes ready to archive
- `[RETROFIT]` — inbox item `file.md` is missing metadata header
- `[MISCLASSIFIED]` — inbox item `file.md` appears to be a session outcome, not a reusable pattern (heuristic: contains single session name prominently with no generalizable rule)
- `[SUPERSEDED]` — inbox item `old.md` is superseded by `new.md` (already marked; ok to leave or clean up)
- `[CONTEXT-REVIEW]` — context/ file `file.md` has not been reviewed in >90 days (via `last_reviewed` header)

**Step 3 — Process Inbox Queue**
For each active inbox item (or on `[INBOX]` trigger):
```
[INBOX] inbox/ask-only-subagent-pattern.md
  Topic: agent-pattern | Created: 2026-03-10 | Session: agent-permissions-and-insurgent
  Summary: "Some subagents are designated ask-only — HW must get user confirmation..."
  → Promote to: [G] global context / [L] local context / [D] discard / [S] skip for now
```

**Step 4 — Proposed Archive Actions**
For each completed session with archivable notes:
```
[ARCHIVE] improve-planning-system (7 notes, session completed)
  Proposed: Move .opencode/sessions/improve-planning-system/notes/ → .opencode/archive/improve-planning-system/notes/
  Promotion candidates: subtask-01-amend-overhaul.md (HIGH), subtask-04-parallel-delegation-schema.md (MEDIUM)
  → Promote any to inbox before archiving? [y/n per file]
```

**Step 5 — User Approval**
User approves or rejects each action. HeadWrench executes only approved actions.

**Step 6 — Execution**
For each approved action:
- Inbox promotion: write new context/ file with YAML header at destination; mark inbox item `superseded_by: <new-context-file>`
- Session archival: `mkdir -p .opencode/archive/{session-name}/notes/` then move files
- Inbox retrofits: add YAML front-matter to the file
- Promoted-then-archive: write inbox item for the finding, then archive the source note

**Step 7 — Summary**
Report: N inbox items promoted (global/local), N notes archived, N inbox items retrofitted, N items discarded.

---

## 9. Checkpoint Protocol Changes Required

**Step 5 — Write Session Notes:** Add guidance that session notes are session-scoped and will be archived when the session completes. Notes written at checkpoint should document findings knowing they'll eventually be promoted or archived.

**Step 6 — Write Inbox:** Add:
1. Requirement to include the YAML metadata header on every new inbox item
2. Guidance on using `supersedes:` / `superseded_by:` when writing an item that replaces an older one
3. Updated qualification guidance: inbox is for candidates awaiting promotion — if something is clearly reusable and the destination tier (global vs local) is obvious, consider writing directly to context/ instead

---

## 10. Cleanup Actions for Subtask 06

Specific actions to perform during cleanup (after G1 approval and protocol files are written):

### Inbox Retrofits

Add metadata headers to all 9 existing inbox files:

| File | topic | session | active | notes |
|------|-------|---------|--------|-------|
| docwriter-format-autonomy.md | docwriter-behavior | roadmap-and-feature-tracking | true | keep in inbox |
| improve-planning-system-session-complete.md | — | — | — | **Move to session notes** (misclassified; not a reusable pattern) |
| primary-vs-subagent-permission-model.md | agent-permissions | agent-permissions-and-insurgent | true | keep in inbox |
| tool-visible-output-session-prompt.md | tool-visibility | mermaid-tool-plugin | true | keep in inbox |
| opencode-global-config-is-symlink.md | config-paths | session-context-plugin | true | keep in inbox |
| ask-only-subagent-pattern.md | agent-pattern | agent-permissions-and-insurgent | true | keep in inbox |
| stale-project-local-context.md | context-management | roadmap-and-feature-tracking | false | **Deactivate** — superseded by this session's new design (`.opencode/context/` is now a legitimate tier) |
| agent-ignore-header-pattern.md | slash-commands | agent-permissions-and-insurgent | true | keep in inbox |
| only-codewriter-needed-permission-fix.md | agent-permissions | deny-by-default-agent-permissions | true | keep in inbox |

Note: `stale-project-local-context.md` should be marked `active: false` and `superseded_by:` pointing to the new context-management protocol, because `.opencode/context/` is now a legitimate destination (Tier 3), not a forbidden path.

### Session Notes Archival

Archive completed sessions. Order by "most historical / least relevant first":

**Completed sessions eligible for archival (all notes):**
1. `fix-plan-schema-and-workflow` — 1 note; session-close summary; foundational but superseded by improve-planning-system
2. `roadmap-and-feature-tracking` — 3 notes; LOW relevance except stale-context rule (already in inbox, will be deactivated)
3. `rewrite-user-docs` — 3 notes; LOW relevance (docs were rewritten; historical)
4. `audit-session-compaction-plugin` — 3 notes; MEDIUM relevance; plugin bugs fixed
5. `mermaid-tool-plugin` — 2 notes; MEDIUM relevance; ascii-injection pattern already in inbox
6. `v0.1.0-release-prep` — 4 notes; LOW relevance; release done
7. `todolist-enforcement` — 2 notes; MEDIUM relevance; 3-layer todo stack now in headwrench.md
8. `ade-subagent-to-skill` — 1 note; LOW relevance; ADE is now a skill
9. `deny-by-default-agent-permissions` — 2 notes; MEDIUM relevance; outcome already in inbox
10. `improve-planning-system` — 7 notes; HIGH relevance; **promote** subtask-01-amend-overhaul.md and subtask-04-parallel-delegation-schema.md to inbox before archiving

**Do NOT archive:**
- `lockdown-workflows-and-agents` — PENDING session; notes are active context
- `agent-permissions-and-insurgent` — COMPLETED but HIGH value; promote `permissions-audit.md` key findings to inbox before archiving
- `session-context-plugin` — COMPLETED; consider promoting `plugin-api-import-patterns.md` before archiving
- `concepts-why-this-works` — no notes yet
- `improved-context-management` — this is the CURRENT session

### Filesystem Cleanup

- **Create** `.opencode/archive/` directory (archival destination)
- **Create** `.opencode/context/` if not exists (local context destination — it exists but is empty/stale; clean it rather than delete it)
- **Move** `improve-planning-system-session-complete.md` from `.opencode/inbox/` → `.opencode/sessions/improve-planning-system/notes/` before archiving that session

---

## Summary

This design solves the three original problems:

| Problem | Solution |
|---------|---------|
| Accumulated session notes overwhelming agents | Completed-session notes archived to `.opencode/archive/`; ContextScout only reads `in_progress`/`pending` session notes |
| Stale info | Context files have `superseded_by:` chain; inbox items have `active` flag; archived notes excluded from planning reads |
| Competing info | `supersedes`/`superseded_by:` chain makes precedence explicit; `/context-audit` flags unresolved conflicts and surfaces inbox queue for human promotion decisions |
