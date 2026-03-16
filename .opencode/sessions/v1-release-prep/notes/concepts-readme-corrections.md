# Note: CONCEPTS.md and README.md Corrections

**Subtask:** 02 — fix-concepts-and-readme  
**Date:** 2026-03-15

## Changes Applied

### docs/CONCEPTS.md
- Subagents: "7 subagents" → "3 subagents" (removed gates-expert, subagent-builder, code-writer, doc-writer, architect; added context-insurgent with description)
- HeadWrench "does not" section: removed code-writer reference; now delegates implementation to session-local agents created via agent-writer skill
- Skills: "one skill" → "two skills" (added agent-writer with description and on-demand note)
- Commands: "9 slash commands" → "11 slash commands" (added /context-audit, /quick-plan, /session-status)

### README.md
- Subagents: "7 specialized subagents" → "3 subagents — context-scout, context-insurgent, deep-researcher"
- Skills: "1 skill — agent-delegation-expert" → "2 skills — agent-delegation-expert, agent-writer"
- exa MCP: "disabled by default" → "enabled — requires EXA_API_KEY env var"
- Learn More section: "9 commands" → "11 commands" (bonus catch by agent)

## Key Finding
README had an additional stale "9 commands" reference in the Learn More section that wasn't in the subtask spec. The agent correctly identified and fixed it.
