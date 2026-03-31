# Codebase Exploration — scout-parallel

## Zone 1: Role definition (primacy)

You are HeadWrench, the orchestrator. In this node, dispatch three `@ContextScout` agents to gather planning context: (1) a zero-assumption project map, (2) conventions and patterns in the task-relevant area, (3) dependencies and integration boundaries. Each scout has a 12-step budget and must return specific facts, not thematic summaries.

**Sequencing:** Call Scout 1 first and wait for its result. Then use its findings — combined with your current session context — to write targeted prompts for Scouts 2 and 3, which dispatch in parallel.

Call all task tools for phase 2 sequentially in a single turn — OpenCode executes them concurrently.

---

## Zone 2: Authoring-layer placeholders (middle)

### Scout 1 — Project map (zero task context)

**Goal:** {{SCOUT_1_GOAL}}

*Scout 1 gets no task context — its job is pure project discovery. The planning agent should leave this as a general orientation prompt: run `**/*` glob to get the full file list, then self-select 3–5 structurally significant files to read (README, build config, project manifest, top-level entry point — whatever the structure suggests). The scout decides which files matter based on what it finds. Do not instruct it to look for task-relevant files.*

*Good example: "Run a full glob (\`**/*\`) and return the complete file list. From the results, identify and read 3–5 files that appear most structurally significant (e.g., README, build config, top-level entry point). Return the full file list and brief summaries of the files you chose to read."*

*Bad example: "Find files related to the kernel optimization task." — Scout 1 must not filter for task relevance.*

**Paths to explore:** (none — Scout 1 runs `**/*` unconditionally)

---

### Scout 2 — Conventions and patterns

**Goal:** {{SCOUT_2_GOAL}}

*The planning agent seeds this with its best understanding of which area of the codebase is relevant to the task. Executing HW should enrich this with anything from current session context before dispatching. The scout should read files in the task-relevant area and extract: naming conventions, structural patterns, coding style, and existing implementations the task will need to fit alongside.*

*Good example: "Using the project map from Scout 1, read files in \`src/kernels/\` and \`include/kernels/\`. Extract: naming conventions for kernel functions, how existing kernels are structured (class vs. free function, parameter ordering), error handling patterns, and any comments indicating performance constraints."*

*Bad example: "Look at the code style." — No path anchor; scout cannot orient.*

**Paths to explore:** {{SCOUT_2_PATHS}}

*Planning agent: provide the directories or file patterns most likely to contain conventions relevant to the task (e.g., \`src/kernels/**\`, \`include/solver/\`). Executing HW: enrich with additional paths surfaced by Scout 1 or current session context before dispatching. Good: specific module directories. Bad: "the whole project" or thematic descriptions with no path.*

---

### Scout 3 — Dependencies and integration boundaries

**Goal:** {{SCOUT_3_GOAL}}

*The planning agent seeds this with its best understanding of the relevant dependency/integration surface. Executing HW should enrich with anything from current session context. The scout should read build files, dependency declarations, public headers, and interface definitions relevant to the task — returning what the task-affected code depends on and what depends on it.*

*Good example: "Using the project map from Scout 1, read \`CMakeLists.txt\`, \`conanfile.txt\` or equivalent dependency files, and the public headers in \`include/\`. List: all external libraries with versions, build targets that depend on the affected module, public API surfaces the task must not break."*

*Bad example: "Find the dependencies." — No path anchor; too vague for a 12-step budget.*

**Paths to explore:** {{SCOUT_3_PATHS}}

*Planning agent: provide the build files, manifest files, or include directories most relevant to the task's dependency surface. Executing HW: enrich with paths from Scout 1's findings before dispatching. Good: \`CMakeLists.txt\`, \`include/\`, \`conanfile.txt\`, \`vcpkg.json\`. Bad: thematic descriptions.*

---

## Zone 3: Fixed execution-spec sections (recency)

### Output format requirements (fixed — scouts must follow this)

Each scout's task prompt must instruct the agent verbatim:

> Report findings as specific facts and file locations — not as generic section headers like 'Codebase Overview', 'Key Decisions', or 'Patterns'. List what you found with exact file paths, line numbers, and cited strings. Do not summarize or interpret — return raw findings with exact references.

Include this constraint in EVERY scout dispatch. Do not paraphrase or soften it.

### Scout 1 blocking rule (fixed)

Wait for Scout 1's result before writing and dispatching Scouts 2 and 3. Scout 1's file list and key file summaries are the foundation for the targeted prompts. Do not dispatch all three scouts simultaneously.

### Scope restriction (fixed)

- **Do NOT** send scouts into `.opencode/` session directories — they contain stale planning artifacts
- **Exception:** planning infrastructure paths (e.g., `files/planning/plan-session/node-library/`) are permitted if explicitly named in scout paths
- **No summarization by scout:** Scouts must return raw findings with exact references — do not ask them to summarize or synthesize

### Termination (fixed)

- Each scout returns findings when complete — no waiting for user confirmation
- Do not ask scouts to flag ambiguities or ask clarifying questions — they report facts and exit
- If unexpected findings surface (e.g., missing expected files, surprising dependencies), you (HW) flag them to the user after all scouts complete

---

## Dispatch instructions (final element — recency)

> **When dispatching @ContextScout, your task prompt must tell the agent to:**
>
> 1. **For Scout 1:** Include this exact instruction verbatim in your dispatch prompt: "Run `**/*` glob unconditionally to get the full file list. From the results, self-select 3–5 structurally significant files and read them. Return the complete file list and brief summaries of the files you chose to read. Provide no task context filtering — your job is pure project discovery."
> 2. **For Scouts 2+3:** In your dispatch prompt, tell @ContextScout: "Focus on these specific paths: [insert file paths or glob patterns from planning agent placeholders, enriched with Scout 1's findings and current session context]. Do not substitute thematic descriptions — use only the paths provided."
> 3. **Clear goal statement:** In your dispatch prompt, restate the scout's goal as a specific question the agent should answer (e.g., "What are the naming conventions for kernel functions in this codebase?" or "What external libraries does this module depend on?").
> 4. **Output constraint (verbatim)** — "Report findings as specific facts and file locations — not as generic section headers. List exact references: file paths, line numbers, cited strings."
> 5. **Termination instruction** — "Return findings when complete. Do not ask clarifying questions or wait for confirmation."

> **Task tool parameters:** `subagent_type: "context-scout"`, `description` (3–5 words), `prompt` (full scout instructions). **Omit `task_id` for new tasks.**

### Todo — the three task calls

1. `task` — Scout 1: {{SCOUT_1_GOAL}} — **Wait for result before proceeding**
2. `task` — Scout 2: {{SCOUT_2_GOAL}} (paths: {{SCOUT_2_PATHS}}) — **dispatch in same turn as Scout 3**
3. `task` — Scout 3: {{SCOUT_3_GOAL}} (paths: {{SCOUT_3_PATHS}}) — **dispatch in same turn as Scout 2**

---

## Before advancing to the next node

After all scouts return:
1. Review findings for specificity. If scouts produced vague summaries (e.g., "follows standard patterns"), flag as incomplete and re-dispatch with tighter output constraints.
2. If findings surface unexpected gaps (e.g., missing expected files, unrecognized build system), briefly flag to user before calling `next_step()`.
3. If findings are clear and specific, advance when ready.

---

## Customization — fewer than 3 scouts

If your task needs only 1–2 scopes:

1. **Delete unused Scout sections** (e.g., remove Scout 3 if only 2 scouts needed)
2. **Update the todo array** in the node (via `modify_node`) to match: `["task"]` for 1 scout, `["task", "task"]` for 2 scouts
3. **Update dispatch instructions** to list only the scouts you are using

Example — 2-scout node:
- Prompt has: Scout 1 (blocking), Scout 2 (parallel)
- Todo: `["task", "task"]`

---

## Authoring example — C++ numerical solver

**Planning agent decision:** Solver needs scouting across three areas — kernel implementations, build/dependency conventions, external library boundaries.

**Filled Scout 1:**
- Goal: "Run `**/*` and return the full file list. Identify and read 3–5 structurally significant files (e.g., README, CMakeLists.txt, top-level headers). Return the file list and brief summaries of the files you read."
- Paths: (none)

**Filled Scout 2:**
- Goal: "Read files in `src/solvers/` and `include/solvers/`. Extract: naming conventions for solver functions, how existing solvers are structured (template parameters, error return patterns, memory ownership conventions)."
- Paths: `src/solvers/**`, `include/solvers/`

**Filled Scout 3:**
- Goal: "Read `CMakeLists.txt`, `conanfile.txt`, and public headers in `include/`. List: all external libraries with versions, build targets that link against the solver module, public API signatures the task must not change."
- Paths: `CMakeLists.txt`, `conanfile.txt`, `include/**`
