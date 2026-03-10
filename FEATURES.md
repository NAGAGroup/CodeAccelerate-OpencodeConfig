# OpenCode Configuration — Feature Set

This document is the authoritative feature inventory for the current HeadWrench-based OpenCode config. It documents all agents, commands, protocols, skills, plugins, and MCPs available in this system. Use this file as the single source of truth for what components are included; other documentation links here for complete details.

---

## Architecture Overview

The OpenCode configuration follows a layered, plan-driven architecture:

- **Plan-as-product**: The system is fundamentally simple; all complexity lives in each session plan, which defines the work, the phases, and the gates
- **Everything is markdown**: Agents, protocols, commands, and session plans are plain text files, version-controllable and human-readable
- **HeadWrench orchestrates**: The primary orchestrator reads plans, delegates to specialized subagents, and ensures checkpoint discipline
- **Skills encode rules**: Complex heuristics (e.g., agent routing) are packaged as skills that HeadWrench loads on demand
- **DCP manages context**: Dynamic Context Pruning automatically compresses conversations to prevent context overflow

---

## Component Inventory

| Component | Count | Location |
|-----------|-------|----------|
| Agents | 8 | `opencode/agents/` and special models |
| Commands | 9 | HeadWrench CLI |
| Protocols | 3 | `opencode/protocols/` |
| Skills | 1 | `opencode/skills/` |
| Plugins | 2 | `@tarquinen/opencode-dcp@beta`, `session-context` |
| MCPs | 3 | MCP registry (context7, sequential-thinking, exa) |

---

## Agents

| Agent | Role | Model | Notes |
|-------|------|-------|-------|
| `headwrench` | Primary orchestrator and coordinator (default agent) | `github-copilot/claude-sonnet-4.6` | Reads plans, delegates, enforces checkpoints |
| `subagents/context-scout` | Pre-planning situational awareness (read-only) | `github-copilot/claude-haiku-4.5` | Analyzes codebase before planning begins |
| `subagents/deep-researcher` | Web and documentation research | `github-copilot/claude-haiku-4.5` | Fetches external knowledge, code examples |
| `subagents/gates-expert` | Recommends stop gates for session plans | `github-copilot/claude-sonnet-4.6` | Helps identify critical decision points |
| `subagents/subagent-builder` | Generates custom ephemeral agent definitions | `github-copilot/claude-sonnet-4.6` | Creates one-off agent specs for special tasks |
| `subagents/code-writer` | Fast implementation agent for well-specified code tasks | `opencode/gpt-5.3-codex` | Executes coding work; requires clear specs |
| `subagents/doc-writer` | Documentation, comments, and README updates | `github-copilot/claude-haiku-4.5` | Writes and refines documentation |
| `subagents/architect` | Deep reasoning for complex architecture and subtle bugs (optional, double-gated) | `opencode/claude-opus-4-6` | Reserved for architecturally critical decisions |

**Special Models:**
- `compaction` (context compression): `github-copilot/claude-haiku-4.5`
- `small_model` (cheap internal operations): `opencode/gpt-5.1-codex-mini`

---

## Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Run the full planning workflow: Q&A, session creation, subtask breakdown, delegation assignment |
| `/continue` | Resume the current session; execute the next pending subtask |
| `/amend` | Apply a quick in-session fix without starting a new session |
| `/inbox` | Review accumulated project-level observations in `.opencode/inbox/` |
| `/context-add` | Add a file to `.opencode/context/` persistent context |
| `/context-list` | List files currently in `.opencode/context/` |
| `/context-remove` | Remove a file from `.opencode/context/` |
| `/activate-session` | Activate an existing session plan from `.opencode/sessions/` |
| `/deactivate-session` | Deactivate the currently active session plan |

---

## Protocols

| Protocol | Purpose | Location |
|----------|---------|----------|
| `checkpoint.md` | Canonical procedure run at the end of every subtask: WIP commit, update index.md, update spec.json, write notes, write inbox entries, gate check, circuit breaker | `opencode/protocols/checkpoint.md` |
| `plan-workflow.md` | The planning workflow triggered by `/plan`: ContextScout → Q&A → draft plan → agent routing → present → finalize | `opencode/protocols/plan-workflow.md` |
| `session-plan-schema.md` | Machine-readable spec for session directory structure: index.md, spec.json, subtask-NN files, notes/ subdirectory | `opencode/protocols/session-plan-schema.md` |

---

## Skills

| Skill | Purpose | When Loaded | Location |
|-------|---------|-------------|----------|
| `agent-delegation-expert` | Assigns the right agent and model tier to each subtask during planning. Provides routing rules and model tier guidance (fast/standard/deep). | During `/plan` Phase 5 | `opencode/skills/agent-delegation-expert/SKILL.md` |

---

## Plugins

| Plugin | Purpose |
|--------|---------|
| `@tarquinen/opencode-dcp@beta` | Dynamic Context Pruning. Automatically compresses conversations to prevent context overflow. Configured via `opencode/dcp.jsonc`. |
| `session-context` | Provides `activate_session` and `deactivate_session` tools. Injects active session plan spec into the system prompt so HeadWrench stays oriented across context compactions. |

---

## MCPs (Model Context Protocol)

| MCP | Status | Purpose |
|-----|--------|---------|
| `context7` | enabled | Fetches up-to-date library documentation and code examples |
| `sequential-thinking` | enabled | Structured multi-step reasoning for complex decisions |
| `exa` | disabled (requires `EXA_API_KEY`) | Web search, deep research, company/people lookup |

---

## Maintenance Guidelines

This document should be updated whenever the OpenCode configuration changes:

- **Add/remove agents**: Update the Agents table and the summary inventory
- **Add/remove commands**: Update the Commands table
- **Add/remove protocols, skills, plugins, or MCPs**: Update the respective tables in this document
- **After updates**: Cross-reference and verify consistency with:
  - `README.md` (overall project description)
  - `docs/CONCEPTS.md` (conceptual explanations)
  - `docs/USAGE.md` (usage examples)
  - `opencode.json` (configuration file)

**Note:** Configuration file options (opencode.json, dcp.jsonc) are publicly documented elsewhere and are not project-specific; they are not detailed in this inventory.
