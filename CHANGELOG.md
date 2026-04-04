# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- `files/planning/plan-session/prompts/plan-success.md` — new terminal node for the planning session DAG; writes a plan summary and ends the session cleanly so the user can run `/activate-plan`

### Changed

- All profiles (`files/profiles/*/opencode.jsonc`) — Qdrant MCP server configuration updated to support concurrent sessions: replaced `QDRANT_LOCAL_PATH` with `QDRANT_URL: http://localhost:6333` to connect all sessions to a single shared Qdrant instance instead of spawning per-session servers; requires starting Qdrant once as a persistent background service (`docker run -d --name qdrant -p 6333:6333 qdrant/qdrant` or `uvx mcp-server-qdrant`)

- `files/planning/plan-session/plan.jsonl` — removed `dag-revision` and `user-review` nodes; wired `dag-review` directly to `plan-success`; fixed `write-notes` todo from `["write"]` to `["qdrant_qdrant-store"]` to match the Qdrant-only storage model
- `files/planning/plan-session/prompts/write-notes.md` — removed markdown file writing entirely; todo now stores all findings to Qdrant via `qdrant_qdrant-store`; Qdrant is the sole persistent record for session knowledge
- `files/planning/plan-session/prompts/session-overview.md` — replaced shallow reasoning questions ("Are you ready?") with three skill-specific questions that force genuine engagement with following-plans, asking-questions, and sequential-thinking content
- `files/planning/plan-session/prompts/external-research.md` — added step 5b: show revised research prompt as a plain message before dispatching when user chose Modify, closing the loop on the approval flow
- `files/planning/plan-session/prompts/user-review.md` — added `present_dag_to_user` as first todo step; question tool now contains only a short approval question; added disapproval guidance to rules
- `files/planning/plan-session/prompts/dag-design.md` — updated dispatch instructions: collapsed `add_node` signature (no custom prompt/todos), descriptive node IDs required, rationale document required at `{{SESSION_PATH}}/notes/rationale.md`, delegation restricted to context-scout/context-insurgent only
- `files/planning/plan-session/prompts/dag-review.md` — updated dispatch instructions: `show_dag` before reviewing, read rationale document, explicit 7-item checklist, delegation restricted to context-scout only
- `files/planning/plan-session/node-library/execution-kickoff/prompt.md` — expanded from thin 3-step prompt to full orientation: retrieves planning context via `qdrant_qdrant-find`, visualizes DAG via `show_dag`, reasons through plan intent via `sequential-thinking_sequentialthinking` before proceeding
- `files/planning/plan-session/node-library/execution-kickoff/node-spec.json` — updated todo array from `["skill", "read"]` to `["skill", "qdrant_qdrant-find", "sequential-thinking_sequentialthinking", "show_dag"]`
- `files/agents/junior-dev.md` — added `"probe*": allow` to permission block; description and rules reframed from surgical-editing to goal-oriented investigation-first approach
- `files/agents/tailwrench.md` — added `steps: 30` to YAML frontmatter to constrain the highest-capability agent
- `files/agents/context-insurgent.md` — removed `compress: allow` from permission block (leftover; compress is a HW-only session management tool)
- `files/skills/sequential-thinking/SKILL.md` — added `## Anti-patterns` section documenting four failure modes: compressing all reasoning into a single thought, planning without doing, empty filler thoughts, locking totalThoughts too early
- `files/skills/dag-review/SKILL.md` — replaced free-form critique guidance with structured `## Review Checklist` covering seven items: Completeness, Dependency correctness, Component fit, Verification coverage, Scope creep, Failure handling, Efficiency
- `files/skills/context-scout-delegation/SKILL.md` — removed redundant step instructing delegating agents to tell the scout to load the sequential-thinking skill (the scout's own agent definition already does this unconditionally)
- `files/skills/qdrant-notes/SKILL.md` — updated purpose statement from "use in addition to file notes" to "Qdrant is the sole persistent record for findings, decisions, and context"
- `files/skills/juniordev-delegation/SKILL.md` — reframed from surgical-editing model to goal-based delegation; updated "What @juniordev Does", delegation prompt guidance, and examples

### Changed

- `files/agents/context-scout.md` — added `sequential-thinking_sequentialthinking: allow` to permission block and Tool Access line; ContextScout now uses sequential-thinking to reason through its search plan before touching files
- `files/planning/plan-session/prompts/scout.md` — full rewrite using sequential-thinking approach: `Do now: read .` as immediate action, then 3 sequential-thinking thoughts (thought 1: per-question signal mapping, thought 2: exclusions + tool plan, thought 3: unfamiliar entries), then 3 execution steps (read non-excluded top-level files, glob core dirs + grep signals, answer 8 questions); replaces the previous verbose 7-step scaffolding with write-out checkpoints and todowrite; dramatically shorter prompt with equivalent or better step discipline from reasoning instead of procedural gates
- `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — same sequential-thinking rewrite applied to parallel scout templates: `Do now: read .`, 3 thoughts (thought 1 maps signals for the specific investigation question rather than all 8, thoughts 2–3 identical pattern), 3 execution steps; replaces 7-step scaffolding in both the planning-agent dispatch prompt and both Scout 1 / Scout 2 node-library templates

- `files/agents/context-scout.md`, `files/agents/context-insurgent.md`, `files/agents/external-scout.md`, `files/agents/junior-dev.md`, `files/agents/quick-doc.md` — added **Todo Management** section to all five subagent files: when a todowrite list is present, mark each todo `in_progress` before starting it and `completed` immediately when done; added ✗/✓ showing create-and-ignore (✗) vs mark-in_progress-then-completed (✓); encodes the behavior in the agent system prompt so it applies universally without repeating it in every dispatch prompt

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — changed step (3) from a declarative filter ("read every file not excluded in step 2") to an imperative per-file check ("for each file, check exclusion list first — skip if present, read if not"); models were writing the exclusion list in step (2) but ignoring it when issuing Read calls in step (3), causing lock files to be read and flooding the context; added ✗/✓ at step (3) showing a lock file being correctly skipped

- `files/agents/context-scout.md`, `files/agents/context-insurgent.md`, `files/agents/external-scout.md`, `files/agents/junior-dev.md`, `files/agents/quick-doc.md` — added `todowrite: allow` to all subagent permission lists; `todowrite` is now available to all agents so dispatch prompts can require a todo list as the first action to keep the step sequence visible in the model's active context as a system-injected list

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — added `todowrite` as the mandatory first action in all scout subagent prompts: before executing any steps the model must call `todowrite` with one todo per step (all pending); the todo list persists as a system-level reminder that survives file reads flooding the context; added ✗/✓ showing full 7-step list (✓) vs collapsed/skipped list (✗); also added `libs/`/`src/`/`packages/`/`vendor/` explicit ✗ anti-pattern to the exclusion step, and clarified that `glob` in step (5) is a real tool call not a mental description

- `files/planning/plan-session/prompts/research-brief.md` — added `todowrite` as the mandatory first action in the ExternalScout dispatch template: before any tool calls the model must create a 5-step todo list; same ✗/✓ pattern as scout prompts

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — restructured subagent prompts to front-load mechanical steps before task context: steps (1)–(3) (`read .`, write exclusion list, write generic grep patterns) now execute before the model sees the 8 questions or the area/question slots; task context appears behind `---` dividers in the middle; steps (4)–(7) follow after; prevents task context from hijacking the procedure into a default tree-walk before the structural pre-work is done; also added explicit `libs/`/`src/`/`vendor/` ✗ anti-pattern to the exclusion step to prevent source dirs from being incorrectly excluded, and clarified that `glob` in step (5) is a real tool call not a mental description

- `files/planning/plan-session/prompts/research-brief.md` — added explicit research-plan write-out step (new step 2): before making any tool calls ExternalScout must write its research plan listing which tool(s) and how many calls it expects per gap; turns silent tool-selection into an observable commitment; renumbered execute, accumulate, and output steps to 3–5

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — fixed gate conflict: the "do not write until all steps complete" gate at the top of the procedure contradicted the mid-step write-out instructions added in the previous commit, causing the model to stop after writing the core-dirs list and not continue; gate now reads "the step (2), (4), and (6) write-outs are required mid-step checkpoints — write them, then continue; do not write your final answers until all 7 steps are complete"

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — added explicit write-out instructions at every classification decision point: after step (2) the model must write its exclusion list, after step (4) it must write its core directory list, and after identifying grep patterns in step (6) it must write them before running; forces the model to commit to each decision in text before acting on it, making silent misclassification impossible

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — added a dedicated exclusion-identification step (new step 2) immediately after `read .`; the model now explicitly names which directories (build output, package caches) and files (lock files, binary files) to exclude before reading or globbing anything; subsequent classify-core and glob steps reference this exclusion list directly, preventing scouts from globbing excluded dirs like `build/` that the previous abstract `<build-output-dir>/` placeholder was not concrete enough to catch; total step count increased from 6 to 7 in all three templates

- `files/agents/context-scout.md` — removed hardcoded Output Format section (Interpretation/Findings/Sources); the agent-level format overrode dispatch prompt output instructions, causing scouts to fall back to the wrong structure regardless of what the dispatch prompt specified
- `files/agents/external-scout.md` — removed hardcoded Output Format section (Interpretation → Key findings → Relevant APIs → Caveats → Next-step pointers); same override issue as ContextScout

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — replaced single "glob every directory except bad dirs" step (3) with two steps: (3) identify core project directories from root listing (source, test, CI, config dirs — not build output or package caches) with ✓/✗ classification examples, then (4) glob only those identified core dirs; prevents scouts from globbing `build/`, `.pixi/`, and other excluded dirs that were ignored in the skip list but not in the positive classification approach; renumbered subsequent grep and read steps accordingly

- `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — removed "relevant to the area" qualifier from step (2); the qualifier permitted scouts to skip top-level files they deemed irrelevant, matching the same failure mode previously fixed in `scout.md`; step (2) now reads every top-level file unconditionally

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — restructured subagent prompt: steps now come before questions/answer target; added "Complete all 6 steps in order. Do not write your answers until all 6 steps are complete." gate at the top of the procedure; previously the model would anchor on the questions/answer target, do reads, find partial answers, and stop before completing steps (3)–(6); also clarified step (2) as "top-level FILE — not directories; directories are handled in steps (3) and (4)" to prevent the model from `read`-ing directory entries as if they were files

- `files/planning/plan-session/prompts/scout.md`, `files/planning/plan-session/prompts/scout-parallel.md`, `files/planning/plan-session/node-library/scout-parallel/prompt-template.md`, `files/planning/plan-session/prompts/git-context.md`, `files/planning/plan-session/prompts/research-brief.md`, `files/planning/plan-session/prompts/write-dag.md` — added explicit dispatch contract above every code block template in all delegation nodes: explains what the code block is (exact `prompt` string), why verbatim matters (subagent receives it character-for-character — reformatting breaks step structure), and ✗/✓ task call examples (collapsed/paraphrased/`\n`-literal = bad, exact multi-line content = good); addresses primary agent reformatting the prompt string during delegation

- `files/planning/plan-session/prompts/research-brief.md` — added `{{PROJECT_CONTEXT}}` slot to dispatch template (language, toolchain, package manager summary) with ✓/✗ fill examples; without it ExternalScout searches generically and returns results for the wrong ecosystem; added explicit 4-step research procedure inside the template (tool selection, run every gap, accumulate findings before writing, single output block at end); added ✗/✓ query examples showing stack-specific vs generic queries; moved ✗ output before ✓ output; added constraint that output must be written once at the end — not between tool calls

- `files/planning/plan-session/prompts/scout.md` — fixed must-do steps: replaced 2-step "read top-level + deep search" with explicit 5-step procedure: (1) `read .` for flat root listing, (2) read all top-level files, (3) `glob <dir>/**` for every listed directory — mandatory for all non-excluded dirs, example dirs as `<dir-a>/**` placeholders to prevent anchoring on specific names, (4) identify grep patterns from the 8 questions and run per named directory — mandatory, not gap-filling, with ✗/✓ grep examples using placeholders, (5) read relevant files found in steps (3) and (4); skip list extended with `.cache/`
- `files/planning/plan-session/prompts/scout-parallel.md` — same 5-step must-do procedure applied to subagent template (grep patterns derived from investigation question)
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — same 5-step must-do procedure applied to both Scout 1 and Scout 2 templates

- `files/planning/plan-session/prompts/scout.md` — replaced 5-step tool-micromanagement block with job-definition + must-dos (read top-level files, deep search structure); moved ✗ before ✓; added second ✗ for the specific failure mode of abandoning the 8-question format when a single file read 404s
- `files/planning/plan-session/prompts/scout-parallel.md` — replaced 5-step tool-micromanagement block in subagent template with job-definition + must-dos; moved ✗ before ✓
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — replaced 5-step tool-micromanagement block in both Scout 1 and Scout 2 templates with job-definition + must-dos; moved ✗ before ✓

- `files/planning/plan-session/prompts/scout-think.md` — expanded area selection from "pick two most relevant" to a mandatory sweep of all 10 areas with APPLIES/DOES NOT APPLY verdict per area before narrowing; ✓ thought 1 example now shows explicit per-area sweep format; ✓ thought 2 shows narrowing from APPLIES set with implication questions (constraint / pattern to extend / dependency to satisfy — not inventory); updated ✗ to reflect actual failure mode (jumps to two obvious area names without sweeping others)
- `files/planning/plan-session/prompts/scout-parallel.md` — added `{{QUESTION}}` fill guidance with ✓/✗ examples before the template block; ✓ shows implication question (what the current state constrains or enables for the change); ✗ shows flat inventory question that asks only what exists
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — replaced Zone 2 fill examples for `{{SCOUT_1_QUESTION}}` and `{{SCOUT_2_QUESTION}}`; ✓ now shows implication questions (what must be added/verified, what constraint is imposed); ✗ now shows flat inventory questions that ask only what files exist

- `files/planning/plan-session/prompts/pre-research-thinking.md` — rewrote question (2) from a single run-on line into a numbered list with each gap category on its own bullet; replaced realistic ✓ thought 2 example with pure `<placeholder>` structure showing all 8 bullets as `<applies / does not apply> — <file or tool>. <observation>`; replaced ✓ thought 3 with per-gap staleness check for every APPLIES gap (not a single winner); updated ✗ to reflect actual failure mode (skips sweep, no file citations, vague summary)
- `files/planning/plan-session/prompts/research-brief.md` — rewrote sequential-thinking ✓ example to show gap inventory → type mapping (A: syntax/API, B: compatibility, C: operational constraints) → one typed question per gap, all as `<placeholder>` structure; added explicit note that type C gaps won't surface unless asked directly; replaced ✗ with single lazy thought that passes gaps through unchanged; changed instruction from "which gaps are worth external research" to "for every gap marked APPLIES… do not drop any"; added ✓/✗ examples of good vs bad `{{RESEARCH_GAPS}}` fill content showing structure (specific tool named, specific question) vs undifferentiated blob
- `files/planning/plan-session/prompts/scout.md` — added explicit step (2) to read every top-level file before recursing into directories; top-level manifests, lock files, and config files are now always read; renumbered subsequent steps
- `files/planning/plan-session/prompts/scout-think.md` — replaced realistic ✓ example with `<placeholder>` structure; thought 2 question template now asks about current structure AND what it implies for the change (existing patterns to extend, constraints, interoperation between areas); added ✗ question fill example showing flat inventory question as the anti-pattern

- `files/planning/plan-session/prompts/scout.md` — reverted to single-tool `["task"]` todo; orientation scout only; replaced verbose ✓/✗ examples with `##`-header structured ✓ using `<placeholder>` dummy content and a comically bad ✗ file-dump to reduce token cost while preserving format signal
- `files/planning/plan-session/prompts/scout-think.md` — new node; `["sequential-thinking_sequentialthinking"]` todo only; contains area-selection and question-formulation reasoning step extracted from `scout-parallel`
- `files/planning/plan-session/prompts/scout-parallel.md` — removed sequential-thinking step; node now receives area+question from `scout-think` and dispatches scouts only; todo reduced to `["task", "task"]`; replaced verbose ✓/✗ examples with `##`-header structured ✓ using `<placeholder>` dummy content and a comically bad ✗ file-dump
- `files/planning/plan-session/prompts/git-context.md` — replaced verbose realistic ✓/✗ examples with `##`-header structured ✓ using `<placeholder>` dummy content and a comically bad ✗ one-paragraph dump; aligned return format spec to use `##` headers matching the example; restructured investigation steps into two mandatory phases: Step 1 (three fixed baseline commands) and Step 2 (at least 3 required targeted follow-up commands with example patterns); previously "use your judgment" was a permission small models treated as optional — now Step 2 is a hard requirement
- `files/planning/plan-session/prompts/research-brief.md` — replaced verbose realistic ✓/✗ examples in the subagent dispatch template with `##`-header structured ✓ using `<placeholder>` dummy content and a comically bad ✗ one-liner; aligned return format spec to use `##` headers matching the example
- `files/planning/plan-session/plan.json` — inserted `scout-think` node between `scout` and `scout-parallel`; each node now has a single tool type in its todo list, preventing small models from skipping the reasoning step when todo mixes tool types
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — replaced prose `**bold:**` return format spec with `##`-header structured ✓/✗ examples (`Files opened` / `Findings` with line citations / `Direct answer` / `Changes required` / `Notable risks or gaps`) and a comically bad ✗ file-dump; both Scout 1 and Scout 2 templates updated identically
- `files/planning/plan-session/node-library/analyze-deep/prompt-template.md` — replaced prose "Return a structured report with file:line citations" spec with `##`-header structured ✓/✗ examples (`Analysis question` / `Evidence` with line citations / `Answer` / `Implications`) and a comically bad ✗ vague-prose dump
- `files/planning/plan-session/node-library/research-basic/prompt-template.md` — replaced prose "Return a flat bulleted list" spec with `##`-header structured ✓/✗ examples (`Question` / `Findings` with exact values and sources / `Direct answer`) and a comically bad ✗ vague one-liner
- `files/planning/plan-session/node-library/research-deep/prompt-template.md` — replaced prose "Return a structured report with sections: Summary, Key Findings, Sources" spec with `##`-header structured ✓/✗ examples (`Topic` / `Key findings` table with version+confidence / `Sources` / `Recommendation`) and a comically bad ✗ no-table no-sources dump

### Fixed

- `files/planning/plan-session/prompts/scout-parallel.md` — split file-selection into enumerate→wide-net→read phases: scouts now (1) write out the complete file inventory with no filtering, (2) mark every file with any plausible connection to the area (explicit "when in doubt include it" + "do not exclude based on assumptions"), (3) read every marked file before determining relevance; prevents models from filtering by filename assumptions before reading
- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md` — rewrote scout template internals to match: removed `{{SCOUT_N_FILES}}` pre-specified path slots entirely; scouts now self-direct file discovery using the enumerate→wide-net→read pattern; added full return format (Files opened / Findings with line citations / Direct answer / Changes required / Notable risks); added ✓/✗ behavioral examples; each scout template now accepts area + investigation question only
- `files/planning/plan-session/node-library/scout-parallel/README.md` — retired path-anchored scoping model (planning agent pre-specifying file paths before scouts run); rewritten around area+question model; updated must-resolve checklist, failure modes, and customization guide to match
- `files/planning/plan-session/prompts/git-context.md` — replaced fixed-commands-return-raw-output model with targeted investigation model: starts with baseline commands (log -20, log --all --graph, status) then instructs the subagent to run targeted searches based on what the task involves; return format changed to 5-section interpreted assessment (Repository overview / Relevant history / Files with relevant history / Prior art / Assessment); rich ✓/✗ examples showing commit hashes, branch detail, line citations vs. no hashes, no citations, generic restatement

- `files/planning/plan-session/prompts/scout.md` — replaced "explore as needed" with explicit recursive traversal instruction (read `.` → read every directory recursively, skipping .opencode/.git/node_modules/ → answer all 8 questions from what was read); added ✓/✗ behavioral examples showing rich structured output (file citations, bold sub-labels, explicit "Not found" for absent items) vs. vague assumption-based answers; added Outcome line
- `files/planning/plan-session/prompts/scout-parallel.md` — expanded subagent template step sequence to recursive traversal; strengthened step (3) to require listing ALL potentially relevant files before reading any (entry point + supporting configs, lock files, preset files, env configs); expanded return format to include **Changes required** table; replaced terse ✓/✗ examples with full-fidelity examples matching the richness of real scout output — ✓ shows multi-section findings with quoted line numbers, thorough direct answer, concrete change table, and honest risk assessment; ✗ shows the actual small-model failure mode (reads one obvious file, quotes nothing, gives generic non-answer)
- `files/planning/plan-session/prompts/research-brief.md` — replaced flat bullet return format with per-gap structured format (Gap / Finding / Source / Implication); added ✓/✗ examples showing source-anchored findings with implication vs. vague findings with no source; added conditional Outcome line
- `files/planning/plan-session/prompts/git-context.md` — replaced fragile `git diff --stat HEAD~3..HEAD` (fails on repos with <3 commits) with `git log --oneline -5 --diff-filter=M`; added ✓/✗ examples showing raw verbatim output vs. summarized interpretation; made Outcome conditional (PASS with output / FAIL with error)
- `files/planning/plan-session/prompts/write-dag.md` — added ✓/✗ behavioral examples to the DAG verifier subagent template showing specific per-node checklist output with issues found and fixed vs. vague "looks correct" non-answers

- `files/planning/plan-session/prompts/session-overview.md` — replaced empty entry node with a role-definition contract: planning agent is told it is designing an execution plan, its job is to build the scaffold (not solve the problem), and it must follow planning instructions exactly without inferring its own approach
- `files/planning/plan-session/prompts/sequential-thinking.md` — reinforced scaffold-not-solve framing at step (3): each node should give the executing agent the right tools and context to make execution decisions, not pre-answer those decisions during planning
- `files/planning/plan-session/prompts/clarifying-questions.md` — added mandatory step (1) to output a prose summary of the model's current understanding before calling `question`; prevents the model from asking questions without first surfacing what it has understood

- `files/planning/plan-session/node-library/scout-parallel/prompt-template.md`, `analyze-deep/prompt-template.md`, `research-basic/prompt-template.md`, `research-deep/prompt-template.md` — added subagent declaration to all dispatch templates: "You are a subagent. The primary agent is executing a task and has delegated this work to you. Do not ask the user questions."
- `files/planning/plan-session/node-library/parallel-tasks/prompt-template.md` — added Zone 3 constraint requiring every freeform task prompt to open with the subagent declaration
- `files/planning/plan-session/prompts/scout-parallel.md`, `research-brief.md` — added subagent declaration to dispatch templates with planning-context framing ("primary agent is planning a solution")
- `files/planning/plan-session/prompts/scout-parallel.md` — removed domain-specific "source files / build files" framing and replaced with fully generalized two-angle investigation; HW now decides what angles are relevant for the actual task and project, derives specific file paths from Scout 1 output, and writes targeted prompts — scouts receive concrete file lists and specific questions rather than raw directory dumps to re-interpret
- `files/planning/plan-session/prompts/sequential-thinking.md` — removed forward reference to propose-plan node; item (6) now states "do not output anything to the user — this step is purely internal reasoning"
- `files/planning/plan-session/prompts/clarifying-questions.md` — removed forward reference to propose-plan node; reframed to ask only about gaps in understanding the user's goal, not plan decisions; enforces `question` tool usage; removed trailing prose instruction referencing next steps
- `files/planning/plan-session/prompts/propose-plan.md` — fixed plan presentation order: HW now outputs the full plan as raw prose (scope, constraints, ASCII diagram, node decomposition table, open questions) before calling `question`; previously HW was embedding plan content inside the question field which produced degraded output
- `files/planning/plan-session/prompts/write-dag.md` — added explicit subagent-mode declaration and hard prohibition on `plan_session`, `activate_plan`, and `next_step` calls; added concrete plan.json schema example and Write-tool-only instruction to prevent the subagent from activating a new planning session instead of writing files directly
- `files/planning/plan-session/prompts/git-context.md` — added explicit subagent-mode declaration to dispatch template; the task context slot is now labeled "reference only" to prevent the subagent from treating it as an active directive and asking the user questions; added forbidden-tools list (`plan_session`, `activate_plan`, `next_step`)
- `files/planning/plan-session/node-library/verification-check/prompt-template.md` — added subagent-mode declaration and forbidden-tools list to dispatch template to prevent HW subagent from activating a new planning session or advancing the DAG
- All 13 planning session prompts (excluding terminal `plan-complete.md` and action-only `activate-now.md`) — prepended planning agent role definition contract to every prompt so small models don't lose role context between nodes; role text explicitly frames the output as a "script for action, not a framework for more deliberation" to prevent meta-plan generation
- `files/planning/plan-session/prompts/research-gate.md` — added explicit two-separate-calls instruction and `✓`/`✗` schema example showing the required `question` string field; prevents batching both research-gate questions into one call and prevents schema errors from omitting the required field
- `files/planning/plan-session/prompts/clarifying-questions.md` — added `✓`/`✗` schema example for `question` tool; added "one `questions` array entry per distinct question" constraint
- `files/planning/plan-session/prompts/sequential-thinking.md` — replaced step (3) scaffold framing with full meta-plan anti-drift enforcement: perspective shift (executing agent arrives with zero context), concrete `✗`/`✓` example contrasting a meta-plan with an action plan, and justify-every-scout rule (every scout/research node must answer one specific decision question — if it cannot, cut the node)
- `files/planning/plan-session/prompts/pre-research-thinking.md`, `sequential-thinking.md`, `files/planning/plan-session/node-library/sequential-thinking/prompt-template.md` — added constraint that `revisesThought` and `branchFromThought` values must be ≥ 1 (never 0); prevents schema validation errors from small models passing 0 for these fields
- `files/planning/plan-session/prompts/activate-now.md` — reformatted to standard prompt structure: removed H2 section headers (R4), replaced prose sections with single blockquote, added `✓`/`✗` slot-fill example for plan name
- All 13 node library prompt templates — prepended execution agent role definition contract as the first line of every template so executing agents don't drift into scouting or re-planning; removed old Zone 3 "The DAG controls sequencing" text from `session-overview/prompt-template.md` (superseded by role at top)
- `files/planning/plan-session/prompts/write-dag.md` — fixed reference paths: replaced `{{PLAN_NAME}}` with `{{SESSION_PATH}}` for dag-design-guide.md and CATALOGUE.md reads inside the subagent dispatch template; `{{PLAN_NAME}}` is the output plan name only, `{{SESSION_PATH}}` is the planning session's own reference material
- `files/planning/plan-session/prompts/sequential-thinking.md` — restored rich reasoning content: thought-count guidance (5–8 focused / 12–18 multi-phase), inline todo validation detail (specific invalid tool names, compression node guidance), research integration step, and complete output format spec (scope + constraints + ASCII diagram + node decomposition table with exact todo arrays + open questions)
- `files/planning/plan-session/prompts/pre-research-thinking.md` — restored 8 specific reasoning questions with decision logic inline; added tool note (exempt from DAG blocking); blockquote now specifies 3-verdict output format exactly and enforces one-thought-per-call sequencing
- `files/planning/plan-session/prompts/scout-parallel.md` — tightened file path enforcement: scouts must only include paths confirmed in Scout 1's output; explicit prohibition on inferring or guessing paths prevents hallucinated file references
- `files/planning/plan-session/prompts/scout-parallel.md` — redesigned parallel scouts from file-fetcher to freeform investigator model: removed `{{FILES}}` slot and file-list injection entirely; scouts now receive a user task + one sharp investigation question and explore the codebase freely using glob and read; primary is instructed to identify gaps Scout 1 cannot answer (not confirm knowns) and formulate one expert investigation question per scout
- `files/planning/plan-session/prompts/scout.md` — added `sequential-thinking_sequentialthinking` todo after Scout 1 task returns; reasoning step processes Scout 1's output to identify what systems are responsible for the user's concern and the two most important unknowns — so investigation questions at scout-parallel are grounded in this project's actual structure, not generic pattern-matching; updated `plan.json` scout node todo array to match
- `files/planning/plan-session/prompts/pre-research-thinking.md`, `sequential-thinking.md`, `files/planning/plan-session/node-library/sequential-thinking/prompt-template.md` — replaced "must be ≥ 1" constraint on optional seq-thinking fields with omit-unless-using instruction and ✓/✗ inline example; prevents small models from passing `revisesThought: 0` / `branchFromThought: 0` which triggers schema validation errors
- `files/planning/plan-session/prompts/sequential-thinking.md` — added `"read"` as first todo to re-read CATALOGUE.md before reasoning; updated `plan.json` todo arrays for `sequential-thinking` and `sequential-thinking-2` nodes to match
- `files/planning/plan-session/prompts/research-brief.md` — added `sequential-thinking_sequentialthinking` as first todo to sharpen research scope before dispatch; model now reasons which gaps are worth external research and refines the brief before handing off to ExternalScout; updated `plan.json` `research-brief` node todo array to match
- `files/planning/plan-session/prompts/clarifying-questions.md` — added `sequential-thinking_sequentialthinking` as first todo to reason through knowns vs genuine gaps before surfacing questions to the user; prevents superficial questions about already-settled decisions; updated `plan.json` `clarifying-questions` and `clarifying-questions-2` node todo arrays to match
- `files/planning/plan-session/prompts/propose-plan.md` — added `sequential-thinking_sequentialthinking` as first todo for self-check before presenting; model now verifies plan coverage, agent correctness, and branch conditions before outputting the proposal; updated `plan.json` all `propose-plan-*` node todo arrays to match
- `files/planning/plan-session/prompts/scout.md`, `scout-parallel.md` — moved `sequential-thinking_sequentialthinking` from the end of `scout.md` to the start of `scout-parallel.md`; reasoning now runs with Scout 1's full output in context before formulating investigation questions, which is strictly better than reasoning before Scout 1 runs; `scout.md` todo simplified to `["task"]`, `scout-parallel.md` todo updated to `["sequential-thinking_sequentialthinking", "task", "task"]`; prose instructions in `scout-parallel.md` replaced by the seq-thinking step which now drives gap identification and question formulation directly
- `files/planning/plan-session/prompts/scout-parallel.md`, `research-brief.md`, `pre-research-thinking.md`, `sequential-thinking.md`, `clarifying-questions.md`, `propose-plan.md` — replaced terse prose "thought quality" examples with full `✓`/`✗` call sequences; ✓ shows 3–4 concrete thought calls that reason from actual file evidence to specific conclusions; ✗ shows a single call that names categories without grounding reasoning in what scouts found; removed all pixi/cmake project-specific references from examples and replaced with a generic auth-feature scenario applicable to any project
- `files/planning/plan-session/prompts/scout.md` — redesigned as a fixed-question project orientation pass: Scout 1 subagent now answers 8 structured questions (language/runtime, directory structure, entry points, build system, package manager, test framework, CI/CD, deployment) with file citations; zero task-specific focus — pure project map for implicit context grounding
- `files/planning/plan-session/prompts/scout-parallel.md` — redesigned seq-thinking step to reason from the task to conceptual areas (not from Scout 1's file list to specific files); primary picks 2 areas from a fixed list (build system, dependency management, platform targeting, CI/CD, test infrastructure, config system, data layer, API surface, auth surface, deployment config) and formulates one investigation question per area; subagent template instructs scouts to discover relevant files via glob rather than assume by area name; ✗ example shows the file-name fixation anti-pattern explicitly


### Changed

- `files/plugins/planning-enforcement.ts`: re-added `experimental.chat.system.transform` hook to inject DAG executor continuation instructions into the system prompt when a session is active; hardened "todos complete" message to imperative "Call `next_step()` now."; hardened mid-sequence remaining-todos message from "Next expected: X" to "Call `X` now." — addresses small-model stalling at node boundaries and between sequential tool calls
- `files/agents/headwrench.md`: hardened DAG Executor Mode section — every tool result is now described as a trigger for the next tool call; explicit statement that the `question` tool is the only legitimate pause; removed permissive language
- Rewrite of all 6 agent files from first principles targeting Qwen3-14B as minimum-capability model: `files/agents/headwrench.md`, `files/agents/context-scout.md`, `files/agents/context-insurgent.md`, `files/agents/junior-dev.md`, `files/agents/external-scout.md`, `files/agents/quick-doc.md` — removed H2/H3 section headers, capped lists at ≤6 items, removed code-block tool call syntax examples, reframed constraints to positive framing; removed `steps` field from all agents except `context-scout.md` (updated to `steps: 50`)
- `files/plugins/planning-enforcement.ts`: removed `experimental.chat.system.transform` hook that injected `[DAG_ACTIVE]` marker into system prompt
- `files/plugins/planning-enforcement.ts`: softened `next_step` enforcement message to allow exempt tools (question, compress, sequential-thinking_sequentialthinking) before advancing
- Replaced all language/framework/domain-specific examples in node-library prompt-templates with stack-agnostic equivalents; affected files: `analyze-deep/prompt-template.md`, `compression-node/prompt-template.md`, `generic/prompt-template.md`, `parallel-tasks/prompt-template.md`, `research-basic/prompt-template.md`, `scout-parallel/prompt-template.md`, `sequential-thinking/prompt-template.md`, `verification-check/prompt-template.md` (replaced C++/TypeScript/npm/bun references with generic Python/Go/make examples that work across any stack)
- All 14 planning session prompts rewritten from first principles for non-thinking Qwen3-14B compliance: action-first openers (R1), no numbered prose steps (R2), `next_step()` last line only (R3), no H2/H3 section headers (R4), dispatch blockquote immediately after todo (R5), output constraint last in every blockquote (R6), ≤6 items per list (R7), glob examples in all scout dispatches (R8), routing by exact node IDs (R9), scope restrictions in blockquote (R10), no "After X returns" sections (R12), no `task_id` in blockquotes (R13), plain reasoning instructions for sequential-thinking nodes (R16/R16b)
- All 14 node-library prompt-templates rewritten from first principles applying the same 16-rule set; reduced combined line count by ~1000 lines; two-audience Zone 1/2/3 structure preserved with `{{PLACEHOLDER}}` + adjacent `✓`/`✗` examples (R14)

### Fixed

- `files/profiles/ollama/opencode.jsonc` — added `reasoningEffort: "none"` to disable Qwen3 thinking mode on Ollama's OpenAI-compatible `/v1/chat/completions` endpoint (the native `think: false` field is silently ignored on `/v1`); prevents ~60% tool-execution failure rate caused by reasoning models satisfying tool calls internally without emitting them; non-thinking-capable models silently ignore this setting
- `README.md` — updated local model guidance to reflect Qwen3 14B as minimum-supported target and document the thinking-mode fix
- `files/plugins/planning-enforcement.ts` — replaced all hedging language in injected messages with directive language; todo-completion message now reads "You MUST call `next_step()` right now"
- `files/planning/plan-session/node-library/parallel-tasks/README.md` — added concrete-goals constraint to authoring guidance
- `files/planning/plan-session/node-library/decision-gate/README.md` — fixed branch routing docs; added nodeId-vs-when-string example



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
