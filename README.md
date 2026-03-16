# OpenCode Configuration

A HeadWrench-based OpenCode config where the plan is the product, not the execution engine.

## What This Is

This is an OpenCode configuration that provides structured, session-based AI-assisted development. The system itself is intentionally simple: `/plan` triggers a Q&A flow, Q&A produces markdown session files, and agents read and follow the markdown. Complexity lives in each session plan—designed for the specific problem and discarded when done. Everything is plain markdown: session plans, protocols, agent definitions. Inspectable and editable mid-session without understanding any plugin API.

## What You Get

- **HeadWrench** — orchestrator that runs planning workflows, delegates to subagents, and checkpoints progress
- **3 subagents** — context-scout, context-insurgent, deep-researcher
- **Session-based workflow** — `/plan` creates a structured plan; `/continue` executes it subtask by subtask
- **2 skills** — agent-delegation-expert, agent-writer
- **DCP plugin** — automatic context compression to prevent overflow
- **3 MCPs** — context7 (library docs), sequential-thinking (structured reasoning), exa (web search, enabled — requires `EXA_API_KEY` env var)

See [FEATURES.md](FEATURES.md) for the complete component inventory.

## Installation

```bash
# Copy the config to your OpenCode directory
cp -r opencode ~/.config/opencode
```

That's it. No build step needed — OpenCode handles dependency installation on first run.

Then start OpenCode in your project:

```bash
opencode
```

HeadWrench is the default agent. You're ready to start a session.

## Quick Start

```
/plan add dark mode to the settings page
```

HeadWrench will:
1. Run ContextScout to understand your codebase
2. Ask you Q&A questions (goal, scope, done criteria, git branch, etc.)
3. Write a session plan with subtasks in `.opencode/sessions/`
4. Wait for you to say "start"

Then:

```
/continue
```

Executes the first subtask. Run again for each subsequent subtask.

## Learn More

- **[docs/CONCEPTS.md](docs/CONCEPTS.md)** — The design philosophy and key concepts: why this config works the way it does, what HeadWrench is, what sessions are, what skills are
- **[docs/USAGE.md](docs/USAGE.md)** — How to use the 12 commands: /plan, /continue, /amend, /inbox, context commands, and session activation — with examples
- **[FEATURES.md](FEATURES.md)** — Complete component inventory: all agents, commands, protocols, skills, plugins, MCPs
