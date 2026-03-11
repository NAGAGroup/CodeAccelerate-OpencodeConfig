# OpenCode Roadmap

This document tracks planned, in-progress, and shipped features for the CodeAccelerate-OpencodeConfig project. Use this to understand what's coming, what we're working on now, and what's been delivered.

---

## Status Legend

- 🔲 **Planned** — approved feature, not yet started
- ▶️ **In Progress** — actively being worked on
- ✅ **Shipped** — merged and released
- ❌ **Dropped** — cancelled or deferred indefinitely

---

## In Progress

<!-- Example entry (remove once real features are added) -->
| Status | Feature | Description |
|--------|---------|-------------|
| ▶️ | session-context plugin — inject active session state to system prompt on every turn | Ensures HeadWrench stays oriented across context compactions by storing and retrieving active session metadata through structured JSON files |

---

## Planned

<!-- Example entries (remove once real features are added) -->
| Status | Feature | Description |
|--------|---------|-------------|
| 🔲 | custom agent hot-reload | Reload agent definitions without restarting OpenCode, enabling rapid iteration on subagent specs |
| 🔲 | multi-session breadcrumbs | Track cross-session dependencies and suggest related past sessions during planning |
| 🔲 | /plan-collaborative slash command | Parallel to `/plan` but tailored for writing session plans involving heavy agent–user back-and-forth; produces `.opencode/sessions` plans for open-ended, exploratory work where linear task execution doesn't apply |
| 🔲 | more frequent commits during session execution | Commit session context and progress more frequently during execution of a session plan to improve resilience and traceability |
| 🔲 | improved Architect usage instructions for HeadWrench | Clearer session-level guidance on when and how HW should invoke @Architect during sessions where it's enabled — currently HW never uses it even when opted in |
| 🔲 | session-context-manager | Better context/session/notes management with cleanup tooling (stale detection, deduplication, archive format suggestions) — built to be easy on the user |

---

## Backlog

Features under consideration but not yet prioritized. These may move to Planned or be dropped based on user feedback and architectural constraints.

<!-- Example entry (remove once real features are added) -->
| Status | Feature | Description |
|--------|---------|-------------|
| 🔲 | agent performance metrics | Track token usage, execution time, and success rate per agent to inform routing decisions |

---

## Recently Shipped

| Status | Feature | Description |
|--------|---------|-------------|
| ✅ | HeadWrench orchestrator (v0.1.0) | Primary orchestration agent with plan/session/checkpoint workflow for multi-agent coordination |
| ✅ | Seven specialized subagents (v0.1.0) | context-scout, deep-researcher, gates-expert, subagent-builder, code-writer, doc-writer, architect |
| ✅ | Nine slash commands (v0.1.0) | `/plan`, `/continue`, `/amend`, `/inbox`, `/context-add`, `/context-list`, `/context-remove`, `/activate-session`, `/deactivate-session` |
| ✅ | Checkpoint protocol (v0.1.0) | Canonical validation and approval workflow run at the end of every subtask |
| ✅ | Agent delegation skill (v0.1.0) | Loadable skill that assigns agents based on task complexity, type, and skill requirements |
| ✅ | Session-context plugin (v0.1.0) | Injects session metadata into system prompt to maintain orientation across context compactions |
| ✅ | Dynamic Context Pruning (v0.1.0) | Integration of `@tarquinen/opencode-dcp` plugin to optimize token usage in multi-turn sessions |
| ✅ | Mermaid diagram tool (v0.1.0) | Custom plugin leveraging the beautiful-mermaid library to render Mermaid diagrams as ASCII unicode art, SVG, or GitHub-compatible markdown fenced blocks |

---

## How to Update This Roadmap

When adding a new feature:

1. **Move from Planned → In Progress** when work starts (create subtask, assign contributor)
2. **Move from In Progress → Recently Shipped** when merged (update CHANGELOG.md first)
3. **Move from Recently Shipped → archive** after 2–3 releases (keep recent history visible)
4. **Update FEATURES.md** if the feature changes agent inventory, commands, protocols, skills, plugins, or MCPs
