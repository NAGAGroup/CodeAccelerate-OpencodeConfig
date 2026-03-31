# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Changed

- `files/planning/plan-session/prompts/present-dag.md`: Replaced single-line todo with proper `## Todo` section, added explicit `next_step()` MUST rule and action block.
- `files/planning/plan-session/prompts/research-brief.md`: Added work-ahead prevention block at top; hardened "After ExternalScout reports back" from advisory to MUST rule.
- `files/planning/plan-session/prompts/sequential-thinking.md`: Hardened final `next_step()` call from advisory to MUST, added prohibition on presenting the plan at this node.
- `files/planning/plan-session/prompts/write-dag.md`: Hardened Completion section — replaced advisory "ready to proceed" with explicit MUST `next_step()` call and prohibition on user-facing proposals.
- `files/planning/plan-session/prompts/git-context.md`: Hardened "After the task returns" from advisory to MUST rule with no-summarization prohibition.
- `files/planning/plan-session/prompts/clarifying-questions.md`: Added work-ahead prevention block at top; hardened advance step from advisory to MUST.
- `files/planning/plan-session/prompts/plan-complete.md`: Added terminal-node declaration block with explicit no-`next_step()` rule and instruction to fill `{plan-name}` from session context.
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md`: Hardened "advance when ready" in Before Advancing section to MUST `next_step()` with no-further-exploration prohibition.
- `files/planning/plan-session/node-library/parallel-tasks/prompt-template.md`: Hardened Before Advancing section — replaced advisory "advance when ready" with MUST `next_step()` rule.
- `files/planning/plan-session/node-library/generic/prompt-template.md`: Added Completion section with MUST `next_step()` rule after last todo item.
- `files/planning/plan-session/node-library/research-basic/prompt-template.md`: Added work-ahead prevention block in Zone 3; hardened After ExternalScout section from advisory to MUST.
- `files/planning/plan-session/node-library/research-deep/prompt-template.md`: Hardened After the Research section from advisory to MUST `next_step()` call.
- `files/planning/plan-session/node-library/analyze-deep/prompt-template.md`: Added After ContextInsurgent Reports Back section with MUST `next_step()` rule.

- `files/agents/headwrench.md`: Added zero-todo node rule, blocked-tool-call handling rule, and sequential-thinking batch prohibition to tighten small-model behavioral compliance; added explicit "After todos complete → call `next_step()` immediately" rule with negative examples covering post-task reasoning and user-facing proposals; corrected blocked-tool-call rule to name `[DAG BLOCKED]` error format and read the error message for next expected tool.
- `files/planning/plan-session/prompts/session-overview.md`: Added Permitted Actions section (tool restrictions) and Todo section.
- `files/planning/plan-session/prompts/scout.md`: Added same-turn parallel dispatch enforcement for Scouts 2 & 3, and Scout 1 acceptance gate; Scout 2 & 3 dispatch prompts now require verbatim embedding of both user task description and Scout 1's complete output (not paraphrase); added negative example for reference-without-embedding failure.
- `files/planning/plan-session/prompts/pre-research-thinking.md`: Added CRITICAL tool call required warning and explicit numbered execution sequence with example.
- `files/planning/plan-session/prompts/scout-node-library.md`: Strengthened advisory language to explicit prohibition, added Todo section.
- `files/planning/plan-session/prompts/propose-plan.md`: Added one-concept-per-thought rule and sequential-thinking example.
- Refactor `planning-enforcement.ts` plugin into focused TypeScript modules
- `session-overview.md` (shipped prompt) and `node-library/session-overview/prompt-template.md` now include an explicit "STOP — Do not work ahead" block that prohibits scouting, file reads, and task execution before the DAG sequences the next step; the block is fixed verbatim in the template so every generated DAG inherits the constraint.
- `node-library/session-overview/README.md` updated to document that the anti-work-ahead block is fixed text that must appear verbatim in every generated prompt.
- `scout-node-library.md` now includes an explicit "STOP — Do not act on what you just read" block preventing the model from synthesizing a plan or presenting proposals to the user after reading CATALOGUE.md; the only permitted action after the `read` call is `next_step()`.
- `planning-enforcement.ts` plugin now injects a `[DAG_ACTIVE]` sentinel into the system prompt via `experimental.chat.system.transform` whenever a DAG session is active, using a `chat.params` hook to cache per-turn session state (bridging the sessionID gap between hooks).
- `headwrench.md` now includes a `## DAG Executor Mode` section keyed to the `[DAG_ACTIVE]` sentinel: positive-framed role constraint, scope definition, self-correction trigger, and ✓/✗ concrete examples per small-model prompt engineering guidelines.
- `scout.md` dispatch instructions now use `glob` pattern `*` (depth-1 only) instead of `**/*` — prevents Scout 1 from returning massive recursive file lists; return format updated to require one-per-line verbatim depth-1 entries; added an explicit ✗ bad-pattern example for recursive glob use.

### Fixed

- `tool.execute.before` hook now correctly blocks non-exempt tool calls when DAG node status is `waiting_step` with an empty todo array — previously the `todo.length === 0` early return was evaluated before the `waiting_step` check, allowing the model to make arbitrary tool calls after `plan_session()` activated a node (like `session-overview`) that has no todos.
- `plan.json` `present-dag`, `present-dag-3`, `present-dag-5`, and `present-dag-6` nodes had `"task"` in their todo arrays instead of `"present_dag_to_user"`, causing the plugin to block the correct tool call at those nodes.

## [4.0.0] - 2026-03-31

### Added

- `present_dag_to_user` tool added to planning-enforcement plugin — displays the current session plan's DAG as an ASCII Mermaid diagram directly to the user using OpenCode's prompt injection API (`context.client.session.prompt()` with `noReply`, `synthetic`, and `ignored` flags) so the agent sees the message but doesn't respond to or process it.
- `present-dag` node added to plan-session DAG after `write-dag` — enables users to visualize the DAG structure at any point during plan execution; node dispatches the `present_dag_to_user` tool with the current session plan name.
- `init_dag` tool added to planning-enforcement plugin — creates a new project DAG's `plan.json` and session plan directory structure with the entry node as the tree root; must be called before `add_node` when starting a new plan.
- DAG editing tools (`show_dag`, `add_node`, `delete_node`, `modify_node`) added to planning-enforcement plugin — tools guarantee valid DAGs on every call, accept session-plan name or raw file path, and return plain-text ASCII mermaid diagrams using `beautiful-mermaid` (ANSI color disabled via `colorMode: 'none'`).

### Fixed

- `present_dag_to_user` tool now correctly awaits `client.session.prompt()` — previously fired without `await`, causing the injected message to race and never appear in the TUI.

### Changed

- **`write-dag.md` subagent instructions**: replaced hardcoded `files/planning/plan-session/node-library/` and `files/planning/reference/dag-design-guide.md` paths (which only exist in the CodeAccelerate source repo) with `{{SESSION_PATH}}/node-library/` — substituted at activation time to the exact session directory, giving the write-dag subagent the precise node library path with no glob or directory listing needed; added `init_dag` as the required first call before `add_node` when building a new DAG; added explicit instruction that `target` for all DAG tool calls is the plan name, never a file or directory path.
- **`dag-design-guide.md` rewritten from first principles**: removed all inline JSON code blocks (schema examples, structural primitive examples, anti-pattern bad/fix JSON blocks, validity checklist JSON field references); replaced with tool-call-centric documentation — authoring tools table, tool-based primitive descriptions (sequence/branch/iteration explained in terms of `add_node` call patterns), behavioral anti-patterns (what you called wrong vs. what to call instead); explicit note that `target` is always the plan name; rewritten checklist references DAG concepts not JSON fields.
- **`planning-enforcement.ts` — `resolveDagPath` bug fix**: when the resolved path is an existing directory, appends `/plan.json` automatically — prevents "plan.json is not valid JSON" error when agents pass a directory path (e.g., `.opencode/session-plans/my-plan`) instead of a bare plan name.
- **`planning-enforcement.ts` — `add_node` branch validation relaxed**: pre-mutation and post-mutation validation in `add_node` now use `validateDagTreeIds` (ID uniqueness only) instead of the full `validateDagTree` (which includes the ≥2 branch count check) — allows incremental branch building by calling `add_node` once per branch option without triggering a "fewer than 2 branches" error on the first or second addition. Full branch-count validation remains in `validate_dag`. Same relaxation applied to `delete_node` and `modify_node` pre-mutation checks so those tools can operate on partially-constructed DAGs during the branch-building phase.
- **`write-dag.md` instruction (d)**: explicitly states that `target` for all DAG tool calls (`add_node`, `show_dag`, `modify_node`, `delete_node`) is always the plan name, never a file path or directory path.
- **`dag-design-guide.md` tool reference**: updated tool list to include `init_dag`; added explicit workflow order (init_dag → add_node → show_dag/modify_node/delete_node).
- **`scout-node-library.md`**: tightened `read` instruction to specify the exact `filePath` argument and explicitly prohibit listing the directory first; removed rationale prose to reduce ambiguity.
- **`research-brief.md`**: removed `question` todo — agent now derives the research topic from prior context (task description + scout findings) and dispatches @ExternalScout directly; `plan.json` todo updated from `["question", "task"]` to `["task"]`.
- **DAG authoring workflow**: removed hand-written JSON instructions from all planning prompts, node-library templates, and reference documentation; replaced with tool-based authoring (`add_node`, `show_dag`, `modify_node`, `delete_node`) — affects `files/planning/reference/dag-design-guide.md`, `files/planning/plan-session/prompts/write-dag.md`, `files/planning/plan-session/prompts/propose-plan.md`, `files/planning/plan-session/node-library/decision-gate/README.md`, `files/planning/plan-session/node-library/decision-gate/prompt-template.md`, `files/planning/plan-session/node-library/conditional-branch/README.md`, `files/planning/plan-session/node-library/conditional-branch/prompt-template.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md`, `files/planning/plan-session/node-library/parallel-tasks/prompt-template.md`, `files/planning/plan-session/node-library/generic/prompt-template.md`

- **AGENTS.md rewritten from first principles**: stripped all operational agent-system content (agent roster, planning system flow, per-agent dispatch patterns, Category A/B/C technique lists, anti-patterns) that is already covered by the deployed agent config; retained only project-specific editorial knowledge — project identity, meta-context challenge, repository structure, component architecture, prompting framework (category definitions + improvement methodology), source code constraints, development/release workflow, and config conventions; reduced from 517 → ~200 lines
- **session-overview planning prompt** (`files/planning/plan-session/prompts/session-overview.md`): rewritten to a minimal agent-facing orientation — removes full phase-by-phase flow description and "when the user says yes" framing; now simply establishes that a planning session is beginning and instructs HW to call `next_step()`
- **session-overview node library** (`files/planning/plan-session/node-library/session-overview/`): README and prompt-template rewritten to reflect that the node is agent-facing only (not user-facing); template reduced to a single `{{SESSION_GOAL}}` placeholder; README "must resolve" section reduced to one item; failure modes updated to explicitly call out phase-listing and step-prediction as the primary anti-pattern

- Add `read` permission to ExternalScout frontmatter and a `## Truncated Output Recovery` prompt section instructing it to use `read` exclusively for recovering full content from truncated Exa tool outputs (written to `~/.local/share/opencode/`); `read` is explicitly scoped to this use only — not for internal codebase reads
- **Category A — Agent prompts rewritten from intent** (`files/agents/`): All 6 agent files (headwrench.md, context-scout.md, context-insurgent.md, external-scout.md, junior-dev.md, quick-doc.md) rewritten from scratch following research-established criteria: role-first primacy ordering, ≤15 rules per section, positive behavioral framing (NEVER reserved for categorical hard stops only), no dead-weight preamble sections, guardrails in recency zone
- **Category B — Planning prompt files rewritten from intent** (`files/planning/plan-session/prompts/`): All 11 existing planning prompt files rewritten plus `pre-research-thinking.md` created (was missing); all files now have ## Todo sections mirroring plan.json todo arrays, numbered dispatch blockquotes where applicable, and explicit routing instructions; routing bug fixed in research-gate.md (was routing to non-existent `pre-research-thinking`, now correctly routes to `sequential-thinking-2`)
- **Category C — Node library templates rewritten from intent** (`files/planning/plan-session/node-library/`): All 14 node type sets (28 files: README.md + prompt-template.md each) rewritten following Category C design criteria: three-zone template structure (fixed role/framing → annotated {{PLACEHOLDER}} slots → fixed execution-spec sections), explicit "What planning agent must resolve" checklist with good/bad examples, failure mode documentation with mechanism + fix, three-layer constraint cascade
- **Ollama profile updated** (`files/profiles/ollama/opencode.jsonc`, `docs/reports/ollama-model-recommendations.md`): Expanded 2026 model recommendations with comprehensive tool-calling research spanning Ollama-native and HuggingFace GGUF fine-tunes; ranked table expanded from 3 to 10 models in two tiers (Tier 1: Qwen 2.5 14B primary, Mistral Small 3.2 secondary, plus Command-R 35B, GLM-4.7-Flash, Qwen3 32B, Hermes-3 8B, Llama 3.1 8B; Tier 2: Qwen3 30B MoE, Nemotron-Mini, Phi-4-mini); added HF GGUF section covering Devstral-Small-2-24B, Ministral-3-14B, bartowski/ggml-org quantizers, and Modelfile workflow; profile inline comments updated to reflect new secondary (mistral-small) and link to full report
- **Project-agnostic reframing** (`files/planning/plan-session/prompts/`, `files/planning/plan-session/node-library/`): Removed all CodeAccelerate-specific path references and web-auth domain examples from shipped prompt files; replaced with generic project-neutral equivalents; `scout.md` and `scout-parallel/prompt-template.md` fully redesigned: Scout 1 now runs unconditional `**/*` glob and self-selects 3–5 key files (zero task context), Scouts 2+3 use task description + Scout 1's map, git subagent runs last using combined scout findings for targeted history queries
- Fixed dispatch prompt audience confusion across all planning DAG prompts and node-library templates — 9 files updated: `scout-parallel`, `analyze-deep`, `parallel-tasks`, `generic`, `research-basic`, `research-deep` prompt-template.md files; `research-brief.md`, `write-dag.md` planning prompts; and `headwrench.md` agent
- Added HW self-delegation entry to HeadWrench Specialist Delegation Map in `files/agents/headwrench.md`
- Extracted git context collection from scout node into standalone `git-context` DAG node — added `files/planning/plan-session/prompts/git-context.md`, updated `scout.md` (Phase 3 removed, Phase 1-2 blockquotes reframed), updated `files/planning/plan-session/plan.json` to insert `git-context` node between `scout` and `scout-node-library`

### Fixed

- Refactored `validate_dag` tool to remove prompt content checking logic: now strictly validates JSON validity, duplicate node IDs, and prompt file discoverability only. Moved prompt quality and logical completeness validation to the HW subagent in the `write-dag` node's step 3, where it belongs in the verification/fix workflow
- Updated `files/planning/plan-session/prompts/write-dag.md` step 2 description to accurately reflect new `validate_dag` scope: "check JSON validity, duplicate node IDs, and prompt file discoverability" (removed "prompt quality" reference)
- Improved `files/planning/plan-session/prompts/write-dag.md` step 3 (HW subagent verification): added explicit numbered checklist for what the subagent should validate (file discoverability, DAG structure, prompt content, logical flow) and what issues to fix; clarified return format to include specifics on what was wrong and how it was fixed

### Corrected parallel dispatch description in `files/planning/plan-session/prompts/scout.md`: replaced technically inaccurate "emitting before any return / OpenCode runs concurrently" framing with accurate description — parallel dispatch means the LLM emits multiple tool calls in one response turn; the plugin always processes them sequentially
- Fixed `scout-node-library` planning node (`files/planning/plan-session/prompts/scout-node-library.md`): added clarification that ContextScout IS permitted to read from the current session's node-library directory (it is live planning infrastructure, not a stale prior session artifact); changed todo from `["task"]` to `["read","task"]` so HeadWrench reads CATALOGUE.md directly via the read tool before dispatching the scout for README files only
- Updated `files/planning/plan-session/plan.json`: `scout-node-library` node todo changed from `["task"]` to `["read","task"]`
- Corrected environment variable interpolation syntax for Exa MCP in all 6 profile configs (`default`, `copilot`, `haiku`, `haiku-copilot`, `free`, `ollama`): changed `${EXA_API_KEY}` (shell syntax, not interpolated by OpenCode) to `{env:EXA_API_KEY}` (correct OpenCode syntax); also corrected the documented syntax in `AGENTS.md`

### Changed

- improve prompt engineering across all agent files (context-scout, context-insurgent, junior-dev, external-scout, quick-doc): added error/OOS handling, output format null-handling, role sentence clarity, positive constraint framing, section ordering per A1–A6 criteria
- improve planning prompt files: fixed research-gate Q1/Q2 orthogonality bug, corrected when-string routing to explicit next_step node-ID routing in research-gate, propose-plan, and activation-gate; upgraded dispatch blockquotes to 4-slot templates in scout, scout-node-library, research-brief, write-dag; added subagent rejection criteria blocks
- improve node library templates (all 13 non-analyze-deep node types): added good/bad examples to must-resolve sections, added output constraint propagation bullets, added adjacent placeholder annotations (C3), added fixed execution-spec sections (C4), added dispatch blockquotes (C5), added named failure modes to Notes sections (C6)
- improve AGENTS.md: added missing prompt engineering techniques A6 (prompt ordering), B7 (MAST delegation failures), C7 (template ordering), C8 (constraint cascade); corrected plugin enforcement scope, activate-now description, and branch routing documentation; added exempt tools list and CI scope exclusion
- improve: comprehensive prompt engineering audit for ollama/small-model (devstral-small-2) compatibility across all three prompt categories — agent files (`files/agents/`), planning DAG delegation prompts (`files/planning/plan-session/prompts/`), and node library templates (`files/planning/plan-session/node-library/`); planning DAG structural improvements including new `pre-research-thinking` node inserted before research gate, scout-node-library todo simplified to HW-direct CATALOGUE read, and research-gate Q1 criteria broadened beyond API/library tasks; codified adjacent research→insurgent→implement triplet pattern in AGENTS.md
- improve commands and skills: added role sentences, error handling, and positive constraint framing
- Added `clarifying-questions` node to the plan-session DAG, inserted after each sequential-thinking node (both branches). The node prompts HW to summarize its understanding and ask any last-minute clarifying questions before presenting the final plan. The `question` tool may be called multiple times (it is exempt from DAG blocking). If no questions exist, HW asks a confirmation question. Post-question sequential thinking is optionally available if answers introduce new information.
- Created `clarifying-questions.md` prompt file for the new nodes.
- Sequential thinking prompts (`sequential-thinking.md`, node-library `prompt-template.md`): agents now estimate and verbalize expected thought count before starting, and stop as soon as they have a complete result rather than continuing to a minimum count; the "keep calling continuously" instruction is preserved
- Improved subagent delegation prompts in `files/agents/headwrench.md`: added per-agent prompt requirements subsection (concrete guidance for ContextScout, ContextInsurgent, ExternalScout, JuniorDev, and QuickDoc), verbatim-return guidance, explicit ExternalScout tool priority (Context7 first, Exa second), and ES=external-only corollary to CS=internal-only boundary rule
- Fixed ExternalScout description ordering in `files/agents/headwrench.md`: tools now listed as "Context7 + Exa" (was "Exa + Context7") in both Agent Roster and Routing Rules
- Updated `files/agents/context-scout.md`: Output Format section now has a default/exception rule so task-specific return instructions override the 5-section template; Hard Constraints section has new "No generic section inflation" rule
- Fixed bug in `planning-enforcement.ts` where exempt tools were blocked during `waiting_step` and `running` states if they weren't the expected todo item; the `tool.execute.before` hook now correctly bypasses blocking for all exempt tools regardless of DAG status; also added `sequential-thinking_sequentialthinking` to the exempt tools list
- Improved all 6 agent prompt files (`headwrench.md`, `context-scout.md`, `context-insurgent.md`, `junior-dev.md`, `external-scout.md`, `quick-doc.md`): added scope overload escalation paths, step budget awareness, output format specifications, jurisdiction clarity between agents, and consistent anti-filler guidance
- Fixed critical bug in `files/planning/plan-session/prompts/write-dag.md`: `compress` was missing from the valid todo enumeration, causing planning agents to omit compression nodes from generated DAGs
- Fixed critical bug in `files/planning/plan-session/prompts/research-gate.md`: Q1 option labels did not match `plan.json` branch `when` conditions, causing DAG branch routing to fail on every planning session run
- Improved all 11 planning DAG prompt files: added `next_step()` call instructions, fixed stale `propose-structure` node reference in `research-brief.md`, standardized `.opencode/` prohibition wording, improved todo sequencing clarity
- Improved all 12 node library prompt templates: standardized `{{UPPER_SNAKE_CASE}}` placeholder naming, added per-placeholder guidance, improved section headers, fixed `conditional-branch` and `verification-check` template gaps
- Improved all 12 node library READMEs: added "when NOT to use" guidance to every node type, clarified `-<N>` suffix convention (no `-1`), added concrete decision criteria and cross-references
- Updated `CATALOGUE.md`: added research node disambiguation callout distinguishing planning-phase (`research-gate`/`research-brief`) from DAG-phase (`research-basic`/`research-deep`) research nodes; fixed stale phase name references; improved `conditional-branch` routing description
- Updated `files/planning/reference/dag-design-guide.md`: added prominent callouts for node ID uniqueness (breaking constraint), `next` must be full object (not string), and `when` string routing mechanic; updated duplicate ID description to reflect validation error behavior
- Expanded delegation prompt guidance in `files/agents/headwrench.md`: added Verbatim-Return Instructions subsection (when/how to use verbatim-return), strengthened @ContextScout routing rule with explicit internal-only boundary, and added anti-generic-sections requirement (item 4) to @ContextInsurgent prompt requirements
- Added self-regulation patterns to specialist agent files: `context-scout.md` (internal-codebase-only boundary statement, specificity reminder in Output Format, interpretation-logging rule in Hard Constraints), `context-insurgent.md` (format-override exception clause, path-fallback rule, anti-generic anti-pattern), `junior-dev.md` (path-discovery fallback in No Questions rule), `external-scout.md` (Context7 two-step invocation, vague-topic interpretation rule)
- Improved `parallel-tasks` node library templates: added Success criterion field to all 3 task sections in prompt-template.md, added conventions reference to Scope & Constraints hint, added QuickDoc-specific delegation guidance; added Success criterion and Conventions reference bullets to README.md
- Improved `scout-parallel` node library README with verbatim anti-generic-sections instruction for scout dispatch prompts
- Improved `analyze-deep` node library templates: added Output constraint bullet to README.md resolve list; updated file-list placeholder hint to require explicit paths; added Output format requirements section to prompt-template.md
- Improved `verification-check` node library templates: added Outcome format bullet to README.md resolve list; added Response format section to prompt-template.md as first-class body content
- Updated `files/planning/plan-session/prompts/write-dag.md` to dispatch @HeadWrench subagent (instead of @QuickDoc/@JuniorDev) for writing project DAG artifacts; HW subagent reads node library docs (CATALOGUE.md, dag-design-guide.md, node READMEs) before writing, eliminating the requirement for primary HW to embed a full plan.json JSON blob in its dispatch prompt.
- Expanded `pre-research-thinking` to reason across three dimensions (planning research, execution research, execution research type) with explicit criteria for each level (NECESSARY/RECOMMENDED/NO) and a structured 3-line output block that downstream nodes consume
- Redesigned `research-gate` questions to use an approve/deny pattern where HW constructs dynamic question text at runtime from its pre-research-thinking recommendations, replacing the broken static "(HW recommends)" option-label approach

### Fixed

- Added task tool usage instructions (required params, `task_id` format) and dispatch prompt quality guidance to all task-using plan-session prompts and node library prompt templates, addressing invalid tool calls and weak subagent prompts on less-capable models.

## [3.6.0] - 2026-03-29

### Added

- Extended `scout` node in the `plan-session` DAG with a 4th parallel task that dispatches HeadWrench as a subagent to run git commands (`git status`, `git log`, `git diff`) when in a git repo, providing recent commit and in-progress change context during planning
- `dag-design-guide.md`: added Anti-patterns section with wrong-vs-right examples for `next` field format, branch node references, duplicate IDs, and prompt paths, plus a 7-item validity checklist

### Changed

- Moved `scout-node-library` to run before `research-gate` in the `plan-session` DAG, giving HeadWrench node library context (including `research-basic` and `research-deep` nodes) when forming planning recommendations
- Upgraded `research-gate` from a single question to two sequential questions with HW recommendations: (1) is cursory planning-time research needed? (2) should the generated project DAG include execution-time research nodes?
- Removed redundant `scout-node-library-2` node from the no-research branch (node library is now loaded in the main sequence before the gate)
- Updated `sequential-thinking.md` prompt to incorporate the execution-time research preference from the research gate
- `write-dag.md` now requires HeadWrench to embed the complete `plan.json` as a JSON code block when delegating to write-dag subagents, preventing format drift where haiku agents produced flat `nodes` map format instead of the required nested-tree format
- `headwrench.md` Planning section now explicitly requires JSON embedding in write-dag delegations
- `planning-enforcement.ts` plugin: added `todowrite` to the exempt tools list so task-list management calls are never blocked by DAG todo enforcement
- Removed `compress` from exempt tools in planning-enforcement plugin — compress is now blocked unless explicitly listed as a todo item in a DAG node, preventing uncontrolled calls during planning sessions
- `headwrench.md`: removed incorrect claim that `@ContextInsurgent` may invoke the `compress` tool — CI is for reasoning only; compression is HW's responsibility via dedicated `compression-node` entries in project DAGs

### Fixed

- `scout-node-library.md` planning prompt: fixed node library README path examples to include `{{SESSION_PATH}}/node-library/` prefix — bare relative paths caused agents in other projects to fail when reading node type README files
- `write-dag.md` planning prompt: corrected `compression-node` quick reference todo from `["task"]` to `["compress"]` to match actual plugin enforcement
- `planning-enforcement` plugin: non-exempt tools were unblocked during the `waiting_step` window (after a node's todos exhausted but before `next_step()` was called) because both hook guards returned early for any non-`running` status. The before hook now throws explicitly when status is `waiting_step`, and the after hook guard no longer treats `waiting_step` as a skip condition.

## [3.5.0] - 2026-03-29

### Changed

- Renamed `DeepResearcher` agent to `ExternalScout` with expanded scope covering any level of external research (cursory to deep investigative). Added `research-basic` and `research-deep` node library types as first-class research primitives dispatching `@ExternalScout`. Fixed planning DAG `research-brief` prompt to make the `@ExternalScout` vs `@ContextScout` boundary explicit — ContextScout is internal-only.
- `ocx-default` and `ocx-copilot` profiles: added `provider` block disabling extended thinking (`reasoning: false`) for `claude-sonnet-4-6` / `claude-sonnet-4.6` respectively
- `context-scout.md` agent: added root-directory glob fallback instruction — if dispatched with no specific file paths, scout must use a broad glob pattern to orient itself rather than returning empty
- `headwrench.md` agent: added `multiple` parameter guidance to Question Tool Usage section (rule 6) — `multiple: true` for multi-select scenarios, `multiple: false`/omit for binary/exclusive choices
- `planning-enforcement.ts` plugin: improved `next_step` error message to show remaining todo count and next expected tool name when called prematurely
- `sequential-thinking.md` planning prompt: raised minimum thought count from 6 to 10; added todo-array validation step with explicit list of invalid todo values
- `scout-node-library.md` planning prompt: added CRITICAL verbatim-return requirement — scout must return CATALOGUE.md in full without summarizing or paraphrasing
- `research-brief.md` planning prompt: added instruction to dispatch researcher immediately after question resolves, in the same response without pausing
- `scout.md` planning prompt: added mandatory requirement block — HeadWrench must provide specific file paths or glob patterns to each scout alongside thematic goals
- `write-dag.md` prompt: added node type → todo quick reference table; added user-task context warning; strengthened `next` field rule for non-terminal nodes
- `sequential-thinking.md` prompt: fixed sequential-thinking stall (explicit "keep calling in same turn" instruction); added `todo` column to required node decomposition output table
- `propose-plan.md` prompt: added `Todo` column to node decomposition table requirement with explanation that values are written verbatim into `plan.json`
- `headwrench.md` agent: Planning Step 3 now instructs HW to pass explicit `todo` arrays in the write-dag dispatch prompt
- `ocx-ollama` profile now uses a fixed `opencode-model` alias instead of the `OLLAMA_MODEL` environment variable; users must run `ollama cp <model> opencode-model` to register their chosen model. Documentation updated with `ollama cp` setup and systemctl parallelism configuration instructions.
- Improved tool-call blocking in planning-enforcement plugin: `bash` now runs `/bin/true` as a no-op when blocked instead of executing with garbage args; best-effort short-circuit via `output.output` pre-set added to `tool.execute.before`

### Fixed

- Fixed `activate-now` nodes in the `plan-session` DAG: changed `todo` from `[]` to `["activate_plan"]` so HeadWrench can call `activate_plan` before the terminal completion message fires; removed contradictory "Do NOT call activate_plan yourself" instruction from the plugin's terminal completion message; updated `activate-now.md` with a clarifying note.
- Fixed `compression-node` node library definition — node now correctly instructs HeadWrench to call the `compress` tool directly via the DCP plugin, rather than incorrectly dispatching ContextInsurgent as an agent. Updated `plan.json`, `README.md`, `prompt-template.md`, `CATALOGUE.md`, and `AGENTS.md`.
- Restored tool blocking in planning-enforcement plugin: removed erroneous `output.output` assignment from `tool.execute.before` hook that caused OpenCode to skip the after hook, bypassing all tool blocking
- Fixed block message display: "Current node" now correctly shows the DAG node ID instead of the blocked tool name
- `planning-enforcement.ts` plugin: always resolve working directory from `process.cwd()` instead of `context.worktree` — fixes planning sessions broken in projects where the CWD is a symlinked subdirectory of a git repository (the git worktree root was used instead of the actual CWD, causing session files and the node-library copy to land in the wrong location)
- Planning-enforcement plugin now throws from `tool.execute.before` to prevent blocked tool calls from executing. Previously, blocked calls were neutered with harmless args but still executed; throwing from the before hook prevents execution entirely, matching the official OpenCode plugin pattern.

## [3.4.0] - 2026-03-29

### Added

- Activation gate at end of plan-session DAG: after the project DAG is written and validated, HeadWrench asks if the user wants to activate and execute immediately, eliminating the need to manually type `/activate-plan`
- Added `ocx-ollama` profile for local Ollama inference with model specified via `OLLAMA_MODEL` environment variable

### Changed

- Relaxed auto-injected `next_step` instruction verbiage in planning-enforcement plugin to use permissive "when you're ready" language, opening a window for agent-user interaction between todo completion and node advancement
- Added optional "Before advancing" guidance sections to non-branching node library prompt templates (scout-parallel, analyze-deep, sequential-thinking, parallel-tasks, verification-check, compression-node, generic), prompting agents to consider user interaction when findings warrant it

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
[Unreleased]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v4.0.0...HEAD
[4.0.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.6.0...v4.0.0
[3.6.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.1.2...v3.2.0
[3.1.2]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v3.1.1...v3.1.2
