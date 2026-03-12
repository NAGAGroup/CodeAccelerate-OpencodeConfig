# Subtask 02 — Compaction Survival

## Delegation
**Agent:** @CodeWriter
**Model:** standard (claude-sonnet) — touches three files with interlocking concerns; needs judgment about what state is needed post-compaction

---

## Objective

Improve the system's ability to survive context autocompaction without losing session state. Specifically: (1) strengthen the session summary todo format so it contains enough state to re-orient without chat history, (2) add a compaction recovery procedure to `headwrench.md` describing exactly what to re-read after losing context, and (3) add a brief recovery anchor note to `checkpoint.md` explaining that `spec.json` is always the authoritative state source.

---

## Todolist

### 1. Read current state
- [ ] Read `~/.config/opencode/protocols/session-plan-schema.md` — focus on "Session Summary Todo" section (lines ~149-176)
- [ ] Read `~/.config/opencode/agents/headwrench.md` — understand current session bootstrap and during-session sections
- [ ] Read `~/.config/opencode/protocols/checkpoint.md` — understand current checkpoint steps

### 2. Strengthen session summary todo format
- [ ] In `session-plan-schema.md`, expand the Session Summary Todo spec:
  - The todo must include: session name, goal, `spec.json` path, `index.md` path, current subtask number + description, and the phrase "If context lost: read spec.json → load current subtask file → rebuild todo stack"
  - Update the example to show the richer format
  - Add a note that this todo must be rich enough to re-bootstrap without any chat history

### 3. Add compaction recovery procedure to headwrench.md
- [ ] In `headwrench.md`, add a new section "## Compaction Recovery" (or integrate into existing session bootstrap section) with these steps:
  1. If you wake up without session context, check the Layer 1 todo first
  2. If Layer 1 todo is missing or stale: read `.opencode/sessions/{name}/spec.json` to find `currentSubtask`
  3. Load only the current `subtask-NN-{name}.md` file
  4. Reconstruct the 3-layer todo stack (Layer 1 from spec.json + index.md, Layer 2 from subtask Todolist, Layer 3 fixed 8-step checkpoint)
  5. Resume work — do not restart the subtask unless explicitly instructed

### 4. Add recovery anchor note to checkpoint.md
- [ ] In `checkpoint.md`, after the WIP commit step (step 1), add a brief note: "The WIP commit ensures that `spec.json` reflects current state. This file is the authoritative recovery anchor — if context is lost, reading `spec.json` is always the correct first step."

### 5. Commit all changes
- [ ] Stage and commit all three modified files: `git add -A && git commit -m "feat: strengthen compaction survival — richer session todo + recovery procedures"`

---

## Scope
- **Edit:** `~/.config/opencode/protocols/session-plan-schema.md` (Session Summary Todo section only)
- **Edit:** `~/.config/opencode/agents/headwrench.md` (add compaction recovery section)
- **Edit:** `~/.config/opencode/protocols/checkpoint.md` (add recovery anchor note after step 1)
- **Read:** same three files above
- **Write:** nothing new
- **Excluded:** All other files. Do not touch amend.md, plan.md, or subagent definitions.

---

## Patterns

```
✅ GOOD — Session summary todo is a self-contained re-bootstrap recipe, not just a status label
✅ GOOD — Recovery procedure is deterministic: spec.json → current subtask file → rebuild todos
✅ GOOD — WIP commit step explicitly links to recovery (spec.json always up to date after commit)
❌ BAD  — Recovery procedure requires reading multiple files in unspecified order
❌ BAD  — Session summary todo only contains "Subtask 03 — fix schema" with no paths or goal
❌ BAD  — Adding a recovery procedure that contradicts existing bootstrap steps
```

---

## Constraints
- Do not restructure existing sections in these files — add the new content in the most logical location.
- The recovery procedure must be consistent with the existing session bootstrap steps in `headwrench.md`.
- The session summary todo example must use realistic placeholder values.
- Do not add more than ~20 lines to `checkpoint.md` — keep the note brief.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
