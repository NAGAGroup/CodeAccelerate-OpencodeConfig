# CodeAccelerate-PicoCode

> A multi-agent DAG planning and execution framework for [OpenCode](https://opencode.ai) — tuned to run on a 4-billion parameter model.

**PicoCode turns OpenCode into a structured, autonomous engineering team.** You describe a goal. A planning agent decomposes it into a typed execution DAG — research phases, work phases, verification loops, decision gates. A specialized team of subagents executes it step by step, each with its own tools, permissions, and role. The whole thing runs locally on [gemma3:4b](https://ollama.com/library/gemma3) via Ollama. 4 billion weights. No cloud required.

[![Demo](https://img.shields.io/badge/Watch_Demo-YouTube-red?style=flat-square&logo=youtube)](https://youtube.com/TODO)

---

## Why PicoCode?

Most AI coding setups give you a single agent that tries to do everything. PicoCode gives you a crew:

- **headwrench** — the orchestrator. Follows the DAG, delegates to specialists, never touches code itself.
- **context-scout / context-insurgent** — survey and deeply analyze your codebase before any work begins.
- **junior-dev / documentation-expert** — implement code and docs changes, file edits only, no shell access.
- **tailwrench** — verification, triage, shell commands, git. The only agent that runs commands.
- **external-scout / deep-researcher** — web and docs research when external knowledge is needed.

Plans are compiled into executable DAGs with typed phases (`work`, `web-search`, `deep-project-search-and-analysis`, `project-setup`, `agentic-decision-gate`, etc.), automatic retry loops, triage on failure, and optional commit checkpoints. The planner and the executor are separate sessions — planning produces a plan, execution activates it.

**The remarkable part:** all of this runs on `gemma3:4b` — a model with 4 billion parameters that fits on a consumer GPU or Apple Silicon. Frontier providers (Anthropic, OpenAI, GitHub Copilot) are also supported for those who want maximum capability.

---

## Prerequisites

- [OpenCode](https://opencode.ai) — `npm install -g opencode-ai`
- [OCX](https://ocx.sh) — `npm install -g ocx` (OpenCode extension manager)
- [grepai](https://yoanbernabeu.github.io/grepai/installation/) — semantic codebase search (MCP server used by all agents)
- [Ollama](https://ollama.com) — required for grepai embeddings and the local profile
- [Docker](https://docker.com) — required for Qdrant (session memory) and SearXNG (web search)
- Node.js 18+ and `npx`
- Python with `uvx` (for the Qdrant MCP server)

---

## Setup

### 1. Start background services

```bash
# Session memory (Qdrant)
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant

# Web search (SearXNG)
docker run -d --name searxng -p 8080:8080 searxng/searxng

# Local models (Ollama) — pull the model used by the local profile
ollama pull gemma3:4b
```

### 2. Install PicoCode via OCX

```bash
# Initialize OCX global config
npx ocx init --global

# Add the NagaGroup registry
npx ocx registry add https://ocx-registry.nagagroup.workers.dev --name naga-group --global

# Install your chosen profile (see Profiles section below)
npx ocx profile add naga-ollama --global --source naga-group/ocx-ollama

# Install the planning plugin
npx ocx add --global naga-group/ocx-planning-plugin
```

### 3. Verify grepai is installed

PicoCode manages grepai automatically — no manual init or watch commands needed. Just confirm the binary is available:

```bash
grepai version
```

When you start a planning or execution session, PicoCode will:
1. Initialize the grepai index for the current project if it doesn't exist yet (`grepai init -p ollama --yes`)
2. Start the background file watcher (`grepai watch --background`)

The first session on a new project will take slightly longer while the index builds.

---

## Profiles

Choose the profile that matches your setup. Install one (or more) using the `npx ocx profile add` command from step 2.

| Profile | Source | Headwrench | Subagents |
|---|---|---|---|
| `naga-ollama` | `naga-group/ocx-ollama` | `gemma3:4b` (local) | `gemma3:4b` (local) |
| `naga` | `naga-group/ocx-default` | Claude Sonnet | Claude Haiku |
| `naga-haiku` | `naga-group/ocx-haiku` | Claude Haiku | Claude Haiku |
| `naga-copilot` | `naga-group/ocx-copilot` | GitHub Copilot | GitHub Copilot |
| `naga-haiku-copilot` | `naga-group/ocx-haiku-copilot` | Claude Haiku | GitHub Copilot |
| `naga-free` | `naga-group/ocx-free` | Free tier | Free tier |

The `naga-ollama` profile is the flagship — fully local, fully private, no API keys needed.

For the ollama profile, set the port via environment variable before launching OpenCode:

```bash
export OPENCODE_OLLAMA_PORT=11434   # default Ollama port
opencode --profile naga-ollama
```

---

## Usage

### Planning a task

Start a planning session from any OpenCode conversation:

```
/plan-session <describe what you want to build or fix>
```

The planning DAG will guide headwrench through:
1. Orienting to your codebase (context-scout)
2. Web/docs research for any external dependencies
3. Designing the execution plan (work items, decision gates, pre-work research)
4. Compiling the plan into an executable DAG

When planning completes, you'll be shown the plan diagram and given an activation command.

### Executing a plan

```
/activate-plan <plan-name>
```

Execution runs through the compiled DAG automatically — each phase dispatches the appropriate subagent, verification loops retry on failure, and triage identifies root causes before fix attempts.

### grepai

grepai is managed automatically — no manual setup needed per project. PicoCode initializes the index and starts the background watcher when you start a session. You do not need to run `grepai init` or `grepai watch` yourself.

---

## Known Issues

### grepai index pollution

grepai tracks file changes incrementally. Over time this accumulates stale entries that can pollute search results. If subagents start returning irrelevant or outdated codebase findings, reset the index:

```bash
cd your-project
rm -rf .grepai/
```

Then start a new planning or execution session — PicoCode will rebuild the index automatically.

A longer-term fix (per-session index isolation) is being investigated.

---

## Demo

Watch a full E2E planning and execution run on a real project:

👉 **[YouTube Demo](https://youtube.com/TODO)**

The demo shows the `naga-ollama` profile running on gemma3:4b — planning, execution, verification, and triage all running locally.

---

## Part of CodeAccelerate

PicoCode is part of the [CodeAccelerate](https://github.com/nagagroup) collection — a set of tools, libraries, and configurations published by NagaGroup.
