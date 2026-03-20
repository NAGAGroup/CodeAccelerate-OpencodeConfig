# Session: config-improvements-v1

## Goal
Implement research-backed improvements to the opencode config system across 7 feature areas: session plan schema, context management, planning modes, skills + specialist crew design, slash command checkpoint primitives, and protocol gap fixes.

## Done Criteria
All updated config files are consistent with design-doc recommendations and ready to use immediately:
- Session plan schema includes plan.json, extended spec.json, ## Context Files + ## Success Criteria in subtask template
- All context files have YAML staleness metadata frontmatter; context-management.md documents 60% compaction trigger + position-aware placement
- Planning modes produce differentiated artifacts; 3-pass synthesis and pre-execution validation documented in plan protocols
- Both SKILL.md files restructured for progressive disclosure (TL;DR + full content) with version field; specialist crew guidance + model tier suggestions added
- /save, /restore, /resume, /status slash commands exist in ~/.config/opencode/commands/
- checkpoint.md and subagent files address timeout/threshold gaps; context-audit.md command created

## Subtasks

| # | Status | Description |
|---|--------|-------------|
| 01 | pending | Session plan schema — update session-plan-schema.md + plan-end.md for plan.json, extended spec.json, ## Context Files + ## Success Criteria in subtask template |
| 02 | pending | Context management — update context-management.md + headwrench.md for staleness model, 60% compaction trigger, position-aware placement; add YAML frontmatter to all context files |
| 03 | pending | Planning modes — update plan-generic.md + plan-shared.md for differentiated mode artifacts, 3-pass synthesis, pre-execution validation |
| 04 | pending | Skills + specialist crew — restructure agent-writer/SKILL.md + agent-delegation-expert/SKILL.md for progressive disclosure, version field, model tier suggestions, global specialist templates |
| 05 | pending | Slash commands — create /save /restore /resume /status in ~/.config/opencode/commands/; update headwrench.md with slash command handling |
| 06 | pending | Protocol gaps — update checkpoint.md + 3 subagent files for timeouts/thresholds; create context-audit.md command |

## Gates

After subtask 03 — user reviews core schema + context + planning mode changes before continuing to skills/commands/gaps.

## Current Focus
Subtask 01: Session plan schema

## Scope
- `~/.config/opencode/protocols/` — session-plan-schema.md, plan-end.md, plan-generic.md, plan-shared.md, checkpoint.md
- `~/.config/opencode/skills/` — agent-writer/SKILL.md, agent-delegation-expert/SKILL.md
- `~/.config/opencode/commands/` — save.md, restore.md, resume.md, status.md, context-audit.md (new)
- `~/.config/opencode/context/` — all context files (staleness metadata)
- `.opencode/context/` — all context files (staleness metadata)
- `~/.config/opencode/agents/headwrench.md` — context loading + slash command handling updates
- `~/.config/opencode/agents/subagents/` — context-scout.md, context-insurgent.md, deep-researcher.md

## Patterns & Constraints
- **Do not change the core orchestration model**: HW → plan → delegation pattern stays
- **Model tier = suggestion only**: HW recommends model class in agent files via PLACEHOLDER_MODEL_ID; user fills in actual IDs
- **Additive changes**: All edits refine and add to existing protocols — do not remove working patterns
- **Git**: WIP commit after each subtask
- **Circuit breaker**: 3 consecutive failures
- **Checkpoint**: Pre-approved (no override)
