---
topic: agent-taxonomy-4-global-plus-session-local
tier: local
promoted_from: inbox
session: audit-complete
created: 2026-03-15
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# Agent Taxonomy: 4 Global Agents + Session-Local Pattern

As of the audit-complete session, the opencode-config agent roster is:

## Global Agents (always available)

| Agent | Role |
|-------|------|
| HeadWrench | Primary orchestrator |
| ContextScout | Read-only situational awareness |
| ContextInsurgent | Deep multi-file exploration, sequential reasoning |
| DeepResearcher | Web search, docs research (exa MCP) |

## Session-Local Agents (created per session)

- HW creates these during plan finalization using the `agent-writer` skill
- Stored in `.opencode/agents/` — auto-loaded by opencode, no opencode.json entry needed
- `PLACEHOLDER_MODEL_ID` in frontmatter; user fills in before `start`
- Typical name: `session-local-implementer` for code/doc work

## Deleted Global Agents

- `@CodeWriter` — deleted, replaced by session-local pattern
- `@DocWriter` — deleted, replaced by session-local pattern
- `@SubagentBuilder` — deleted, replaced by agent-writer skill (HW creates agents directly)
- `@Architect` — deleted (ST01, prior session)
- `@explorer` — disabled (built-in)
- `@GatesExpert` — deleted (prior session)
