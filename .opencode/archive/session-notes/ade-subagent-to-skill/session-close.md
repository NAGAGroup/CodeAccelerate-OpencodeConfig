# Session Close: ade-subagent-to-skill

**Date:** 2026-03-10
**Status:** Complete

## What Was Done

Converted `agent-delegation-expert` from a specialized subagent into a native opencode skill.
HeadWrench now loads the skill during Phase 5 of `/plan` and applies delegation rules directly,
rather than dispatching a subagent and waiting for recommendations.

## Changes Made

| File | Change |
|------|--------|
| `opencode/skills/agent-delegation-expert/SKILL.md` | **New** — skill with routing rules, model tiers, decision table, SubagentBuilder briefing guidance |
| `opencode/agents/subagents/agent-delegation-expert.md` | **Deleted** |
| `opencode/opencode.json` | Removed `subagents/agent-delegation-expert` model entry (`opencode/gemini-3-flash`) |
| `opencode/agents/headwrench.md` | Updated `/plan` workflow summary and Delegation Rules section to reference skill load instead of subagent dispatch |
| `opencode/protocols/plan-workflow.md` | Phase 5 rewritten as skill invocation; invariants updated; agent roles table updated |
| `opencode/commands/plan.md` | Phase 5 rewritten; Phase 6 "recommendations" → "assignments"; Phase 7 updated |

## Key Decisions

- **Skill path:** `opencode/skills/agent-delegation-expert/SKILL.md` — lives in the deliverable config directory (installs to `~/.config/opencode/skills/` for users)
- **Behavioral change:** HW applies rules itself rather than waiting for subagent output — simpler, fewer round-trips
- **SubagentBuilder pattern preserved:** When custom agents are needed, HW briefs SubagentBuilder with purpose/behavior/constraints — never writes the spec itself
- **Invariant preserved:** Agent/model assignments go in subtask-NN `## Delegation` sections only, never in spec.json

## Commits

- `wip: subtask-01 — create agent-delegation-expert skill file`
- `fix: remove agent-delegation-expert subagent, add skill, update all references`
- `feat: complete session — ade-subagent-to-skill` *(final)*
