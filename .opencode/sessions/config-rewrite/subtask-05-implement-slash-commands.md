# Subtask 05 — Implement Slash Commands

## Delegation

**Agent:** HeadWrench (direct — no subagent)

---

## Objective

Rewrite all slash command files in `~/.config/opencode/commands/`. The core changes are: (1) add `/plan-session-type` as a new meta command, (2) update `/plan-collaborative` with the correct definition (rough-idea-to-detailed-spec), (3) add memory plugin interaction to relevant commands, and (4) ensure all planning commands trigger the planning enforcement plugin. Existing commands that don't need changes should be reviewed but left as-is if correct.

---

## Todolist

- [ ] Read `.opencode/sessions/config-rewrite/notes/design.md` for session type taxonomy and slash command decisions
- [ ] Read all existing command files in `~/.config/opencode/commands/` to inventory current state
- [ ] Rewrite `/plan-collaborative` — update description and behavior to: rough-idea-to-detailed-spec workflow; agent leads user through structured exploration steps toward a complete spec; user does NOT need to know what they want built in detail
- [ ] Write new `/plan-session-type` command — meta command that generates a new project-local session type definition; walks user through naming, trigger, artifact schema, and subtask template; writes output to `.opencode/sessions/types/{name}.md`
- [ ] Update all `/plan-<type>` commands to reference planning enforcement protocol (each must produce a plan artifact before execution begins)
- [ ] Review checkpoint commands (/save, /resume, /status equivalents) — add if missing, update if present
- [ ] Verify: all command files have valid YAML frontmatter; no `model:` field (it's bugged in v0.6.4 — omit it)

---

## Scope

- **Write:** all files in `~/.config/opencode/commands/` that need changes + new `/plan-session-type` command
- **Read:** all current command files, `design.md`
- **Do NOT touch:** agent files, protocol files, opencode.json

---

## Patterns

- Command file frontmatter: `name:`, `description:` — do NOT include `model:` (bugged in v0.6.4)
- Each `/plan-<type>` command body should reference: plan artifact schema, enforcement protocol trigger, output location
- `/plan-collaborative` body must include the definition box: "Use when you have a rough idea but cannot fully spec the outcome upfront. The agent leads you through structured exploration steps. Output is a complete spec."
- `/plan-session-type` should produce output at `.opencode/sessions/types/{name}.md`

---

## Constraints

- Do NOT add `model:` field to any command file — it is ignored/bugged in v0.6.4
- All /plan-<type> commands must be consistent with each other in structure
- `/plan-collaborative` must NOT be described as "general collaboration" anywhere

---

## Success Criteria

- `/plan-collaborative` file contains the rough-idea-to-detailed-spec definition prominently
- `/plan-session-type` exists and produces a session type definition file
- All /plan-<type> commands reference the planning enforcement protocol
- No command file has a `model:` field
- All frontmatter is valid YAML

---

_Checkpoint: commit as `wip: subtask 05 complete — implement slash commands`_
