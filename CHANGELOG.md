# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [2.0.0] - 2026-03-20

### Added
- DAG-driven planning system with three session types: `plan-generic`, `plan-debug`, and `plan-collaborative`, enforced via a `planning-enforcement.ts` plugin
- User-facing documentation: new `docs/` directory with `agents.md`, `commands.md`, `configuration.md`, `getting-started.md`, and `planning.md`; README.md rewritten
- Session-overview node in all three planning session types
- DAG-aware compression protection in DCP prompt overrides
- `activate-plan` slash command for starting execution sessions

### Changed
- All agent files rewritten with persona, communication style, and anti-patterns sections using agent-directive language throughout
- All command, skill, and protocol files rewritten in agent-directive language; `$ARGUMENTS` contextualised in mid-sentence references in all command files
- Agent roster reorganised: agents moved from `opencode/agents/subagents/` to `opencode/agents/`; `context-scout`, `deep-researcher`, `junior-dev`, and `quick-doc` agents added or rewritten
- `delegation` skill replaces the former `agent-delegation-expert` and `agent-writer` skills
- DCP configuration and prompt overrides updated; planning DAG paths now resolve against `~/.config/opencode/` for global installation compatibility

### Removed
- `scripts/` directory (stale install scripts)
- Monolithic protocol files: `checkpoint.md`, `context-management.md`, `plan-*.md` protocol suite, `session-plan-schema.md`
- Legacy slash commands: `activate-session`, `amend`, `context-add`, `context-list`, `context-remove`, `continue`, `deactivate-session`, `plan-deep-research`, `plan.md`, `quick-plan`, `session-status`, `roadmap-add`
- `AUDIT.md`, `FEATURES.md`, `ROADMAP.md`, `docs/CONCEPTS.md`, `docs/DOCUMENTATION_MAINTENANCE.md`, `docs/USAGE.md`
- `session-context.ts` and `mermaid-tool.ts` plugins
- All `.opencode/context/` context items
- All `.opencode/archive/sessions/` and `.opencode/sessions/` artifacts

### Fixed
- Planning DAG prompt paths now resolve correctly against `~/.config/opencode/` for global installation compatibility
- Collaborative session role boundary enforcement

## [1.0.1] - 2026-03-15

### Fixed
- `plan-generic` and `plan-debug` commands now pass `$ARGUMENTS` correctly to planning enforcement

## [1.0.0] - 2026-03-15

### Added
- Initial structured planning system with `plan-generic` and `plan-debug` session types
- `planning-enforcement.ts` plugin for DAG state management
- `context-insurgent` agent for deep multi-file codebase reasoning
- `headwrench.md` orchestrator agent definition
- Session plan schema and protocol files

### Changed
- Agent files migrated from flat directory to `opencode/agents/subagents/`
- DCP prompt overrides updated for planning-aware compression behaviour

### Fixed
- DAG node advancement correctly blocked until user approval at gate nodes

### Removed
- Legacy session-context plugin replaced by planning enforcement

## [0.1.0] - 2026-03-10

### Added
- Initial repository structure with `opencode/` config directory
- DCP prompt overrides: `system.md`, `compress.md`, `turn-nudge.md`, `context-limit-nudge.md`, `iteration-nudge.md`
- Base agent files: initial context-scout and context-insurgent definitions
- `session-context.ts` plugin for session state tracking

### Changed
- Default DCP compression prompt replaced with project-specific guidance

### Fixed
- DCP override paths correctly resolved on Linux and macOS
