# Session: ade-subagent-to-skill

## Goal
Convert `agent-delegation-expert` from a specialized subagent to an opencode skill loaded by HeadWrench during the planning phase. HeadWrench applies the delegation rules itself rather than dispatching a subagent. SubagentBuilder continues to handle custom agent creation — HW briefs it with what it needs, not a detailed spec.

## Done Criteria
- [x] `opencode/skills/agent-delegation-expert/SKILL.md` exists with valid frontmatter and complete delegation rules
- [x] `opencode/agents/subagents/agent-delegation-expert.md` is removed
- [x] `subagents/agent-delegation-expert` model entry removed from `opencode/opencode.json`
- [x] `opencode/agents/headwrench.md` references skill invocation instead of subagent dispatch
- [x] `opencode/protocols/plan-workflow.md` Phase 5 updated to skill invocation
- [x] `opencode/commands/plan.md` Phase 5 updated to skill invocation
- [x] All changes committed on `simple-rewrite`

## Subtasks

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Create `opencode/skills/agent-delegation-expert/SKILL.md` |
| G1 | ✅ completed | Verify skill content before removing subagent and updating references |
| 02 | ✅ completed | Remove subagent file + remove model entry from opencode.json |
| 03 | ✅ completed | Update references in headwrench.md, plan-workflow.md, plan.md |
| 04 | ✅ completed | Final commit and close session |

> `[🚫 GATE]` items are non-negotiable stops requiring explicit user approval before proceeding.

---

## Gates

### G1 — Skill Content Verification (before subtask 02)
Subtask 01 has created the skill file. Before removing the subagent and updating all references:
1. Read `opencode/skills/agent-delegation-expert/SKILL.md` end-to-end.
2. Confirm delegation rules, model tier guidance, custom agent criteria, and SubagentBuilder briefing instructions are complete and accurate.
3. Confirm SKILL.md frontmatter is valid (`name` matches directory, `description` ≤1024 chars).

Approve to proceed to subtask 02. Reject to revise the skill first.

---

## Current Focus

**Next:** Subtask 01 — Create skill file.

---

## Scope

### In scope
- `opencode/skills/agent-delegation-expert/SKILL.md` — new file
- `opencode/agents/subagents/agent-delegation-expert.md` — delete
- `opencode/opencode.json` — remove `subagents/agent-delegation-expert` model entry
- `opencode/agents/headwrench.md` — update Phase 5 reference
- `opencode/protocols/plan-workflow.md` — update Phase 5 reference
- `opencode/commands/plan.md` — update Phase 5 reference

### Out of scope
- No changes to other subagent files
- No changes to session-plan-schema.md or checkpoint.md
- No changes to other commands

---

## Patterns & Constraints

- **`./opencode/`** is the deliverable config (installs to `~/.config/opencode/` for users). `.opencode/` is project-local runtime state for working on this repo.
- **Skill file path**: `opencode/skills/agent-delegation-expert/SKILL.md` — directory name must match `name` field in frontmatter
- **SKILL.md** (all caps) is required
- **Skill content** must cover: when to invoke, agent routing rules, model tier rules, custom agent proposal criteria, SubagentBuilder briefing guidance, output format (write into subtask-NN `## Delegation` sections — never spec.json)
- **New HW flow**: HW loads skill → HW applies rules itself → HW writes assignments into subtask files. No subagent dispatch.
- **SubagentBuilder guidance**: "Tell it what you need (purpose, behavior, constraints) — not how to build it"
- **Agent/model invariant**: assignments go in subtask-NN `## Delegation` sections only, never in spec.json
- **Branch**: `simple-rewrite`, commit prefix: `fix:`
- **Circuit breaker**: 3 consecutive failures
- **Architect**: disabled
- **Docs/config only** — no TypeScript changes
