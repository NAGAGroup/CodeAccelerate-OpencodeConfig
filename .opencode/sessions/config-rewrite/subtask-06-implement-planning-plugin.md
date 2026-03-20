# Subtask 06 — Implement Planning Enforcement Plugin

## Delegation

**Agent:** HeadWrench (direct — no subagent)

---

## Objective

Implement the planning enforcement plugin. Based on design decisions in `design.md` and the plugin API research from subtask 01 notes, write a TypeScript npm package that enforces "plan-first" behavior: the plugin intercepts execution and blocks it until a valid plan artifact exists for the current session. This is the programmatic enforcement mechanism that replaces the old markdown-only approach.

---

## Todolist

- [ ] Read `.opencode/sessions/config-rewrite/notes/design.md` for enforcement approach decisions
- [ ] Read `.opencode/sessions/config-rewrite/notes/` for plugin API findings from subtask 01 (Slot B output)
- [ ] Scaffold new npm package at `plugins/planning-enforcement/` with: package.json, tsconfig.json, src/index.ts
- [ ] Implement plugin using the opencode plugin API:
  - Hook into `chat.params` or equivalent to detect if a plan artifact exists
  - If no plan artifact found for the current session: inject a system message instructing the agent to run /plan before proceeding; optionally hard-block further tool execution
  - Plan artifact detection: check for `.opencode/sessions/{session-name}/spec.json` with status not "pending"
  - Allow bypass for planning commands themselves (avoid infinite loop)
- [ ] Write `package.json` with correct name (matching whatever was decided in design.md for the plugin identifier)
- [ ] Add build script and verify TypeScript compiles
- [ ] Write plugin registration instructions to notes: how to add to opencode.json plugin array

---

## Scope

- **Write:** `plugins/planning-enforcement/` (new directory, all files)
- **Read:** design.md, subtask 01 notes (plugin API findings)
- **Do NOT touch:** opencode.json (plugin registration happens in subtask 03), existing plugins

---

## Patterns

- Plugin package structure: `{"name": "@local/opencode-planning-enforcement", "main": "dist/index.js", "scripts": {"build": "tsc"}}`
- Plugin API: follow the exact hook signatures found in subtask 01 research notes
- Plan artifact detection should be lightweight — file existence check only, not schema validation
- Bypass detection: if the current message content starts with `/plan`, skip enforcement

---

## Constraints

- Plugin must NOT block the `build` agent (escape hatch must remain functional)
- Plugin must NOT interfere with DCP plugin behavior
- Hard-blocking approach preferred over soft nudge (per design.md enforcement decision)
- Plugin must handle the case where no session is active (no-op in that case)

---

## Success Criteria

- TypeScript compiles without errors (`npm run build` succeeds)
- Plugin correctly detects plan artifact absence and blocks/nudges appropriately
- Plugin correctly bypasses enforcement for /plan commands
- `build` agent is excluded from enforcement
- Plugin package name matches whatever design.md specifies

---

_Checkpoint: commit as `wip: subtask 06 complete — implement planning plugin`_
