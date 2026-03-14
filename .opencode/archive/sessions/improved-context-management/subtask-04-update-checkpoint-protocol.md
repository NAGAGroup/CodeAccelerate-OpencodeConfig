# Subtask 04 — Update Checkpoint Protocol

## Delegation
- **Agent:** @DocWriter
- **Model tier:** standard
- **Reason:** Updating an existing protocol document to align with new context rules — documentation authorship work for DocWriter.

---

## Objective

Update `opencode/protocols/checkpoint.md` to align step 5 (Write Session Notes) and step 6 (Write Inbox) with the new context management rules established in the context-management protocol (subtask 03). Specifically: inbox items must now include the required metadata header, and session notes must follow the new lifecycle/archival rules.

---

## Todolist

### 1. Read inputs
- [ ] Read `opencode/protocols/context-management.md` (just written in subtask 03) — this is the source of truth for what must change
- [ ] Read `~/.config/opencode/protocols/checkpoint.md` in full to understand current steps 5 and 6

### 2. Update step 5 — Write Session Notes
- [ ] Update to reference the note lifecycle rules from context-management.md
- [ ] Add guidance on session note archival trigger (when session completes)

### 3. Update step 6 — Write Inbox
- [ ] Add the required metadata header format (as defined in context-management.md)
- [ ] Update the conflict resolution guidance (use `supersedes:` header when a new item replaces an old one)
- [ ] Update the Inbox Qualification Guidance section at the bottom if needed

### 4. Commit
- [ ] Stage and commit: `docs: update checkpoint protocol for new context management rules`

---

## Scope
- **Edit:** `opencode/protocols/checkpoint.md`
- **Read:** `opencode/protocols/context-management.md`, `~/.config/opencode/protocols/checkpoint.md`
- **Write:** Nothing new
- **Excluded:** `opencode/protocols/context-management.md` (read-only in this task), all slash command files, all session files

---

## Patterns
```
✅ GOOD — Add specific metadata header example showing exactly what fields are required in inbox items
❌ BAD  — Vague reference: "see context-management.md for details" without spelling out what changes in this file
```

---

## Constraints
- Preserve all existing 8 checkpoint steps and their numbering
- Do not restructure or reorder the checkpoint protocol — only update steps 5 and 6 and the inbox qualification section
- Changes must be self-contained — the updated checkpoint.md must be readable and actionable standalone
- If subtask 03 and 04 ran in parallel, DocWriter must read the freshly written context-management.md before editing checkpoint.md

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
