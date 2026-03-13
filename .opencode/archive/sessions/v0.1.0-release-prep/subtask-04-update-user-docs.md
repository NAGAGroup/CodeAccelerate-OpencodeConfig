# Subtask 04 — Audit and Update User Docs

## Delegation
- **Agent:** DocWriter
- **Model tier:** standard — github-copilot/claude-haiku-4.5
- **Reason:** Documentation audit and rewrite requiring comparison against current implementation. DocWriter handles docs updates; standard tier because it requires reading multiple source-of-truth files and making judgment calls about accuracy vs. current state.

---

## Objective

Audit all user-facing documentation against the current implementation and update anything that is inaccurate, incomplete, or missing. The goal is that when v0.1.0 ships, every doc file accurately reflects what the system actually does today.

The four user-facing docs are:
- `README.md` (repo root)
- `FEATURES.md` (repo root)
- `docs/CONCEPTS.md`
- `docs/USAGE.md`

---

## Todolist

### 1. Read source-of-truth files (current implementation)
- [ ] Read `opencode/agents/headwrench.md` — current orchestrator behavior
- [ ] Read `opencode/protocols/checkpoint.md` — current 8-step protocol
- [ ] Read `opencode/protocols/plan-workflow.md` — current /plan phases
- [ ] Read `opencode/protocols/session-plan-schema.md` — current spec.json + subtask file format
- [ ] Read `opencode/commands/` — all 9 command files for accurate descriptions
- [ ] Read `opencode/plugins/session-context.ts` — for accurate plugin description
- [ ] Read `opencode/skills/agent-delegation-expert/SKILL.md` — for accurate skill description
- [ ] Read `opencode/opencode.json` — for accurate agent model assignments

### 2. Audit each doc against current implementation
- [ ] `README.md` — check install instructions, feature list, agent table, quick start
- [ ] `FEATURES.md` — check every component entry (agents, commands, protocols, skills, plugins, MCPs) against actual files
- [ ] `docs/CONCEPTS.md` — check conceptual accuracy: session model, todo layers, checkpoint protocol, delegation model
- [ ] `docs/USAGE.md` — check all command examples and workflow descriptions

### 3. Update each doc as needed
- [ ] Update `README.md` with any corrections
- [ ] Update `FEATURES.md` with any corrections (this is the authoritative inventory)
- [ ] Update `docs/CONCEPTS.md` with any corrections
- [ ] Update `docs/USAGE.md` with any corrections

### 4. Checkpoint
- [ ] Follow checkpoint protocol (WIP commit includes all doc updates)

---

## Scope
- **Edit:** `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md` — only where inaccurate or incomplete
- **Read:** all `opencode/` agent, protocol, command, plugin, skill, and config files (source of truth)
- **Write:** nothing new
- **Excluded:** Any changes to `opencode/` config files themselves; any changes to `.opencode/sessions/` content; do not rewrite docs that are already accurate

---

## Patterns
```
✅ GOOD — Cross-reference each doc claim against actual file content before editing
❌ BAD  — Rewrite accurate sections just to reword them (unnecessary churn)
✅ GOOD — Update FEATURES.md first (it's the authoritative inventory; others can reference it)
❌ BAD  — Leave FEATURES.md stale while updating other docs
✅ GOOD — Preserve tone and structure of existing docs; only change what's inaccurate
❌ BAD  — Full rewrites of docs that only need minor corrections
```

---

## Constraints
- Only fix what's actually wrong or missing — do not rewrite accurate content
- `FEATURES.md` is the authoritative component inventory — if it conflicts with another doc, FEATURES.md wins and the other doc should be updated
- Agent model names must match `opencode/opencode.json` exactly
- Command names and descriptions must match the actual command files in `opencode/commands/`
- The 3-layer todo stack and 8 checkpoint steps must be accurately described in CONCEPTS.md and USAGE.md if they appear there

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
