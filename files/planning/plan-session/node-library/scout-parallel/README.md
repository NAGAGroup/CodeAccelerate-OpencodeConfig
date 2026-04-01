# scout-parallel Node Type

## When to use

Use this node type near the start of a DAG when you need broad situational awareness before acting — to understand which files a task will affect, where conventions and architecture rules live, and what external systems your changes might integrate with.

Default configuration covers **three parallel scopes** via three sequential task calls. OpenCode dispatches them concurrently; the plugin enforces todo ordering. Each scout runs independently with a 12-step budget.

**Do NOT use scout-parallel if:**
- Target files are already known from context or a prior scouting step
- The task requires deep multi-file analysis across interconnected systems (use `analyze-deep` instead)
- You need execution-time context that only appears after prior steps complete

**Typical scenario:** First substantive DAG node after entry. Precedes `analyze-deep`, `parallel-tasks`, `write-dag`, or other action nodes.

## What the planning agent must resolve

Before writing this node, determine and fill in these three scout scopes. Each scout must have a **specific, path-anchored goal** — not a thematic description.

### Scout 1 — Affected code

**Decision required:** Which files or directories does this task directly touch or modify? What are the primary code targets?

- **Good input:** `"src/auth/token.ts, src/auth/helpers/*.ts"` or `"packages/cli/commands/*.ts"`
- **Bad input:** `"the authentication system"` — thematic, not path-based; ContextScout cannot resolve and will waste steps on wrong files
- **Associated goal:** Restate the Scout 1 decision as a specific question: `"Find all files under src/auth/ that export public functions; identify which ones handle token refresh."`
- **Example:** "Identify all files under src/auth/ and src/middleware/ that interact with the token system. List exact file paths and what each exports."

### Scout 2 — Patterns and architecture

**Decision required:** Where should scouts look to find conventions, structural rules, architectural decisions, and design patterns this task must respect?

- **Good input:** `"src/patterns/ directory for examples, src/middleware/*.ts for decorator usage, tsconfig.json, package.json"`
- **Bad input:** `"how the codebase is structured"` — vague; name specific directories or config files instead
- **Associated goal:** What structural question should this scout answer? `"Read src/patterns/ and src/**/*.config.ts files; identify naming conventions, module organization, and how public APIs are exported."`
- **Example:** "Read tsconfig.json, package.json, and src/**/*.config.ts files. Report naming conventions, module structure patterns, and how public functions are exported from modules."

### Scout 3 — Dependencies and boundaries

**Decision required:** What external systems, public APIs, or integration points might this task interact with? Where are dependency declarations and interface definitions?

- **Good input:** `"src/api/types.ts, src/db/connection.ts, package.json"`
- **Bad input:** `"integration points"` — name the specific files where those points are defined
- **Associated goal:** What integration question should this scout answer? `"Read package.json, bun.lockb, and all src/api/**/*.ts files; identify external dependencies and which internal modules depend on external systems."`
- **Example:** "Read package.json, bun.lockb, and src/api/ directory. Identify all external dependencies, versions, and which modules import them. List exact import statements."

## Must-resolve checklist (planning agent)

Before writing the node prompt, confirm you have:

- [ ] **Scout 1 paths determined** — specific file paths or globs, not a theme
- [ ] **Scout 1 goal determined** — restate the decision as a question answerable in 12 steps
- [ ] **Scout 2 paths determined** — directories/files containing patterns and conventions
- [ ] **Scout 2 goal determined** — restate as a specific structural/patterns question
- [ ] **Scout 3 paths determined** — files declaring external dependencies and APIs
- [ ] **Scout 3 goal determined** — restate as a specific integration/boundary question
- [ ] **Output constraint embedded in prompt** — "Report findings as specific facts and file locations — not as generic section headers like 'Codebase Overview', 'Key Decisions', or 'Patterns'."
- [ ] **Three `{{PLACEHOLDER}}` slots filled** (one per scout: paths + goal)
- [ ] **Todo array matches scout count** — `["task", "task", "task"]` for 3 scouts; `["task", "task"]` for 2 scouts
- [ ] **Downstream consumer identified** — which node receives these findings?

## Output constraint (must cascade to three places)

This constraint must appear in THREE places in your filled node prompt:
1. ✓ In the "must-resolve checklist" above (you are reading it now)
2. In the fixed **"Output format requirements"** section of the prompt template (fixed section, not a placeholder)
3. In the **dispatch blockquote** at the bottom of the prompt template (as item #3 in each scout's dispatch instructions)

**Constraint text (copy verbatim into all three locations):**
> Report findings as specific facts and file locations — not as generic section headers like 'Codebase Overview', 'Key Decisions', or 'Patterns'.

**Why three places:** ContextScout has only 12 steps per task. Without the constraint appearing in the fixed template sections AND the dispatch blockquote, the planning agent may weaken or omit it, causing scouts to produce vague thematic summaries instead of actionable facts.

## Notes — failure modes and mechanisms

### Failure mode 1: Thematic scout goals without path anchors

**Mechanism:** Planning agent writes `"Scout 1 goal: Understand the authentication system"` instead of anchoring to specific files. Scout tries to interpret a theme, reads scattered modules, consumes the 12-step budget, and produces generic "Overview" sections instead of specific findings.

**Root cause:** Planning agent confused node type name ("scout-parallel") with the goal-setting requirement. Named the area, not the paths or question.

**Fix:** In the must-resolve checklist, verify each scout has:
1. An explicit **file path or glob pattern** (e.g., `src/auth/**`, `src/middleware/verify.ts`)
2. A **specific goal question** that can be answered from those paths (e.g., `"Find all files that call refreshToken and identify the call sites."`)

Rewrite thematic goals into path-based questions.

### Failure mode 2: Todo array count mismatch

**Mechanism:** Planning agent fills 2 scout sections (Scout 1 and Scout 2 only) but leaves todo array as `["task", "task", "task"]`. Plugin advances after 2 tasks; the 3rd task is never called. ContextScout covers only 2 scopes when the plan expected 3, leaving a blind spot.

**Root cause:** Planning agent reduced the number of scouts but forgot to adjust the todo array to match.

**Fix:** Count how many scout sections your plan actually needs. If you have:
- 2 scouts: change todo to `["task", "task"]` and remove Scout 3 section entirely
- 3 scouts: keep todo as `["task", "task", "task"]`
- 4+ scouts: this is non-standard; confirm it is necessary before using more

The todo array length MUST equal the number of scout sections written in the prompt template.

### Failure mode 3: Output constraint not cascaded to all three locations

**Mechanism:** Planning agent states the constraint once in the must-resolve checklist but doesn't embed it into: (a) the fixed "Output format requirements" section of the template, OR (b) the dispatch blockquote. HeadWrench reads the filled prompt, finds no constraint in the execution-spec sections, and dispatches without it. ContextScout produces boilerplate "Codebase Overview" and "Patterns Summary" sections instead of specific facts.

**Root cause:** Planning agent treated the constraint as a checklist item rather than as content that must appear in three distinct, structured places.

**Fix:** Before approving the filled node prompt, search for the constraint text in:
1. The fixed "Output format requirements" section (must appear verbatim, unchanged by the fill)
2. Each dispatch instruction in the blockquote (item #3 for Scout 1, #3 for Scout 2, #3 for Scout 3)

If constraint is missing from ANY of these locations, the filled prompt is incomplete. Return it for correction.

### Failure mode 4: No downstream consumer specified

**Mechanism:** Planning agent fills scout sections but doesn't identify which node receives the findings. When results come in, HW compresses them generically ("Three scouts completed") instead of propagating specific file lists and facts to the next node. Downstream steps have no actual context to work with.

**Root cause:** Planning agent did not complete the "downstream consumer" decision; treated it as optional.

**Fix:** In the checklist, explicitly name the next node. Example: `"Findings feed analyze-deep node, so scouts must return exact file paths and function names."` Then, in the prompt, reference that downstream need. Example dispatch instruction: `"These findings will feed an analyze-deep node, so provide exact file paths and specific strings from code — not summaries."`

## Scope restrictions

- **Do NOT** send scouts into `.opencode/` session directories — they contain stale planning artifacts that conflict with the actual codebase
- **Exception:** Planning infrastructure files under `{{SESSION_PATH}}/node-library/` are permitted if explicitly named in scout paths
- **Step budget:** ContextScout has 12 steps per scout task. Keep questions answerable within that budget. If a scout scope requires more than 12 steps, move it to an `analyze-deep` node instead.

## Customization — fewer than 3 scouts

If your task genuinely needs only 1 or 2 scopes, reduce the node:

1. **Remove unused Scout sections** from the prompt template (e.g., delete Scout 3 entirely)
2. **Update todo array** to match: `["task"]` for 1 scout, `["task", "task"]` for 2 scouts
3. **Update dispatch blockquote** to list only the scouts you are using (e.g., only numbered items 1 and 2 for a 2-scout node)

Example: 2-scout node
- Todo: `["task", "task"]`
- Prompt contains: Scout 1 section, Scout 2 section (Scout 3 deleted)
- Dispatch blockquote: items 1 and 2 (item 3 deleted)

## Downstream consumers

This node typically feeds into:
- `analyze-deep` — deeper investigation of one or more scopes revealed by scouts
- `parallel-tasks` — independent work across multiple modules identified by scouts
- `write-dag` — context for subplan decomposition based on scout findings
- Other planning nodes — where scout outputs anchor further scoping decisions
