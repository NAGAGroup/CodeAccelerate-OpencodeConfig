# Agent Architecture Decisions

## Date
2026-03-19 (Subtask 06)

## Summary
Five global subagents defined for the new opencode config. All agents are global (not session-local).
All agent files live at `./opencode/agents/` in the repo.

## Agent Roster

| Agent | Model Tier | steps | Color | Primary Role |
|---|---|---|---|---|
| ContextScout | haiku-like | 12 | #06b6d4 | Quick codebase/context exploration, parallel dispatch |
| ContextInsurgent | sonnet-like | 20 | #f59e0b | Deep codebase reasoning (expensive, NOT parallel) |
| DeepResearcher | haiku-like | 15 | #8b5cf6 | Web/docs research via Exa + Context7 |
| JuniorDev | haiku-like | 10 | #22c55e | Scoped code edits, parallel, NOT for re-use |
| QuickDoc | haiku-like | 8 | #f97316 | Single-file doc writing/editing, parallel, NOT for re-use |

## Delegation Philosophy (LOCKED)
- Always prefer many haiku-like agents in parallel with quick targeted tasks
- ContextInsurgent is the ONLY agent with a more powerful model (reading files is expensive)
- DeepResearcher never needs a powerful model — Exa does the heavy lifting
- JuniorDev + QuickDoc: any task not well-suited for haiku → HW handles directly
- HW is the ONLY agent with shell access (git, build, test)
- Subagents make easy things cheaper + one expensive thing (codebase reasoning) less expensive

## Permission Pattern (LOCKED)
All agents use deny-by-default: `"*": deny` at top of permission block, then explicit allows.
This is research-validated (CrewAI pattern): structural constraints > instruction-based constraints.

## Routing
- ContextScout → pre-planning situational awareness, parallel dispatch OK
- ContextInsurgent → deep multi-file exploration, only one at a time per logical task
- DeepResearcher → research needed during planning (optional, user-gated)
- JuniorDev → parallel code edits across multiple files simultaneously
- QuickDoc → writing single-file documents or targeted edits

## Key Constraints Discovered
- ContextScout: reads codebase files ONLY; does NOT read `.opencode/` (no context dir exists)
- ContextInsurgent: findings returned inline to HW (no note-writing — old workflow removed)
- DeepResearcher: uses `"sequential_thinking*": allow` syntax (underscore, not dash)
- All agents: `mode: subagent` in frontmatter is required for subagent dispatch
