---
created: 2026-03-15
session: audit-complete
subtask: 07
topic: delegation skill rewrite
---

# agent-delegation-expert SKILL.md Rewrite — ST07

## What Changed

Full rewrite of `opencode/skills/agent-delegation-expert/SKILL.md`:

- **Removed:** `@CodeWriter`, `@DocWriter`, `@SubagentBuilder`, `@explorer`, `@Architect` — all dead/deleted agents
- **Removed:** Model tier system (fast/haiku, standard/sonnet, deep/opus) — was described as runtime no-ops in AUDIT.md
- **Removed:** `**Model:**` field from Output Format — delegation sections now only need Agent + Reason
- **Added:** `@ContextInsurgent` to routing table with type "read-only + deep"
- **Added:** "Session-Local Implementation Agents" section — guides HW to load agent-writer skill for implementation subtasks; explicitly says "Do NOT write agent files yourself"
- **Fixed:** Output format changed from `**Model:** tier (model-id) — brief reason` to `**Reason:** one sentence`
- **Fixed:** Permission template heading updated from "CodeWriter pattern" to "session-local-implementer pattern"
- **Preserved:** Deny-by-default principle, all three permission templates, Common Mistakes section, HeadWrench: The Only Executor section

## Final Agent Roster in Routing Table

| Agent | Type | When to use |
|-------|------|-------------|
| @ContextScout | read-only | Pre-planning situational awareness |
| @ContextInsurgent | read-only + deep | Deep multi-file exploration, sequential reasoning |
| @DeepResearcher | research | Web search, documentation lookup |
| @session-local-implementer | implementation | File edits, code changes (per-session) |
| HeadWrench directly | infrastructure | git, build/test, session management |

## Commit
c6e3afc
