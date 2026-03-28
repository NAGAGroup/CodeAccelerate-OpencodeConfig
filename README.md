# CodeAccelerate-OpencodeConfig

A multi-agent development system for [OpenCode](https://opencode.ai/) that plans, debugs, researches, and writes code as a coordinated team — not a single general-purpose assistant.

You talk to one agent, **HeadWrench**. It reads your intent, delegates to the right specialist, and tracks everything across sessions so you never re-explain your codebase. Planning sessions produce structured execution plans. Debug sessions run hypothesis-driven investigations. Research sessions explore documentation and codebases in depth. All of it persists.

Ships as three profiles: Anthropic (paid API), GitHub Copilot, and OpenCode Zen (free).

## What it looks like


https://github.com/user-attachments/assets/8fd9f4fe-efd7-45e7-b593-3300db004c4d


### Result (Rotated)

<img width="1280" height="720" alt="output" src="https://github.com/user-attachments/assets/48d70f34-73a8-4f71-b3a7-fe3fd3a98c70" />

## Quick Start

Install OCX and add the registry:

```sh
curl -fsSL https://ocx.kdco.dev/install.sh | sh
ocx init --global
ocx registry add https://ocx-registry.nagagroup.workers.dev --name naga-group --global
```

Pick a profile:

```sh
ocx profile add naga --global --source naga-group/ocx-default         # Anthropic (paid API)
ocx profile add naga-copilot --global --source naga-group/ocx-copilot # GitHub Copilot
ocx profile add naga-free --global --source naga-group/ocx-free       # OpenCode Zen free-tier
```

Launch:

```sh
ocx oc -p naga
```

## How it works

HeadWrench is the primary orchestrator. Every message goes through it first. Based on what you're asking, it routes work to specialized agents:

- **context-scout** — reads and maps codebases, gathers structural context before any changes happen
- **context-insurgent** — deep-dives into specific files and logic paths when the scout's overview isn't enough
- **junior-dev** — executes targeted code edits under HeadWrench's direction
- **deep-researcher** — searches external documentation, APIs, and references via web and MCP tools
- **quick-doc** — generates documentation from code and context

You don't pick agents. HeadWrench does, based on what the current task needs.

## Planning modes

| Mode | Trigger | What it does |
|---|---|---|
| **Session** | `/plan-session` | Scopes a feature, refactor, or migration through guided questions → structured execution plan |
| **Debug** | `/plan-debug` | Takes a bug report → hypothesis-driven investigation → diagnosis and fix plan |
| **Collaborative** | `/plan-collaborative` | Open-ended exploration → the system asks questions, you shape an idea into something actionable together |
| **Deep Research** | `/plan-deep-research` | Researches a topic across docs, code, and the web → synthesized findings |
| **Deep Review** | `/plan-deep-review` | Reviews code or architecture in depth → structured critique and recommendations |

Once a plan exists, `/activate-plan` picks it up and executes it step by step. Plans persist across sessions — come back later and continue where you left off.

## Configuration

Models, MCP servers, and agent behavior are controlled through the profile's `opencode.jsonc`. The defaults reflect each profile's provider. You can swap models, enable or disable the Exa web-search integration, and adjust per-agent settings without touching any prompts.

## Documentation

- [Getting Started](docs/getting-started.md) — Installation, prerequisites, first-time setup
- [Planning](docs/planning.md) — Planning modes and how to use them
- [Agents](docs/agents.md) — What each agent does and when it runs
- [Configuration](docs/configuration.md) — Models, MCP servers, agent behavior
- [Commands](docs/commands.md) — Available commands

## License

MIT — NAGA Compute Group 2026
