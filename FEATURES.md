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
| Agents | 4 | `opencode/agents/` and special models |
| Commands | 12 | HeadWrench CLI |
| Protocols | 10 | `opencode/protocols/` |
| Skills | 2 | `opencode/skills/` |
| Plugins | 2 | `@tarquinen/opencode-dcp@3.0.0`, `session-context` |
| MCPs | 3 | MCP registry (context7, sequential-thinking, exa) |

---

## Agents

| Agent | Role | Model | Notes |
|-------|------|-------|-------|
| `headwrench` | Primary orchestrator and coordinator (default agent) | `github-copilot/claude-sonnet-4.6` | Reads plans, delegates, enforces checkpoints |
| `subagents/context-scout` | Pre-planning situational awareness (read-only) | `github-copilot/claude-haiku-4.5` | Analyzes codebase before planning begins |
| `subagents/context-insurgent` | Deep multi-file codebase exploration with sequential thinking | `github-copilot/claude-sonnet-4.6` | Used for complex investigation requiring multi-step reasoning |
| `subagents/deep-researcher` | Web and documentation research | `github-copilot/claude-haiku-4.5` | Fetches external knowledge, code examples |

**Special Models:**
- `compaction` (context compression): `github-copilot/claude-sonnet-4.6`
- `small_model` (cheap internal operations): `opencode/gpt-5.1-codex-mini`

---

## Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Run the full planning workflow: Q&A, session creation, subtask breakdown, delegation assignment |
| `/plan-deep-research` | Research-first planning — orient, dispatch @DeepResearcher, review findings, decide to build or close |
| `/continue` | Resume the current session; execute the next pending subtask |
| `/amend` | Apply a quick in-session fix without starting a new session |
| `/context-add` | Add a file to `.opencode/context/` persistent context |
| `/context-audit` | Audits permanent context files for staleness; runs `/context-audit` command |
| `/context-list` | List files currently in `.opencode/context/` |
| `/context-remove` | Remove a file from `.opencode/context/` |
| `/quick-plan` | Lightweight planning for small tasks; runs `/quick-plan` command |
| `/activate-session` | Activate an existing session plan from `.opencode/sessions/` |
| `/deactivate-session` | Deactivate the currently active session plan |
| `/session-status` | Displays current session state and subtask progress; runs `/session-status` command |

---

## Protocols

| Protocol | Purpose | Location |
|----------|---------|----------|
| `checkpoint.md` | Canonical procedure run at the end of every subtask: WIP commit, update index.md, update spec.json, write notes, write inbox entries, gate check, circuit breaker | `opencode/protocols/checkpoint.md` |
| `context-management.md` | Rules and procedures for managing persistent context files in `.opencode/context/` | `opencode/protocols/context-management.md` |
| `plan-init.md` | Entry point for the planning workflow: initial setup and context gathering | `opencode/protocols/plan-init.md` |
| `plan-shared.md` | Shared planning procedures and utilities referenced by other plan protocols | `opencode/protocols/plan-shared.md` |
| `plan-generic.md` | Standard planning workflow for general-purpose sessions | `opencode/protocols/plan-generic.md` |
| `plan-collaborative.md` | Planning workflow variant for collaborative multi-agent sessions | `opencode/protocols/plan-collaborative.md` |
| `plan-debug.md` | Planning workflow variant for debugging and investigation sessions | `opencode/protocols/plan-debug.md` |
| `plan-deep-research.md` | Research-first planning: dispatch DeepResearcher, gate on findings, transition to /plan or close | `opencode/protocols/plan-deep-research.md` |
| `plan-end.md` | End-of-session procedures: wrap-up, finalization, and handoff | `opencode/protocols/plan-end.md` |
| `session-plan-schema.md` | Machine-readable spec for session directory structure: index.md, spec.json, subtask-NN files, notes/ subdirectory | `opencode/protocols/session-plan-schema.md` |

---

## Skills

| Skill | Purpose | When Loaded | Location |
|-------|---------|-------------|----------|
| `agent-delegation-expert` | Assigns the right agent and model tier to each subtask during planning. Provides routing rules and model tier guidance (fast/standard/deep). | During `/plan` Phase 5 | `opencode/skills/agent-delegation-expert/SKILL.md` |
| `agent-writer` | Teaches HeadWrench to create session-local agent files during plan finalization | During `/plan` when a subtask needs a custom agent | `opencode/skills/agent-writer/SKILL.md` |

---

## Plugins

| Plugin | Purpose |
|--------|---------|
| `@tarquinen/opencode-dcp@3.0.0` | Dynamic Context Pruning. Automatically compresses conversations to prevent context overflow. Configured via `opencode/dcp.jsonc`. |
| `session-context` | Provides `activate_session` and `deactivate_session` tools. Injects active session plan spec into the system prompt so HeadWrench stays oriented across context compactions. |

---

## MCPs (Model Context Protocol)

| MCP | Status | Purpose |
|-----|--------|---------|
| `context7` | enabled | Fetches up-to-date library documentation and code examples |
| `sequential-thinking` | enabled | Structured multi-step reasoning for complex decisions |
| `exa` | enabled (requires `EXA_API_KEY` env var) | Web search, deep research, company/people lookup |

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
