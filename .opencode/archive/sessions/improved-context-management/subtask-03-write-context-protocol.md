# Subtask 03 — Write Context Management Protocol

## Delegation
- **Agent:** @DocWriter
- **Model tier:** standard
- **Reason:** Writing a new authoritative protocol document — this is documentation authorship work, well-suited to DocWriter.

---

## Objective

Write the new `opencode/protocols/context-management.md` protocol file, implementing the tiered context architecture approved at gate G1. This becomes the authoritative specification for how context sources are tiered, when they become stale, how conflicts are resolved, and what agents receive at runtime.

---

## Todolist

### 1. Read inputs
- [ ] Read `notes/architecture-design.md` (the approved design from subtask 02)
- [ ] Read `~/.config/opencode/protocols/checkpoint.md` for style/format reference
- [ ] Read `~/.config/opencode/protocols/session-plan-schema.md` for style reference

### 2. Write the protocol
- [ ] Write `opencode/protocols/context-management.md` following the approved design
- [ ] Include all sections: overview, tiered model, staleness rules, inbox metadata standard, conflict resolution, agent visibility rules, archival destinations
- [ ] Write in the same register and style as other protocols in `opencode/protocols/`

### 3. Commit
- [ ] Stage and commit: `docs: add context-management protocol`

---

## Scope
- **Edit:** Nothing
- **Read:** `.opencode/sessions/improved-context-management/notes/architecture-design.md`, `~/.config/opencode/protocols/checkpoint.md`, `~/.config/opencode/protocols/session-plan-schema.md`
- **Write:** `opencode/protocols/context-management.md`
- **Excluded:** `opencode/protocols/checkpoint.md` (that is subtask 04's scope), all slash command files, all session files

---

## Patterns
```
✅ GOOD — Concrete, specific rules: "inbox items older than the session that created them are stale unless marked with `active: true`"
❌ BAD  — Vague guidance: "consider whether an item is still relevant" without a rule
```

---

## Constraints
- Do not modify `checkpoint.md` — that is subtask 04
- Do not write slash command files — that is subtask 05
- The protocol must be self-contained — readable and actionable without reference to these session files
- Match the style, heading structure, and tone of existing protocols in `opencode/protocols/`
- All rules must be deterministic: no ambiguity about when something is stale or how conflicts resolve

---

*At the end of this subtask, follow the checkpoint protocol in `protocols/checkpoint.md` if present in this session directory, otherwise `~/.config/opencode/protocols/checkpoint.md`.*
