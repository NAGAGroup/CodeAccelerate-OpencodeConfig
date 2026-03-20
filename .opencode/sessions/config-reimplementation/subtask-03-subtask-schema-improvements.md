# Subtask 03 — subtask-schema-improvements

## Delegation
**Agent:** @config-implementer  
**Reason:** Targeted additions to a schema document — standard implementation work.

---

## Objective

Update `opencode/protocols/session-plan-schema.md` to add two missing sections to the subtask file schema:

1. **`## Context Files`** — a list of specific files the agent should read before starting work. This replaces the implicit "read relevant files" instruction with an explicit, structured list. Format: file path + one-line reason.
2. **`## Success Criteria`** — explicit, verifiable conditions that must be true for the subtask to be considered complete. This closes the gap where subtasks had objectives but no explicit done-conditions.

Both sections should be added to the subtask template and to the schema documentation.

---

## Scope

### In Scope
- `opencode/protocols/session-plan-schema.md` — sole target file

### Out of Scope
- All other files
- Changing existing sections (Delegation, Objective, Todolist, Scope, Patterns, Constraints)
- Adding `plan.json` DAG structure (deferred to a future session)

---

## Patterns

- Follow existing section header style (`## Section Name`)
- Context Files format: `- \`path/to/file\` — reason to read it`
- Success Criteria format: bullet list of verifiable statements (e.g., "File X contains field Y")
- New sections slot in after `## Objective` and before `## Todolist` in the recommended subtask structure
- The schema documentation should show both sections as optional (may be absent for simple subtasks)

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT remove or change existing schema sections
- `## Context Files` should note that it's optional — simple subtasks may not need it
- `## Success Criteria` is strongly recommended — add a note that it helps agents know when to stop
- Show an example of each section in the schema documentation

---

## Success Criteria

- `session-plan-schema.md` shows `## Context Files` in the subtask schema with format example
- `session-plan-schema.md` shows `## Success Criteria` in the subtask schema with format example
- Both sections are marked optional but the schema notes that Success Criteria is strongly recommended
- The recommended subtask section order is documented (Delegation → Objective → Context Files → Success Criteria → Todolist → Scope → Patterns → Constraints)

---

## Todolist

- [ ] Read `opencode/protocols/session-plan-schema.md` in full
- [ ] Add `## Context Files` section to the subtask schema (format, example, optional note)
- [ ] Add `## Success Criteria` section to the subtask schema (format, example, recommendation note)
- [ ] Update the recommended subtask section order documentation
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
