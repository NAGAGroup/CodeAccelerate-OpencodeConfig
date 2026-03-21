# CodeAccelerate-OpencodeConfig

A pre-built AI agent configuration for [OpenCode](https://opencode.ai/) that gives you a structured, multi-agent development workflow — planning, debugging, research, and code editing — ready to use in any project. Ships as three profiles for different model providers: Anthropic (paid API), GitHub Copilot, and OpenCode Zen free-tier.

## What is this?

OpenCode is an AI coding assistant that runs in your terminal. This repository is a drop-in configuration for it: a set of agents, prompts, and tool integrations that work together as a coordinated system rather than a single general-purpose assistant.

Once set up, you interact with a primary agent called HeadWrench. It understands your intent — planning a feature, debugging a problem, exploring an idea — and routes work to the right specialized agent automatically. Sessions are persistent, and the system remembers past decisions across conversations so you're not repeating context.

## Quick Start

Install OCX:

```sh
curl -fsSL https://ocx.kdco.dev/install.sh | sh
ocx init --global
ocx registry add https://ocx-registry.nagagroup.workers.dev --name naga-group --global
```

Pick a profile and install it:

```sh
ocx profile add naga --global --source naga-group/ocx-default         # Anthropic (paid API)
ocx profile add naga-copilot --global --source naga-group/ocx-copilot # GitHub Copilot
ocx profile add naga-free --global --source naga-group/ocx-free       # OpenCode Zen free-tier
```

Then launch with your chosen profile:

```sh
ocx oc -p naga
# or: ocx oc -p naga-copilot
# or: ocx oc -p naga-free
```

## Features

**Planning modes.** There are three ways to start a planning session. Generic planning walks you through scoping a feature, refactor, or migration with guided questions before producing a structured execution plan. Debug planning takes a bug report and works through a hypothesis-driven investigation to produce a diagnosis and fix plan. Collaborative planning is for open-ended exploration — you describe an idea, the system asks questions, and together you shape it into something actionable.

**Activate a plan.** Once a plan exists, you can resume it in a later session and execute it step by step. The system tracks where you are and picks up where you left off.

**Agent delegation.** You don't need to think about which agent to use. HeadWrench, the primary orchestrator, reads what you're asking and dispatches work to the right specialist — whether that's deep codebase research, a targeted code edit, or external documentation lookup.

**Cross-session memory.** The system maintains a memory layer across sessions. Decisions, findings, and context from past conversations are available in future ones, so you're not re-explaining your codebase every time.

**Configuration.** Models, MCP servers, and agent behavior are all controlled through the installed profile's `opencode.jsonc`. The default model assignments reflect the chosen profile's provider — swap them out for whatever models you use. You can also enable or disable the Exa web-search integration and adjust per-agent settings without touching any prompts.

## Documentation

- [Getting Started](docs/getting-started.md) — Installation, prerequisites, and first-time setup
- [Planning](docs/planning.md) — The three planning modes and how to use them
- [Agents](docs/agents.md) — What each agent does and when it runs
- [Configuration](docs/configuration.md) — Customizing models, MCP servers, and agent behavior
- [Commands](docs/commands.md) — Available commands and how to trigger them

## License

MIT — NAGA Compute Group 2026
