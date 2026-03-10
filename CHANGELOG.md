# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
