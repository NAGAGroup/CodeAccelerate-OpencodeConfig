> [!NOTE]
> This has been archived, the new project is in https://github.com/NAGAGroup/CodeAccelerate-PicoCode

# CodeAccelerate-OpencodeConfig

A multi-agent development system for [OpenCode](https://opencode.ai/) that plans, debugs, researches, and writes code as a coordinated team — not a single general-purpose assistant.

**v4.0.0 milestone:** The full orchestration stack — multi-agent planning, DAG execution, scouts, deep analysis, clarifying questions, verification gates — has been validated on a local Ollama model running on a single 4090. No API key. No cloud spend. Frontier-model-level coordination from hardware you own.

You talk to one agent, **HeadWrench**. It reads your intent, delegates to the right specialist, and tracks everything across sessions so you never re-explain your codebase. Planning sessions produce structured execution plans. Debug sessions run hypothesis-driven investigations. Research sessions explore documentation and codebases in depth. All of it persists.

Ships as six profiles: Anthropic API (default), Anthropic API with all-haiku models, GitHub Copilot, GitHub Copilot with all-haiku models, OpenCode Zen (free), and local Ollama.

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
ocx profile add naga --global --source naga-group/ocx-default              # Anthropic API (default)
ocx profile add naga-haiku --global --source naga-group/ocx-haiku          # Anthropic API (all-haiku)
ocx profile add naga-copilot --global --source naga-group/ocx-copilot      # GitHub Copilot
ocx profile add naga-copilot-haiku --global --source naga-group/ocx-haiku-copilot  # GitHub Copilot (all-haiku)
ocx profile add naga-free --global --source naga-group/ocx-free            # OpenCode Zen free-tier
ocx profile add naga-ollama --global --source naga-group/ocx-ollama        # Local Ollama (run: ollama cp <model> opencode-model)
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
- **external-scout** — searches external documentation, APIs, and references via web and MCP tools; handles any level of external research from cursory lookups to deep investigative work
- **quick-doc** — generates documentation from code and context

You don't pick agents. HeadWrench does, based on what the current task needs.

## Planning

CodeAccelerate ships with a DAG-driven planning mode:

- **Session** (`/plan-session`) — Scopes a feature, refactor, or migration. The planner scouts your codebase, researches what it needs, asks clarifying questions, then proposes a structured execution plan for your approval. Once approved, the plan is written to disk as a DAG and visualized directly in your terminal.

Planning sessions are DAG-based: each plan is a directed acyclic graph of tasks, questions, and verification gates. The agent authors the DAG using dedicated tools — it never hand-writes JSON. Every mutation is validated and rendered as an ASCII diagram so you can see exactly what's being built.

Once a plan exists, `/activate-plan` picks it up and executes it step by step. Plans persist across sessions — come back later and continue where you left off.

## Running on local models

The Ollama profile is designed to run the full system on local hardware. The v4.0.0 release was validated on a single 4090 using Qwen 2.5 14B as the primary model. Qwen3 14B is the current minimum-supported target — all planning prompts are engineered to this baseline. The entire orchestration stack works: multi-agent delegation, parallel scouting, DAG planning, clarifying questions, and tool-based plan authoring.

The profile automatically sets `think: false` for all model requests, which prevents Qwen3's ~60% tool-execution failure rate in thinking mode. Non-thinking-capable models silently ignore this setting.

To use the Ollama profile:

```sh
# Copy your chosen model to the opencode-model alias
ollama cp qwen3:14b opencode-model

# Install the profile
ocx profile add naga-ollama --global --source naga-group/ocx-ollama

# Launch
ocx oc -p naga-ollama
```

See the [Ollama model recommendations](docs/reports/ollama-model-recommendations.md) for a ranked list of tested models and tier guidance.

## Configuration

Models, MCP servers, and agent behavior are controlled through the profile's `opencode.jsonc`. The defaults reflect each profile's provider. You can swap models, enable or disable the Exa web-search integration, and adjust per-agent settings without touching any prompts.

## Git Setup

If you use OpenCode across multiple projects, add the following to each project's `.gitignore` to keep planning artifacts out of version control:

```gitignore
# Ignore OpenCode session plans and DAG state
.opencode/**

# Keep project-specific OpenCode config (if you have one)
!.opencode/opencode.jsonc
!.opencode/opencode.json
```

Planning session files, DAG state, and agent logs are stored under `.opencode/` and are ephemeral — they don't belong in git history.

## Documentation

- [Getting Started](docs/getting-started.md) — Installation, prerequisites, first-time setup
- [Planning](docs/planning.md) — Planning modes and how to use them
- [Agents](docs/agents.md) — What each agent does and when it runs
- [Configuration](docs/configuration.md) — Models, MCP servers, agent behavior
- [Commands](docs/commands.md) — Available commands

## License

MIT — NAGA Compute Group 2026
