# agent-writer-skill-replaces-subagent-builder

**Session:** audit-complete  
**Created:** 2026-03-15  

## Summary

The SubagentBuilder global agent has been deleted and replaced by the **agent-writer skill** pattern. HeadWrench now creates session-local implementation agents directly during plan finalization.

## New Pattern

1. During plan finalization (plan-end.md Step 3), HW loads `~/.config/opencode/skills/agent-writer/SKILL.md`
2. For each subtask needing implementation/doc work, HW writes a session-local agent `.md` file to `.opencode/agents/`
3. Agent frontmatter includes `PLACEHOLDER_MODEL_ID` as the model value
4. User is instructed: "Before running 'start', update `PLACEHOLDER_MODEL_ID` in `.opencode/agents/{name}.md` with your preferred model. Restart opencode after updating."
5. Session bootstrap (headwrench.md) checks `.opencode/agents/` for session-local agents and warns if `PLACEHOLDER_MODEL_ID` is still present

## Key Behavior

- Session-local agents in `.opencode/agents/` are auto-loaded by opencode — no `opencode.json` entry needed
- Permissions must be in YAML frontmatter (not markdown body)
- Agent file is committed as part of the session plan commit (`plan: add session {name}`)
- The agent-delegation-expert SKILL.md has been updated to reference this pattern: when any subtask needs implementation, delegate uses "@session-local-implementer" and the SKILL.md tells HW to load agent-writer to create the agent

## Files Changed

- `opencode/agents/subagents/subagent-builder.md` — DELETED
- `opencode/skills/agent-writer/SKILL.md` — NEW (ST06)
- `opencode/skills/agent-delegation-expert/SKILL.md` — updated routing table (ST07)
- `opencode/agents/headwrench.md` — agent creation workflow in /plan step 7 and Session Bootstrap (ST08)
- `opencode/protocols/plan-end.md` — Step 3 session-local agent creation (ST09)
