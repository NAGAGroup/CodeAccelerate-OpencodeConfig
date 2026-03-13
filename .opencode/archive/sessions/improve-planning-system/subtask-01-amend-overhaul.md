# Subtask 01 — /amend Overhaul

## Delegation
**Agent:** @CodeWriter
**Model:** standard (claude-sonnet) — multiple interacting concerns (planning invariants, delegation, in-progress session state), requires judgment

---

## Objective

Rewrite `~/.config/opencode/commands/amend.md` from scratch. The current file is 26 lines and lacks planning workflow knowledge, no delegation re-run capability, and no awareness of in-progress session state. The rewrite must produce a command that: (1) fully understands session plan structure and invariants, (2) safely handles amendments to in-progress sessions, (3) automatically re-applies agent-delegation-expert routing after structural changes, and (4) protects completed and locked state from accidental modification.

---

## Todolist

### 1. Read current state
- [ ] Read `~/.config/opencode/commands/amend.md` (current 26-line version)
- [ ] Read `~/.config/opencode/protocols/session-plan-schema.md` (schema invariants, file structure)
- [ ] Read `~/.config/opencode/protocols/plan-workflow.md` (delegation rules, gate conventions)
- [ ] Read `~/.config/opencode/protocols/checkpoint.md` (understand spec.json currentSubtask mechanics)
- [ ] Read `~/.config/opencode/skills/agent-delegation-expert/SKILL.md` (to reference it correctly)

### 2. Design and write the new amend.md
- [ ] Write pre-amend context-loading procedure: read index.md, spec.json, AND current subtask file
- [ ] Document supported change types with safety rules for each
- [ ] Add in-progress session safety rules (cannot touch completed subtasks, in_progress requires pause)
- [ ] Add mandatory delegation re-run trigger: after any structural change, load agent-delegation-expert skill and re-apply routing to affected subtasks
- [ ] Add gate convention awareness: gates live in preceding subtask todolists, NOT as standalone subtask rows
- [ ] Add spec.json recalculation rule: if subtasks inserted before currentSubtask, recalculate the index
- [ ] Add subtask file management rules: delete file when removing subtask, create when adding, rename when reordering
- [ ] Add confirmation step: show a structured diff of all changes before writing
- [ ] Add checkpoint protocol awareness note: amending circuit breaker or protocol settings affects all remaining subtasks

### 3. Commit
- [ ] Stage and commit: `git add ~/.config/opencode/commands/amend.md && git commit -m "feat: overhaul /amend with planning workflow knowledge and in-progress safety"`

---

## Scope
- **Edit:** `~/.config/opencode/commands/amend.md`
- **Read:** `~/.config/opencode/protocols/session-plan-schema.md`, `~/.config/opencode/protocols/plan-workflow.md`, `~/.config/opencode/protocols/checkpoint.md`, `~/.config/opencode/skills/agent-delegation-expert/SKILL.md`
- **Write:** nothing new
- **Excluded:** All other files. Do not touch headwrench.md, plan.md, or any subagent definitions.

---

## Patterns

```
✅ GOOD — New amend.md is 100-150 lines, covers all cases explicitly, references correct protocol files
✅ GOOD — Safety rules clearly distinguish: "may change", "may change with recalculation", "must not change"
✅ GOOD — Delegation re-run is mandatory after structural changes, not optional
❌ BAD  — Keeping the old 26-line stub and just appending notes
❌ BAD  — Making delegation re-run optional ("optionally re-run @AgentDelegationExpert")
❌ BAD  — Allowing modification of completed subtask files
```

---

## Constraints
- The new `amend.md` must use `$ARGUMENTS` as the entrypoint (it's a slash command file — keep the frontmatter).
- Reference the **agent-delegation-expert skill** correctly (it's loaded via the `skill` tool, not invoked as a subagent).
- Do not invent new schema fields — use only fields defined in `session-plan-schema.md`.
- The confirmation diff step must happen BEFORE any files are written.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
