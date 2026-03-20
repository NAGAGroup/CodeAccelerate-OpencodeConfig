# Subtask 04 — agent-operational-limits

## Delegation
**Agent:** @config-implementer  
**Reason:** Multi-file edits adding operational limit fields across agent files and skill templates — standard implementation work.

---

## Objective

Add `max_rpm` and `max_execution_time` operational limit fields to agent frontmatter and to the skill templates in both SKILL.md files. The `steps:` field (already present) already serves as `max_iter` — document that equivalence. This closes the gap where agent designs lacked hard operational guardrails beyond the `steps` limit.

Files to update:
1. `opencode/agents/subagents/context-scout.md` — add `max_rpm` and `max_execution_time`
2. `opencode/agents/subagents/context-insurgent.md` — add `max_rpm` and `max_execution_time`
3. `opencode/agents/subagents/deep-researcher.md` — add `max_rpm` and `max_execution_time`
4. `opencode/skills/agent-writer/SKILL.md` — add `max_rpm` and `max_execution_time` to the implementation agent template
5. `opencode/skills/agent-delegation-expert/SKILL.md` — update permission templates to show the new fields

Note: `headwrench.md` does NOT get these fields — HeadWrench is the primary orchestrator and does not have operational rate limits.

---

## Scope

### In Scope
- `opencode/agents/subagents/context-scout.md`
- `opencode/agents/subagents/context-insurgent.md`
- `opencode/agents/subagents/deep-researcher.md`
- `opencode/skills/agent-writer/SKILL.md`
- `opencode/skills/agent-delegation-expert/SKILL.md`

### Out of Scope
- `opencode/agents/headwrench.md`
- Any other files
- Changing existing permissions, system prompts, or behavioral content

---

## Patterns

- `max_rpm: 20` — reasonable default for subagents (requests per minute)
- `max_execution_time: 300` — 5 minutes in seconds; context-insurgent may warrant 600 (10 min)
- Fields go in YAML frontmatter alongside `steps:`, `color:`, etc.
- In SKILL.md templates: show `max_rpm` and `max_execution_time` as optional fields with comments
- Document the `steps:` = `max_iter` equivalence in a comment or note

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT change system prompt content, permission blocks, or behavioral rules in any agent file
- context-scout: `max_rpm: 20`, `max_execution_time: 300`
- context-insurgent: `max_rpm: 10`, `max_execution_time: 600` (deeper analysis, longer allowed)
- deep-researcher: `max_rpm: 5`, `max_execution_time: 300` (rate-limited by external APIs)
- In skill templates: show fields as `# optional` with suggested defaults

---

## Success Criteria

- All 3 subagent files have `max_rpm` and `max_execution_time` in their YAML frontmatter
- Both SKILL.md implementation templates include `max_rpm` and `max_execution_time` as optional fields
- A note clarifies that `steps:` serves as `max_iter` in both skill templates
- `headwrench.md` is unchanged

---

## Todolist

- [ ] Read all 5 target files
- [ ] Add `max_rpm` and `max_execution_time` to `context-scout.md` frontmatter
- [ ] Add `max_rpm` and `max_execution_time` to `context-insurgent.md` frontmatter
- [ ] Add `max_rpm` and `max_execution_time` to `deep-researcher.md` frontmatter
- [ ] Update `agent-writer/SKILL.md` implementation template with new fields + `steps:` note
- [ ] Update `agent-delegation-expert/SKILL.md` templates with new fields + `steps:` note
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
