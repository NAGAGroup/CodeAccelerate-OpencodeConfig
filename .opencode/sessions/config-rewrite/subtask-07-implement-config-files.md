# Subtask 07 — Implement: opencode.json, headwrench.md, Slash Commands, Session Type Protocols

## Delegation
**Agent:** HeadWrench direct
**Model:** anthropic/claude-sonnet-4-6

---

## Objective
Implement all remaining config files: opencode.json, headwrench.md, all slash commands, and all session type protocol files. These are the non-plugin config layer that supports the DAG execution system.

---

## Context
Read before writing:
- `notes/dag-node-schema.md` — DAG node schema
- `notes/plan-generic-design.md` — /plan-generic design
- `notes/plan-debug-design.md` — /plan-debug design
- `notes/plan-collaborative-design.md` — /plan-collaborative design
- Current `~/.config/opencode/agents/headwrench.md` — existing primary agent (reference only)
- Current `~/.config/opencode/commands/` — existing slash commands (reference only)
- Current `~/.config/opencode/protocols/` — existing protocols (reference only)

---

## Todolist

### opencode.json
- [ ] Write `opencode/opencode.json` from scratch
  - Plugins: DCP (`@tarquinen/opencode-dcp@latest`), planning-enforcement (local path: `plugins/planning-enforcement`)
  - MCPs: context7, sequential-thinking, exa, OMEGA Memory (`pip install omega-memory[server]` → local MCP config)
  - Agents: headwrench (default, sonnet), subagents/context-scout (haiku), subagents/context-insurgent (sonnet), subagents/deep-researcher (haiku), compaction (haiku)
  - Disabled: plan, general, explore; keep: build
  - `autoupdate: false`, `small_model: "opencode/big-pickle"`

### headwrench.md
- [ ] Rewrite `~/.config/opencode/agents/headwrench.md` from scratch
  - Role: orchestrator — plans, delegates, drives sessions. NOT a doer.
  - OMEGA Memory protocol: query at session start (before planning), write at each checkpoint
    - Memory types: architectural-decision (30d), technology-choice (90d), error-pattern (7d), build-convention (30d)
    - NOT in OMEGA: session progress (→ spec.json), task notes (→ notes/), in-context data (→ DCP)
  - Planning: every session starts with /plan-<type>; session type selection logic
  - DAG execution: HW reads plan.json; routing decisions already in plan; no mid-session agent switching
  - Checkpoint protocol (8-step, same as current convention)
  - Session bootstrap, compaction recovery, subtask transition
  - Routing table: mechanical → haiku, standard → sonnet, complex → o1-mini
  - Commit ownership: HW owns all commits

### Slash Commands
- [ ] Rewrite all `~/.config/opencode/commands/`
  - /plan (no specific type — prompts user to choose type)
  - /plan-generic, /plan-debug, /plan-collaborative, /plan-deep-research
  - /plan-session-type (new — meta session type generator, outputs `.opencode/sessions/types/{name}.md`)
  - /continue, /session-status, /activate-plan (replaces activate-session)
  - /amend (git amend helper)
  - NO `model:` field anywhere (bugged in v0.6.4 — ignored)
  - All /plan-* commands: reference that plugin will drive the DAG once command fires

### Session Type Protocols
- [ ] Rewrite all `~/.config/opencode/protocols/`
  - plan-generic.md: standard build session protocol
  - plan-debug.md: investigation/diagnosis protocol
  - plan-collaborative.md: rough-idea-to-spec (MUST include prominent definition box)
  - plan-deep-research.md: multi-source research + synthesis
  - plan-session-type.md: meta — generates `.opencode/sessions/types/{name}.md`
  - plan-shared.md: shared steps across all session types
  - plan-init.md: session initialization
  - plan-end.md: session close
  - checkpoint.md: 8-step checkpoint protocol (updated for DAG system)
  - context-management.md: updated for OMEGA + DCP + spec.json model
  - session-plan-schema.md: updated schema (add ## Context Files, ## Success Criteria, dag-state.json ref)

---

## Scope
- All non-plugin config files
- Global config at `~/.config/opencode/`
- Project config at `opencode/opencode.json`
- Out of scope: plugin TypeScript source (subtask 06), subagent files (subtask 08)

## Constraints
- No `model:` field in slash command YAML (bugged v0.6.4)
- /plan-collaborative MUST have prominent rough-idea-to-spec definition — not general collaboration
- OMEGA Memory MCP must be wired correctly in opencode.json
- headwrench.md must NOT contain step-by-step DAG execution logic (plugin handles that); HW's role is orchestration and decision-making

## Verification
- `opencode.json` parses as valid JSON
- All slash commands have correct YAML frontmatter
- headwrench.md clearly defines memory protocol, routing table, and commit ownership

---

*Checkpoint: `wip: subtask 07 complete — config files`*
