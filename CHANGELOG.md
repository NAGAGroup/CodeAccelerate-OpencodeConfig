# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Added `ocx-ollama` profile for local Ollama inference with model specified via `OLLAMA_MODEL` environment variable

## [3.3.0] - 2026-03-29

### Added

- README and `docs/getting-started.md`: Git Setup section recommending users gitignore `.opencode/**` in project repos while keeping `opencode.jsonc` tracked

### Changed

- Planning enforcement plugin now requires explicit `next_step()` call on every node after todos complete, eliminating all auto-advance behavior. Previously, linear (single-path) nodes auto-advanced silently; now every node waits for `next_step()` before proceeding.
- Terminal nodes now also require `next_step()` to complete; the plugin detects no `next` field and closes the session gracefully.
- `next_step` tool `next` parameter is now optional; omit for linear advance or session completion, required when choosing a branch.
- Internal plugin status `"waiting_branch"` renamed to `"waiting_step"` to reflect universal applicability.
- `dag-design-guide.md` Execution & Advancement section updated to reflect universal `next_step()` requirement; auto-advance language removed.
- `headwrench.md` Plan Activation section updated: every node now requires `next_step()`, session closing requires `next_step()` on terminal nodes, stale "linear nodes auto-advance" language removed.
- `research-gate.md` option labels corrected to exactly match plan.json `when` conditions (`"User wants web research"` / `"User skips web research"`); mismatched labels would have caused branch matching to fall through.
- Branch node prompts (`research-gate.md`, `propose-structure.md`, `planning-gate.md`) updated with natural language indicating branching instructions will follow after todos complete.
- Node library `decision-gate` and `conditional-branch` READMEs updated to remove implementation-specific "plugin" references; replaced with neutral language indicating branching instructions follow automatically.
- Node library `decision-gate` prompt-template updated to document the connection between question option labels and plan.json `when` conditions, with a concrete JSON example.
- Node library `output-success` and `output-failure` READMEs updated with prominent anti-pattern warning against reusing terminal node IDs across branches.
- Node library `generic` README updated with an Anti-patterns section covering: no branching logic in generic nodes, no vague todo items, no long todo sequences, always rename the node ID.
- Clarified that ContextInsurgent is for reasoning and synthesis only — never for code edits; added explicit prohibition to `headwrench.md` routing rules, `propose-decomposition.md` agent routing guidance, and `analyze-deep/README.md` notes
- planning-enforcement plugin: `ensureOpenCodeIgnore()` now checks and writes both `!.opencode/` and `!.opencode/**` as distinct line-level patterns; fresh `.opencodeignore` creation includes both patterns
- Expanded sequential-thinking node guidance to encourage liberal use in complex project DAGs; updated `sequential-thinking/README.md`, `CATALOGUE.md`, `propose-decomposition.md`, and `headwrench.md` to replace "use sparingly" framing with active encouragement, concrete trigger conditions, and explicit multi-node examples.
- Restructured `plan-session` DAG to move node library discovery (`scout-node-library`) before sequential thinking, collapsing two user gates (`propose-structure` + `planning-gate`) into a single informed gate (`propose-plan`); updated `sequential-thinking.md` to produce a complete plan (structure + decomposition), added `scout-node-library.md` and `propose-plan.md`, removed `propose-structure.md`, `propose-decomposition.md`, and `planning-gate.md`
- Planning enforcement plugin: added `compress` to exempt tools list, resolving the contradiction where the compress MCP nudges the agent to compress but the plugin blocked the call outside of explicit todo sequences
- `headwrench.md`: added guidance to use compression nodes liberally in multi-phase project DAGs, including multiple per DAG between major phases — mirroring the existing sequential-thinking encouragement
- Node library: updated `compression-node` catalogue entry and README to encourage multiple uses per DAG in long/complex sessions
- Planning prompts: updated `sequential-thinking.md` to include a callout for compression nodes in long multi-phase DAGs

## [3.2.0] - 2026-03-28

### Changed

- Moved `research-gate` to immediately follow `scout` in the plan-session DAG, placing the research decision within the context-gathering phase. `sequential-thinking` now runs after all context (repo + optional web research) has been gathered, in both branches.

### Fixed

- Rewrote `research-gate.md` prompt to strictly enforce `question` tool call, preventing the planning agent from silently skipping the external research check
- Updated `research-brief.md` dispatch instructions to communicate cursory-pass scope without enumerating DeepResearcher's tools

## [3.1.2] - 2026-03-28

### Fixed

- **`propose-structure.md` and `planning-gate.md` question tool instructions** — replaced "do not present as plain text" directive (which caused haiku-tier HW to stuff proposal content inside the `question` call) with explicit "present as prose first, then call question with a single sentence" instructions, aligned with headwrench.md's question tool rules. Planning-gate option label updated to "Approve — write the DAG" to prevent haiku from confusing DAG authoring with project execution.

## [3.1.1] - 2026-03-28

### Fixed

- **`registry.jsonc` version** — bumped from `3.0.0` to `3.1.1`; was not updated during the v3.1.0 release
- **Release workflow in `AGENTS.md`** — added `registry.jsonc` version bump as a required step; corrected commit command to include all three files (`CHANGELOG.md`, `registry.jsonc`, `AGENTS.md`)

## [3.1.0] - 2026-03-28

### Changed

- **Delegation skill removed** — `files/skills/delegation/SKILL.md` deleted; all routing rules and step budgets consolidated directly into `headwrench.md`'s agent roster table. The skill was de facto unused — no planning DAG node ever invoked it, and its content was already duplicated in the HW prompt.

### Fixed

- **`.opencode/` session directory exclusion** — ContextScout and ContextInsurgent delegation instructions now consistently exclude `.opencode/` session content from codebase reads. Stale completed sessions can contain conflicting info that poisons analysis; planning infra files (node-library, etc.) remain accessible when explicitly tasked.
- **`research-gate` unconditional `question` tool** — removed self-assessment framing that allowed the planning agent to skip the `question` tool call with a plain-text conclusion; the gate now always requires the `question` tool. `research-brief` updated to establish Context7 as the primary lookup tool (Exa secondary) and explicitly defer deep research to generated project DAG nodes.

## [3.0.0] - 2026-03-27

### Added

- **Node library** — 12 reusable DAG node types (`session-overview`, `scout-parallel`, `analyze-deep`, `sequential-thinking`, `decision-gate`, `parallel-tasks`, `verification-check`, `conditional-branch`, `compression-node`, `output-success`, `output-failure`, `generic`), each with a `plan.json`, `README.md`, and `prompt-template.md`; ships as `files/planning/plan-session/node-library/`
- **DAG design guide** — `files/planning/reference/dag-design-guide.md`: authoritative schema spec and authoring rules for project DAGs
- **`validate_dag` tool** — plugin-provided tool that performs 6 checks on a project `plan.json`: schema validity, duplicate node IDs, prompt file existence, todo sections, question-tool phrases, and template patterns; returns a formatted report
- **`recover_context` tool** — restores full DAG session state (current node, todo progress, decisions) after context loss or autocompaction
- **`exit_plan` tool** — abandons the current DAG session cleanly; sets status to `abandoned` and saves state
- **Auto-advance** — linear DAG nodes advance automatically when all todo items are satisfied; no manual `next_step` call required for linear progression
- **Duplicate node ID validation** — plugin throws a hard error at activation time if any two nodes share an ID, preventing silent node-map corruption
- **Prompt path auto-rewriting** — bare prompt filenames (no `/`) are automatically expanded to the `prompts/` subdirectory at activation time
- **`{{SESSION_PATH}}` substitution** — node-library and plan files are copied into the local `.opencode/session-plans/` directory with paths resolved at copy time
- **`question` tool exemption** — `question` is permanently exempt from DAG todo blocking, allowing HW to ask clarifying questions at any point without disrupting node sequencing
- **HeadWrench subagent mode** — HW can now operate as a `task` node worker with full shell access for check-fix cycles, build verification, and integration checks
- **`ocx-haiku` profile** — new Anthropic profile using all-haiku models (`claude-haiku-4-5` for both primary and small)
- **`ocx-haiku-copilot` profile** — new GitHub Copilot profile using all-haiku models
- **Optional web research step** — `plan-session` DAG now includes an optional research branch (`research-gate` → `research-brief`) between the scout and sequential-thinking nodes
- **`planning/README.md`** — planning system overview document shipped with the registry
- **`.opencodeignore` auto-creation** — plugin creates `.opencodeignore` on activation to ensure `.opencode/` is visible to OpenCode in non-git contexts
- **Plugin compilation integrated into build** — `bun run build` now compiles `planning-enforcement.ts` to `.js` automatically; no separate compilation step needed
- **`context-insurgent` compress permission** — ContextInsurgent can now use the `compress` tool to synthesize discoveries before returning results
- **ContextInsurgent tool guidance** — explicit guidance added for 2000-line output truncation behavior and preferred tool usage

### Changed

- **Planning system unified to a single mode** — four specialized planning DAGs (`plan-generic`, `plan-debug`, `plan-collaborative`, `plan-deep-research`, `plan-deep-review`) replaced by a single universal `plan-session` DAG; `/plan-session` is now the only planning entry point
- **`plan-generic` renamed to `plan-session`** — `/plan-generic` command removed; `/plan-session` replaces it
- **DAG schema upgraded to v2.0** — tree-structured `entry` node replaces flat `nodes` record; `next` is now a child `DagNode` (linear) or `BranchOption[]` (branching) instead of a map of IDs; `session_type` and `entry` string pointer removed; `schema_version: "2.0"` required
- **HeadWrench operating context** — HW prompt restructured: memory protocol section removed, replaced with orchestrator/subagent dual-mode description and detailed question-tool usage rules
- **HeadWrench `mode: primary` frontmatter removed** — no longer set in agent YAML frontmatter
- **Plugin enforcement scope** — todo blocking is now scoped to the `headwrench` agent only (via `PRIMARY_AGENT` constant); other agents' tool calls are not tracked
- **`ocx-tools` component description updated** — from "NAGAGroup's plugins" to "NAGAGroup's plugins and planning scaffolds"
- **`ocx-bundle` command list reduced** — five planning commands (`plan-collaborative`, `plan-debug`, `plan-deep-research`, `plan-deep-review`, `plan-generic`) replaced by single `plan-session` command
- **AGENTS.md rewritten** — condensed from ~880 lines to ~240 lines; converted from verbose guidelines to a quick-reference format covering project identity, commands, repo structure, component architecture, agent system, planning system, and key files
- **`activate-plan` command updated** — plan.json parsing updated for schema v2.0 fields
- **DAG session status values** — `waiting_gate` → `waiting_branch`; `failed` → `abandoned`; `close_session` tool removed (sessions now terminate automatically at terminal nodes)
- **Delegation skill updated** — routing rules and agent descriptions updated to reflect HW subagent mode and ContextInsurgent compress capability

### Removed

- **Planning modes `plan-collaborative`, `plan-debug`, `plan-deep-research`, `plan-deep-review`, `plan-generic`** — all five modes and their full prompt suites deleted; replaced by the unified `plan-session`
- **`plan-design-guidelines.md`** — replaced by `files/planning/reference/dag-design-guide.md`
- **`close_session` tool** — sessions now auto-terminate at terminal nodes; explicit close call no longer needed
- **Memory MCP server** — `@modelcontextprotocol/server-memory` removed from all profiles (`ocx-default`, `ocx-copilot`, `ocx-free`) and all agent documentation
- **HeadWrench memory protocol** — `read_graph()` / `add_observations()` / `create_entities()` memory workflow removed from HW prompt
- **`task-library/` directory** — stale task library removed
- **`.opencode/archived-plans/`** — all archived planning session artifacts removed from the repository

### Fixed

- Plugin now works correctly outside git repositories (graceful fallback for `git rev-parse` failures)
- `validate_dag` resolves bare prompt filenames to the `prompts/` subdirectory before checking file existence
- Planning prompt paths use worktree-relative resolution; legacy config-root-relative `planning/...` prefix handling removed from `readPrompt`
- Duplicate node IDs in a project DAG now throw a hard validation error at activation instead of silently corrupting the node map

## [2.1.0] - 2026-03-21

### Added
- OCX-based distribution: move registry to OCX component format with `bunx ocx build` workflow
- `Available Next Steps` block appended on successful `activate_plan` execution
- Execution progress written into `plan.json` from `activate_plan`, `next_step`, and `close_session`
- `plan-deep-review` planning workflow for structured design and architecture reviews
- `plan-deep-research` planning workflow for iterative research sessions
- `choose_when` guidance injected via `next_step` to help users understand when to advance
- Terminal node constraint: `close_session` only allowed at nodes with no `next` defined

### Changed
- All four planning workflows restructured per workflow-audit recommendations
- Planning DAG paths now resolve as config-root-relative for OCX global installation compatibility
- README.md revised for clarity on multi-agent orchestration system
- Installation documentation updated to reflect OCX-based distribution workflow

### Fixed
- Missing schema task node in planning DAG schemas
- Planning prompts with clearer language patterns and constraints

## [2.0.0] - 2026-03-20

### Added
- DAG-driven planning system with three session types: `plan-session`, `plan-debug`, and `plan-collaborative`, enforced via a `planning-enforcement.ts` plugin
- User-facing documentation: new `docs/` directory with `agents.md`, `commands.md`, `configuration.md`, `getting-started.md`, and `planning.md`; README.md rewritten
- Session-overview node in all three planning session types
- DAG-aware compression protection in DCP prompt overrides
- `activate-plan` slash command for starting execution sessions

### Changed
- All agent files rewritten with persona, communication style, and anti-patterns sections using agent-directive language throughout
- All command, skill, and protocol files rewritten in agent-directive language; `$ARGUMENTS` contextualised in mid-sentence references in all command files
- Agent roster reorganised: agents moved from `opencode/agents/subagents/` to `opencode/agents/`; `context-scout`, `deep-researcher`, `junior-dev`, and `quick-doc` agents added or rewritten
- `delegation` skill replaces the former `agent-delegation-expert` and `agent-writer` skills
- DCP configuration and prompt overrides updated; planning DAG paths now resolve against `~/.config/opencode/` for global installation compatibility

### Removed
- `scripts/` directory (stale install scripts)
- Monolithic protocol files: `checkpoint.md`, `context-management.md`, `plan-*.md` protocol suite, `session-plan-schema.md`
- Legacy slash commands: `activate-session`, `amend`, `context-add`, `context-list`, `context-remove`, `continue`, `deactivate-session`, `plan-deep-research`, `plan.md`, `quick-plan`, `session-status`, `roadmap-add`
- `AUDIT.md`, `FEATURES.md`, `ROADMAP.md`, `docs/CONCEPTS.md`, `docs/DOCUMENTATION_MAINTENANCE.md`, `docs/USAGE.md`
- `session-context.ts` and `mermaid-tool.ts` plugins
- All `.opencode/context/` context items
- All `.opencode/archive/sessions/` and `.opencode/sessions/` artifacts

### Fixed
- Planning DAG prompt paths now resolve correctly against `~/.config/opencode/` for global installation compatibility
- Collaborative session role boundary enforcement

## [1.0.1] - 2026-03-15

### Fixed
- `plan-session` and `plan-debug` commands now pass `$ARGUMENTS` correctly to planning enforcement

## [1.0.0] - 2026-03-15

### Added
- Initial structured planning system with `plan-session` and `plan-debug` session types
- `planning-enforcement.ts` plugin for DAG state management
- `context-insurgent` agent for deep multi-file codebase reasoning
- `headwrench.md` orchestrator agent definition
- Session plan schema and protocol files

### Changed
- Agent files migrated from flat directory to `opencode/agents/subagents/`
- DCP prompt overrides updated for planning-aware compression behaviour

### Fixed
- DAG node advancement correctly blocked until user approval at gate nodes

### Removed
- Legacy session-context plugin replaced by planning enforcement

## [0.1.0] - 2026-03-10

### Added
- Initial repository structure with `opencode/` config directory
- DCP prompt overrides: `system.md`, `compress.md`, `turn-nudge.md`, `context-limit-nudge.md`, `iteration-nudge.md`
- Base agent files: initial context-scout and context-insurgent definitions
- `session-context.ts` plugin for session state tracking

### Changed
- Default DCP compression prompt replaced with project-specific guidance

### Fixed
- DCP override paths correctly resolved on Linux and macOS

[3.1.1]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/tree/v0.1.0
[Unreleased]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.3.0...HEAD
[3.3.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.1.2...v3.2.0
[3.1.2]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.1.1...v3.1.2
