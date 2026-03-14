# Subtask 01 — Deep Context Audit

## Delegation
- **Agent:** @ContextScout
- **Model tier:** fast
- **Reason:** Read-only deep inventory task. ContextScout is the correct agent for exploring and summarizing existing files without writing anything.

---

## Objective

Produce a comprehensive audit of all existing context sources in the project — every session note file from every session, every inbox item, and every existing slash command — to provide a complete picture of what exists, what is stale, and where competing or redundant information lives. This audit becomes the direct input to the architecture design in subtask 02.

---

## Todolist

### 1. Inventory session notes
- [ ] List all files in every `.opencode/sessions/*/notes/` directory
- [ ] For each note file: record filename, session name, approximate topic (from filename + first 5 lines), and whether that session is completed
- [ ] Flag any notes that appear to address the same topic across multiple sessions

### 2. Inventory inbox items
- [ ] List all files in `.opencode/inbox/`
- [ ] For each inbox file: record filename, full content summary (2-4 sentences), and topic tag
- [ ] Flag any inbox files that appear to conflict with or supersede another item
- [ ] Flag any inbox files that appear session-specific (should have been notes, not inbox)

### 3. Inventory existing slash commands
- [ ] List all files in `opencode/commands/`
- [ ] For each command: record the command name, what it does, and whether it touches context/notes/inbox in any way

### 4. Inventory context directories
- [ ] Check `.opencode/context/` — note that it should be empty; confirm and report
- [ ] Check `opencode/context/` if it exists — record contents if any
- [ ] Note any other directories that might serve as "context sources" for agents

### 5. Summarize findings
- [ ] List top 5 stale-or-competing problems identified (specific file pairs or clusters)
- [ ] List any inbox items that appear to conflict directly with each other
- [ ] Estimate total "context noise" volume (total note files across all sessions)
- [ ] Identify which session notes, if any, are still actively relevant to future sessions

---

## Scope
- **Edit:** Nothing — read-only
- **Read:** `.opencode/inbox/`, `.opencode/sessions/*/notes/`, `.opencode/sessions/*/index.md`, `opencode/commands/`, `.opencode/context/`
- **Write:** Nothing
- **Excluded:** `opencode/protocols/`, `opencode/agents/`, `.git/`

---

## Patterns
```
✅ GOOD — Read each note file and extract topic + relevance signal from filename and content
❌ BAD  — Skip reading files and infer only from filenames; content matters for staleness detection
```

---

## Constraints
- This is strictly a read-only audit. No files are written or modified.
- Return a structured report — not prose paragraphs. Use tables and lists for the inventory.
- For each inbox file, include a direct 1-2 sentence quote from the file content alongside the summary.
- Flag competing items explicitly (e.g., "inbox/file-A.md and inbox/file-B.md both address CodeWriter permissions but say different things").

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
