# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-03-15

### Added

- /plan-deep-research command and protocol — dedicated research planning mode using DeepResearcher; gates on findings before transitioning to a build session
- **context-insurgent subagent** — deep multi-file codebase exploration specialist with sequential thinking capability; fills the gap between lightweight context-scout reads and full implementation
- **agent-writer skill** — HeadWrench loads this skill during plan finalization to create session-local agent `.md` files in `.opencode/agents/`, replacing the deleted subagent-builder role
- **/context-audit command** — unified audit workflow: promotes inbox items, reviews session archival candidates, retrofits retrofitable items, and flags stale context files
- **/quick-plan command** — lightweight alignment check and immediate execution for small, well-understood tasks that don't warrant a full session plan
- **/session-status command** — displays current session plan status and subtask progress at a glance without triggering execution
- **Modular planning protocol** — six focused protocol files (plan-init, plan-shared, plan-generic, plan-collaborative, plan-debug, plan-end) replace the previous monolithic plan-workflow.md
- **context-management.md protocol** — formalizes the 5-tier context loading model with staleness detection, supersession chaining, and conflict resolution rules
- **Session archival support** — completed sessions can be moved to `.opencode/archive/sessions/` via the /context-audit workflow

### Changed

- **Agent roster reduced and clarified** — removed gates-expert, subagent-builder, code-writer, doc-writer, and architect; framework now uses headwrench + 3 focused subagents (context-scout, context-insurgent, deep-researcher) plus session-local implementation agents
- **DCP plugin versioned** — `@tarquinen/opencode-dcp` updated from `@beta` to `@3.0.0`
- **exa MCP enabled** — Exa search MCP is now enabled by default; requires `EXA_API_KEY` environment variable
- **FEATURES.md fully rewritten** — all component counts, agent/command/protocol/skill tables corrected to match the actual framework state

### Fixed

- Documentation inaccuracies across FEATURES.md, CONCEPTS.md, README.md, USAGE.md, and ROADMAP.md (wrong agent counts, stale agent names, wrong command counts, wrong MCP status)
- Stale agent references (DocWriter, @CodeWriter) removed from `opencode/protocols/session-plan-schema.md`
- Broken file reference (`opencode/commands/README.md`) removed from `docs/DOCUMENTATION_MAINTENANCE.md`
- ROADMAP.md cleaned up: removed duplicate "In Progress" entry for shipped session-context plugin, removed stale "improved Architect usage" planned item

### Removed

- **gates-expert, subagent-builder, code-writer, doc-writer, architect agents** — all five deleted; their roles are now handled by session-local agents (implementation) and HeadWrench directly (gates, architecture)
- **plan-workflow.md** — monolithic planning protocol replaced by the modular plan-*.md suite

## [0.1.0] - 2026-03-10

### Added

- **HeadWrench orchestrator agent** with complete plan/session/checkpoint workflow for coordinating multi-agent code generation and documentation tasks
- **Seven specialized subagents**: context-scout (research and context gathering), deep-researcher (comprehensive web research), gates-expert (validation and quality gates), subagent-builder (agent creation), code-writer (implementation), doc-writer (documentation), and architect (system design)
- **Nine slash commands** for user interaction: `/plan` (initiate sessions), `/continue` (resume work), `/amend` (modify plans), `/inbox` (manage requests), `/context-add` (add context items), `/context-list` (view context), `/context-remove` (delete context items), `/activate-session` (load session state), and `/deactivate-session` (clear session state)
- **Three canonical protocol documents**: checkpoint (validation and approval workflow), plan-workflow (multi-phase planning process), and session-plan-schema (subtask structure and metadata)
- **Agent delegation as a loadable skill** with comprehensive routing rules that assign agents based on task complexity, type, and skill requirements
- **Session-context plugin** that injects session ID and active session configuration into the system prompt on every turn, enabling persistent session state across multiple interactions
- **3-layer todo stack enforcement** during active sessions: persistent session summary todos (HeadWrench-owned), subtask-specific todos (from subtask files), and 8 fixed checkpoint todos (present during execution)
- **Session bootstrap procedure** that initializes the todo stack and transitions between subtask contexts
- **Dynamic Context Pruning (DCP)** integration via `@tarquinen/opencode-dcp` plugin to optimize token usage in multi-turn sessions
- **Structured session metadata** format using `.opencode/session-ids/<sessionID>/active-session.json` to store and retrieve active session state
- **Mermaid diagram tool** (`render_mermaid`) leveraging the beautiful-mermaid library to render Mermaid diagrams as ASCII unicode art, SVG, or GitHub-compatible markdown fenced blocks

### Changed

- **Session plan schema** updated to reflect the actual subtask file format (`subtask-NN-{name}.md` + `spec.json`) with clear sections for Objective, Delegation, Requirements, and Todolist
- **Plan workflow** enhanced with checkpoint approval step and Phase 9 execution bootstrap to formalize the transition from planning to implementation
- **HeadWrench documentation** revised to include session summary todo ownership and synchronized updates across the 3-layer todo stack
- **Checkpoint documentation** updated with explicit session todo update step during checkpoint validation
- **Agent delegation process** converted from a subagent-based approach to a loadable skill, improving efficiency and simplifying agent routing
- **User documentation** completely rewritten for the current HeadWrench architecture, replacing previous documentation that reflected an earlier system design

### Fixed

- **Session state persistence** now properly maintained across multiple turns through the session-context plugin
- **Todo consistency** enforced across session summary, subtask files, and checkpoint todos to prevent state divergence
- **Subagent discipline** improved through Task tool restrictions that enforce agent delegation workflows
