# Subtask 07 — Implement Session Type Protocol Files

## Delegation

**Agent:** HeadWrench (direct — no subagent)

---

## Objective

Write the protocol files for each supported session type. Each session type gets its own protocol file in `~/.config/opencode/protocols/` that defines: trigger command, artifact schema, step sequence, and termination conditions. The design decisions in `design.md` drive the taxonomy.

---

## Todolist

- [ ] Read `.opencode/sessions/config-rewrite/notes/design.md` for session type taxonomy decisions
- [ ] Read existing protocol files in `~/.config/opencode/protocols/` to understand current structure and what to keep vs replace
- [ ] Write/update `plan-generic.md` — standard plan-and-execute flow; fully specced upfront; triggers /plan-generic
- [ ] Write/update `plan-debug.md` — investigation flow; hypothesis → test → confirm; triggers /plan-debug
- [ ] Write/update `plan-collaborative.md` — emergent spec flow; rough-idea-to-detailed-spec; agent leads structured exploration; output is a complete spec document; triggers /plan-collaborative
  - Must include prominent definition: "Use when you cannot fully spec the outcome upfront. Agent leads structured exploration. Output is a complete spec."
  - Must NOT describe this as general collaboration
- [ ] Write/update `plan-deep-research.md` — research-first flow; DeepResearcher dispatched; triggers /plan-deep-research
- [ ] Write new `plan-session-type.md` — meta session type; generates a new project-local session type definition file; output goes to `.opencode/sessions/types/{name}.md`
- [ ] Write/update `plan-shared.md` — shared steps common to all session types (Q&A, sequential thinking synthesis, checkpoint approval)
- [ ] Write/update `plan-init.md` — initialization steps common to all session types (project layout, ContextScout dispatch, synthesis, session type selection)
- [ ] Write/update `plan-end.md` — session close steps
- [ ] Verify: all protocol files are consistent with each other; no references to config-writer agent; all session types covered

---

## Scope

- **Write:** all files in `~/.config/opencode/protocols/` that need changes or creation
- **Read:** current protocol files, `design.md`
- **Do NOT touch:** command files, agent files, opencode.json

---

## Patterns

- Protocol files are plain Markdown — no frontmatter required
- Each plan-<type>.md should open with: `## Session Type: <name>` and a 1-sentence definition
- plan-collaborative.md must have a definition box at the top — see slash command file for the phrasing
- plan-session-type.md output artifact location: `.opencode/sessions/types/{name}.md`

---

## Constraints

- plan-collaborative.md must be distinct from plan-generic.md in purpose and step sequence
- All session types must reference plan-shared.md for common steps (avoid duplication)
- plan-session-type.md is a meta session type — its output is a new session type definition, not an implementation

---

## Success Criteria

- All session types from design.md taxonomy are covered
- plan-collaborative.md contains the rough-idea-to-detailed-spec definition prominently
- plan-session-type.md exists and its output path is `.opencode/sessions/types/{name}.md`
- All protocol files are internally consistent (shared steps delegated to plan-shared.md)

---

_Checkpoint: commit as `wip: subtask 07 complete — implement session type protocols`_
