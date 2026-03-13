# Subtask 02 — Update ROADMAP.md and CHANGELOG.md

## Delegation
- **Agent:** @DocWriter
- **Model tier:** fast (haiku) — clear, unambiguous doc edits with known target content

---

## Objective

Update two documentation files to reflect that the `mermaid diagram tool` has shipped:

1. **ROADMAP.md** — move the `mermaid diagram tool` entry from the `## Planned` section to the `## Recently Shipped` section, changing its status icon from 🔲 to ✅.
2. **CHANGELOG.md** — add a new entry for the mermaid tool under the current version (or a new patch version if appropriate), following the existing format.

This subtask runs AFTER Gate G1 has been approved by the user.

---

## Todolist

### 1. Update ROADMAP.md
- [ ] Read `ROADMAP.md` in full to understand current structure
- [ ] Find the `mermaid diagram tool` row in the `## Planned` section (status: 🔲)
- [ ] Remove that row from `## Planned`
- [ ] Add it to `## Recently Shipped` section with status ✅ and a short description: "Custom plugin using beautiful-mermaid. Renders diagrams as ASCII unicode art, SVG, or GitHub-compatible markdown fenced blocks."

### 2. Update CHANGELOG.md
- [ ] Read `CHANGELOG.md` in full to understand format
- [ ] Add a new entry for the mermaid tool feature — follow the existing version/date format
- [ ] Entry should describe: what was added (`render_mermaid` tool), the library used (`beautiful-mermaid`), and the three output formats (ascii, svg, markdown)

---

## Scope
- **Edit:** `ROADMAP.md`, `CHANGELOG.md`
- **Read:** `ROADMAP.md`, `CHANGELOG.md`
- **Excluded:** Everything else. Do NOT touch plugin files, opencode.json, or any other file.

---

## Patterns
```
✅ GOOD — Move the entire row from Planned to Recently Shipped, change icon from 🔲 to ✅
❌ BAD  — Change the icon in-place while leaving the row in the Planned section

✅ GOOD — Follow exact CHANGELOG.md format already in use (date, version, bullet points)
❌ BAD  — Invent a new format or add a new top-level version bump if one isn't warranted
```

---

## Constraints
- Preserve all other ROADMAP.md content exactly — only move the one mermaid row
- CHANGELOG.md version: check the current version before deciding whether to add under existing version or create a new entry
- Keep ROADMAP.md structure intact: sections and status legend must not change
- Entry description in ROADMAP.md Recently Shipped should remain concise (one sentence)

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
