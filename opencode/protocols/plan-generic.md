# plan-generic.md — Generic Session Type

The Generic session type handles new features, refactors, migrations, documentation updates, and any multi-step implementation work. This is the default session type.

## Flow

1. **Phase 1** — Run `plan-init.md`
2. **Shared steps** — Run `plan-shared.md`
3. **Subtask decomposition** — See below
4. **Apply delegation** — Load agent-delegation-expert skill
5. **Finalization** — Run `plan-end.md`

## Subtask Decomposition Rules

Break the work into numbered subtasks. Each subtask must have:

- **Objective** — One paragraph describing what will be done and why
- **Scope** — Edit / Write / Delete / Excluded lists (be explicit; list every file touched)
- **Constraints** — Specific requirements, patterns to follow, things to avoid
- **Todolist** — 3–8 actionable items; use `[🚫 GATE]` for any human-review checkpoints
- **Delegation** — Agent and reason (filled in after applying the delegation skill)

### Sizing Guidelines

- **Minimum**: 3 todos per subtask. If a task is smaller, fold it into an adjacent subtask.
- **Maximum**: 8 todos per subtask. If a task is larger, split it.
- Avoid mega-subtasks that touch too many unrelated files.
- Avoid micro-subtasks that just move text around.

### Ordering Rules

1. Dependencies first — if subtask B reads output from subtask A, A comes first
2. Deletions before edits that reference deleted content
3. Protocol/schema fixes before commands that reference them
4. Gates before subtasks that require human review — embed `[🚫 GATE]` in the **preceding subtask's todolist**, not as a standalone subtask row

### Gate Placement

A gate is a `[🚫 GATE]` todo item inside a subtask's `## Todolist`. At checkpoint time, HeadWrench checks for gates before transitioning to the next subtask. If a gate is found, HW stops, surfaces findings to the user, and waits for explicit approval before continuing.

Use gates when:
- A decision depends on intermediate results that aren't known at planning time
- The next subtask is risky or irreversible (schema migrations, deletions, API changes)
- The user requested review at a specific point

## Applying Delegation

After subtask decomposition is complete, load the **agent-delegation-expert skill** (`~/.config/opencode/skills/agent-delegation-expert/SKILL.md`) and apply its routing rules to assign an agent to each subtask. Write the assignment into each subtask's `## Delegation` section before writing files.
