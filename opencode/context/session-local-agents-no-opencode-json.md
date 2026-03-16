---
topic: session-local-agent-pattern
tier: global
promoted_from: inbox
session: audit-complete
created: 2026-03-15
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# Session-Local Agents Don't Need opencode.json

Session-local agents placed in `.opencode/agents/` (project-local) are auto-loaded by opencode without any entry in `opencode.json`. This is analogous to how global agents in `~/.config/opencode/agents/` work.

## Pattern

When HeadWrench creates a session-local agent via the `agent-writer` skill:
- Write the agent `.md` file with YAML frontmatter to `.opencode/agents/`
- **Do NOT add an entry to `opencode.json`**
- The agent will be immediately available to the session

## Permission Note

All permissions must live in the YAML frontmatter (not the markdown body). Use `"*": deny` as the root default, then explicitly allow required tools.

## Reference

- `~/.config/opencode/skills/agent-writer/SKILL.md` — full workflow
