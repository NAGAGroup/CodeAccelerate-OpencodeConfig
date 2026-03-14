# Subtask 06 — Archive and Cleanup Existing Stale Content

## Delegation
- **Agent:** HeadWrench direct
- **Model tier:** standard
- **Reason:** This is a file management task — moving, archiving, and updating existing files according to new rules. HeadWrench owns file operations directly; this does not require a specialized subagent.

---

## Objective

Apply the newly established context management rules to the current state of the project: archive stale session notes from completed sessions, resolve competing inbox items (using `supersedes:` headers where applicable), and ensure all remaining inbox items have the required metadata header. Leave the project in a clean state conforming to the new system.

---

## Todolist

### 1. Archive session notes from completed sessions
- [ ] Read `opencode/protocols/context-management.md` for archival rules
- [ ] For each completed session in `.opencode/sessions/`: move notes from `notes/` to `.opencode/archive/session-notes/{session-name}/`
- [ ] Exception: do NOT archive notes from the current session (`improved-context-management`)
- [ ] Create `.opencode/archive/` directory if it does not exist

### 2. Retrofit inbox items with metadata headers
- [ ] For each file in `.opencode/inbox/`: add the required metadata header (topic, created, session, supersedes if applicable)
- [ ] Infer metadata from filename and content where not explicit
- [ ] Flag any inbox items that are clearly superseded by newer items — add `supersedes:` field to the newer item

### 3. Resolve the most egregious competing inbox items
- [ ] Based on the audit from subtask 01: identify confirmed competing inbox items
- [ ] For competing items on the same topic: keep the most current/accurate, mark the older one as superseded or archive it
- [ ] Do not delete files — archive superseded items to `.opencode/archive/inbox/`

### 4. Verify clean state
- [ ] List all remaining files in `.opencode/inbox/` — all should now have metadata headers
- [ ] Confirm no competing items remain without resolution
- [ ] Confirm `.opencode/context/` is still empty (and leave it that way)

### 5. Commit
- [ ] `wip: subtask-06 — archive stale notes and retrofit inbox metadata`

---

## Scope
- **Edit:** All files in `.opencode/inbox/` (add metadata headers)
- **Read:** `opencode/protocols/context-management.md`, `.opencode/sessions/*/notes/`, `.opencode/inbox/`
- **Write:** `.opencode/archive/session-notes/{session-name}/` (moved files), `.opencode/archive/inbox/` (superseded inbox items)
- **Excluded:** `opencode/` (global config — read-only here), active session files in `.opencode/sessions/improved-context-management/`

---

## Patterns
```
✅ GOOD — Move (not delete) files to archive; preserve full history while removing from active context
❌ BAD  — Delete files outright; this loses information permanently
```

---

## Constraints
- Never delete files — always move to archive directory
- The current session's notes (`improved-context-management/notes/`) are NOT archived — session is still active
- Do not modify any protocol files or slash command files — those were finalized in subtasks 03–05
- All inbox items that remain in `.opencode/inbox/` must have the required metadata header after this subtask

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
