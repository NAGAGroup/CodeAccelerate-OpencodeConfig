<!-- Context: project-intelligence/technical | Priority: high | Version: 1.1 | Updated: 2026-03-03 -->

# Technical Domain

> Technical foundation of CodeAccelerate-OpencodeConfig — a personal OpenCode global config layer built on top of OpenAgentsControl.

## Quick Reference

- **Purpose**: Understand how this config repo works and what it provides
- **Upstream**: Based on [OpenAgentsControl (OAC)](https://github.com/darrenhinde/OpenAgentsControl) — defer to that repo for agent/workflow behavior docs
- **Update When**: New plugins, model changes, new overrides added to global config

## Primary Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Language | TypeScript | Bun runtime |
| Base | OpenAgentsControl (OAC) | Upstream — not maintained by this repo |
| Plugins | opencode-mem, @tarquinen/opencode-dcp | Memory + dynamic context pruning |
| MCPs | context7 (enabled), exa (disabled by default) | context7 via npx, exa via remote |

## Architecture Pattern

```
Type: Plugin-based multi-agent coordination (via OpenCode)
Base: OpenAgentsControl — provides all agents, workflows, context system
This repo: Global config layer — personal overrides on top of OAC base
```

### Two-Layer Config Model

```
~/.config/opencode/          ← symlinked to opencode/ in this repo
  opencode.json              ← model assignments, plugins, MCPs, default agent
  dcp.jsonc                  ← DCP (dynamic context pruning) config
  opencode-mem.jsonc          ← memory plugin config
  plugins/mermaid.ts         ← custom mermaid plugin
  lib/utils.ts               ← shared plugin utilities

.opencode/                   ← per-project install (NOT this repo)
  context/                   ← project-specific context (local-first)
  agent/                     ← project-specific agent overrides
```

**Key rule**: Local `.opencode/` always wins over global. Project patterns go in per-project installs. This repo provides only global defaults and personal overrides.

## Agent Configuration

| Agent | Model | Role |
|-------|-------|------|
| OpenCoder (default) | claude-sonnet-4.6 | Primary orchestrator |
| CoderAgent | claude-sonnet-4.6 | Code implementation |
| OpenAgent | claude-sonnet-4.6 | General purpose |
| BuildAgent, CodeReviewer, ContextOrganizer, ContextScout, DocWriter, ExternalScout, OpenDevopsSpecialist, OpenFrontendSpecialist, TaskManager, TestEngineer | claude-haiku-4.5 | Lightweight subagents |
| small_model | gpt-5-mini | Quick utility tasks |

## Project Structure

```
CodeAccelerate-OpencodeConfig/
├── opencode/                # Global config (symlinked to ~/.config/opencode/)
│   ├── opencode.json        # Main config: models, plugins, MCPs, default agent
│   ├── dcp.jsonc            # DCP plugin config
│   ├── opencode-mem.jsonc   # Memory plugin config
│   ├── plugins/mermaid.ts   # Custom mermaid diagram plugin
│   └── lib/utils.ts         # Plugin utilities
├── .opencode/               # Local config for THIS repo (context, skills, commands)
│   ├── context/             # Project intelligence context files
│   ├── command/             # Custom slash commands
│   └── skills/              # Reusable agent skills
└── docs/                    # Documentation (⚠️ currently stale — see living-notes.md)
```

## Development Environment

```
Usage: Open opencode CLI and use it — no install/build/test scripts needed
Agents should NEVER run install, build, or test commands for this project
OpenCode handles all runtime concerns automatically
```

## Key Technical Decisions

See `decisions-log.md` for full history.

| Decision | Rationale |
|----------|-----------|
| OAC as base (not handrolled) | Mature upstream, community-maintained, reduces maintenance burden |
| Global config = overrides only | Per-project installs carry project patterns; global stays minimal |
| Local-first context resolution | Project-specific patterns always win over global defaults |
| autoupdate: false | Explicit control over OAC version upgrades |
| compaction.auto: false | Manual context management preferred |

## Related Files

- `decisions-log.md` - Full decision history
- `living-notes.md` - Current state, active work, known issues
- `navigation.md` - Guide to all context files
