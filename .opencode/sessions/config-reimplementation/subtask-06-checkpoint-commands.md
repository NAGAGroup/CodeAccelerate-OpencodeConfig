# Subtask 06 — checkpoint-commands

## Delegation
**Agent:** @config-implementer  
**Reason:** Creating two new command files and updating checkpoint.md — standard implementation work.

---

## Objective

Create two new slash commands (`/save` and `/restore`) that implement checkpoint primitives, and update `protocols/checkpoint.md` to reference them where appropriate.

- **`/save`** — manually trigger a checkpoint snapshot. Writes spec.json state, session notes, and inbox items. Intended for mid-subtask saves (not end-of-subtask checkpoints, which are automatic).
- **`/restore`** — restore session state from the last saved checkpoint (i.e., re-read spec.json and reconstruct the 3-layer todo stack). Useful after context loss or confusion.

Note: The model field in YAML frontmatter is bugged in opencode v0.6.4 — do NOT add a `model:` field to these command files.

---

## Scope

### In Scope
- `opencode/commands/save.md` — new file
- `opencode/commands/restore.md` — new file
- `opencode/protocols/checkpoint.md` — minor update to reference /save

### Out of Scope
- `continue.md` — already handles resume; /restore supplements it, doesn't replace it
- Any other files

---

## Patterns

- Command file format: YAML frontmatter (`description`, `agent: headwrench`) + markdown body
- Follow existing command file patterns from `continue.md` and `activate-session.md`
- `/save` should: write current spec.json state, prompt for a save note, write a session note with that note + timestamp
- `/restore` should: read spec.json, reconstruct 3-layer todos, present summary, ask user to confirm before resuming
- Both commands should check session status first (error gracefully if no active session)
- Do NOT add `model:` field — bug in v0.6.4

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- `/save` is NOT a replacement for the automatic checkpoint — it's a mid-subtask snapshot for safety
- `/restore` should follow the same 5-tier context reload order as `continue.md`
- Update `checkpoint.md` to note that `/save` can be used for mid-subtask safety saves
- Keep both commands concise — they should be short (< 30 lines body each)

---

## Context Files

- `opencode/commands/continue.md` — model for how restore/resume works
- `opencode/protocols/checkpoint.md` — to understand the 8-step checkpoint structure and where /save fits

---

## Success Criteria

- `commands/save.md` exists and implements a mid-subtask manual save (writes spec.json + session note)
- `commands/restore.md` exists and implements context reconstruction from spec.json
- `checkpoint.md` references `/save` as an optional mid-subtask safety measure
- Neither file has a `model:` field in frontmatter

---

## Todolist

- [ ] Read `continue.md` and `checkpoint.md` for patterns
- [ ] Create `commands/save.md` — manual mid-subtask checkpoint
- [ ] Create `commands/restore.md` — reconstruct session state from spec.json
- [ ] Update `protocols/checkpoint.md` to reference /save
- [ ] [🚫 GATE] — Phase 3 eval: present summary of subtasks 01-06 and ask user to approve Phase 3 TypeScript plugin work before continuing
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
