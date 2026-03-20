# user-docs

**Goal:** Produce fully written, committed user-facing documentation for this codebase — a root-level README and a docs/ folder — targeting developers who already use OpenCode, starting from scratch.

**Open Questions:**
- What features, flows, and concepts in this codebase need to be documented?
- What should the docs/ folder layout, page list, and README outline look like?
- What should the root-level README contain?
- What should each docs/ page contain?
- Are the written docs complete, accurate, and ready to commit?

**Findings:**

## What this project is

CodeAccelerate-OpencodeConfig is a configuration framework for [OpenCode](https://opencode.ai/). Users clone it and symlink/copy the `opencode/` directory to `~/.config/opencode` to get a pre-built AI agent setup for any development project.

## Setup (confirmed correct)

1. Clone `https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig`
2. Copy or symlink `opencode/` → `~/.config/opencode`
3. Set `ANTHROPIC_API_KEY` (required) and `EXA_API_KEY` (required if Exa MCP is enabled)

> Note: `scripts/` directory is stale — do not reference in docs.

## Prerequisites
- Node.js (for MCP servers via npx)
- git
- `ANTHROPIC_API_KEY` (required)
- `EXA_API_KEY` (required if Exa MCP enabled)

## User-facing features

| # | Feature | What the user does |
|---|---|---|
| 1 | **Setup** | Clone repo, symlink/copy `opencode/` to `~/.config/opencode` |
| 2 | **Generic planning** | Trigger a planning session for features, refactors, or migrations |
| 3 | **Debug planning** | Trigger a bug investigation workflow |
| 4 | **Collaborative planning** | Explore open-ended ideas interactively |
| 5 | **Activate a plan** | Resume a saved plan and execute it |
| 6 | **Agent delegation** | Tasks routed automatically to specialized agents |
| 7 | **Cross-session memory** | System remembers past decisions across sessions |
| 8 | **Configuration** | Customize agents, models, MCP servers via `opencode.json` |

## README status: approved

Key decisions:
- Audience: developers already using OpenCode — no hand-holding, no prerequisites section
- Default models are maintainer's personal choices — users swap in their own providers
- No mention of API key requirements (provider-agnostic)

## Doc structure (agreed)

### `docs/` layout
```
docs/
├── getting-started.md   — Installation, prerequisites, first-time setup
├── planning.md          — The three planning modes (generic, debug, collaborative)
├── agents.md            — What each agent does and when it's used
├── configuration.md     — opencode.json: models, MCP servers, enable/disable agents
└── commands.md          — Available commands and how to trigger them
```

### README outline
```
# CodeAccelerate-OpencodeConfig

Short description (1–2 sentences)

## What is this?
## Quick Start
## Features
## Documentation (links to docs/)
## License
```

## Agents
- **HeadWrench** — primary orchestrator (sonnet)
- **@ContextScout** — quick codebase exploration (haiku)
- **@ContextInsurgent** — deep multi-file reasoning (sonnet)
- **@DeepResearcher** — web/docs research (haiku)
- **@JuniorDev** — scoped code edits (haiku)
- **@QuickDoc** — single-file doc writing (haiku)
