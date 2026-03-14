# Subtask 01 — context-scout-sweep

## Objective

Perform a surface-level audit sweep of all production config files in `opencode/` using a strict fresh-reader lens. The primary test: **can a reader correctly identify the full feature set of this system from the config files alone, without prior knowledge?** Surface obvious inconsistencies, naming drift, and cross-reference gaps to focus the deeper dives.

This is a breadth-first pass only — note potential issues, not definitive conclusions.

---

## Scope

**Read**:
- `opencode/headwrench.md`
- `opencode/subagents/` — all 8 agent files (architect.md, code-writer.md, context-insurgent.md, context-scout.md, deep-researcher.md, doc-writer.md, gates-expert.md, subagent-builder.md)
- `opencode/protocols/` — all 4 files (plan-workflow.md, checkpoint.md, session-plan-schema.md, context-management.md)
- `opencode/commands/` — all 10 files
- `opencode/skills/agent-delegation-expert/SKILL.md`
- `opencode/opencode.json`
- `README.md`, `FEATURES.md`, `CHANGELOG.md`

**Write**:
- `.opencode/sessions/opencode-config-audit/notes/01-surface-sweep.md`

**Excluded**:
- `.opencode/` runtime state (sessions, inbox, archive, node_modules)
- Any file not in the explicit Read list above

---

## Constraints

- Treat everything as unknown — no prior knowledge assumed
- Surface check only; do not attempt to deeply analyze — flag items for deeper dives
- Must assess these specific dimensions:
  1. **Feature-set comprehensibility**: Can a fresh reader identify all agents, their roles, their models, and their correct invocation contexts from the config alone?
  2. **Agent permission vs. instruction alignment**: Does each agent's permission block match what its instructions say it does?
  3. **Protocol cross-references**: Do agents/commands reference protocols consistently and accurately?
  4. **Component naming consistency**: Are agent names, command names, and protocol references consistent across files?
  5. **opencode.json alignment**: Does opencode.json match what the agent files claim (model assignments, plugin entries, MCP configs)?
  6. **Documentation accuracy**: Do README.md and FEATURES.md accurately describe what's actually implemented?
- Write findings as a structured note: one section per dimension, with severity tags (Critical / High / Medium / Low / Info) and specific file references

---

## Todolist

- [ ] Read headwrench.md and all 8 subagent files
- [ ] Read all 4 protocol files
- [ ] Read all 10 command files
- [ ] Read skill file and opencode.json
- [ ] Read README.md, FEATURES.md, CHANGELOG.md
- [ ] Write structured findings to `notes/01-surface-sweep.md`
- [🚫 GATE] User reviews surface sweep findings — approve before deep dives begin

---

## Delegation

**Agent**: @ContextScout (`subagents/context-scout`)  
**Model**: haiku-4.5 (standard for scout work)  
**Rationale**: Read-only surface sweep; ContextScout is purpose-built for this. No write permissions needed beyond session notes (which ContextScout can write via its allowed tools).
