# Subtask 02 — Update Context Navigation

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (claude-haiku-4.5) — targeted additive edit to a markdown file, no judgment required
- **Reason:** Simple doc edit — read existing file, add one reference entry. DocWriter handles all doc updates.

---

## Objective

Update `.opencode/context/navigation.md` to add a reference to `ROADMAP.md` at the repo root. This ensures that ContextScout (which reads all context files during `/plan`) knows to check `ROADMAP.md` for planned and in-progress features when building situational awareness reports.

The update must be **additive only** — no existing content may be removed or reworded.

---

## Todolist

### 1. Read existing navigation.md
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/context/navigation.md` to understand current structure

### 2. Add ROADMAP.md reference
- [ ] Add an entry (or section) that points to `ROADMAP.md` at repo root
- [ ] The entry should explain: "For planned/upcoming features, in-progress work, and backlog items, read `ROADMAP.md` at the repo root"
- [ ] Place it logically within the existing document structure (e.g., near project docs or user-facing references)

---

## Scope
- **Edit:** `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/context/navigation.md`
- **Read:** `/home/jack/CodeAccelerate-OpencodeConfig/.opencode/context/navigation.md` (read before editing)
- **Excluded:** All other files — do not modify anything else

---

## Patterns
```
✅ GOOD — Add a new bullet or section that fits the existing document style
✅ GOOD — "ROADMAP.md (repo root) — planned features, in-progress work, and backlog"
❌ BAD  — Removing or rewriting any existing content
❌ BAD  — Adding a new section that duplicates existing structure
❌ BAD  — Adding agent-specific instructions inside ROADMAP.md (those go in navigation.md only)
```

---

## Constraints
- Additive only — do not remove or reword any existing content in `navigation.md`
- The reference must be clear enough that ContextScout will understand it should read `ROADMAP.md` during future planning sessions
- Match the existing tone, style, and formatting of `navigation.md`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
