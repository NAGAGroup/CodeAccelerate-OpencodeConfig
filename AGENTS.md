# AGENTS.md

Quick-reference guide for AI assistants working on this codebase.

## Project Identity

**CodeAccelerate-OpencodeConfig** is an OCX (OpenCode Components) registry that distributes a
multi-agent development system called **CodeAccelerate** for the [OpenCode](https://opencode.ai/)
platform. Maintained by NAGA Compute Group under the MIT license.

Users install components via the OCX CLI. The registry is built into static JSON assets and
deployed to Cloudflare Workers, Vercel, or Netlify.

## Quick Commands

```bash
bun run build    # Build registry to dist/ (includes plugin compilation; bunx ocx build . --out dist)
bun run dev      # Build + local Cloudflare Workers dev server
bun run deploy   # Build + deploy to Cloudflare Workers
```

**Runtime:** Bun v1.3.5+
**Build tool:** OCX CLI (`bunx ocx build`)
**Current version:** 3.6.0 (see `registry.jsonc`)
**Min compatibility:** OpenCode 1.27.0, OCX CLI 1.0.16

## Repository Structure

```
├── registry.jsonc          # Registry manifest — single source of truth for components
├── files/                  # Source files for all registry components
│   ├── agents/             # 6 agent definitions (Markdown with YAML frontmatter)
│   ├── commands/           # 2 slash commands (plan-session, activate-plan)
│   ├── planning/           # DAG-driven planning scaffolds
│   │   ├── plan-session/   # The only shipped planning mode
│   │   │   ├── plan.json   # Executable DAG
│   │   │   ├── prompts/    # One .md file per node (11 files)
│   │   │   └── node-library/ # Reusable node type templates (14 node types)
│   │   └── reference/      # dag-design-guide.md — schema spec and authoring guide
│   ├── plugins/            # planning-enforcement.ts (+ compiled .js bundle)
│   ├── profiles/           # 6 profile configs (opencode.jsonc + ocx.jsonc each)
│   └── skills/             # 1 skill (hello-world)
├── docs/                   # User-facing documentation
├── scripts/                # update-profiles.sh
├── dist/                   # Build output (gitignored)
├── AGENTS.md               # This file — AI assistant reference
├── CHANGELOG.md            # Release history
├── package.json            # Build scripts only, no runtime deps
├── wrangler.jsonc          # Cloudflare Workers config
├── vercel.json             # Vercel deployment config
└── netlify.toml            # Netlify deployment config
```

## Component Architecture

The registry ships **8 components** defined in `registry.jsonc`:

| Component | Type | Purpose |
|-----------|------|---------|
| `ocx-tools` | tool | Planning scaffolds + node library + planning-enforcement plugin |
| `ocx-bundle` | bundle | All agents, commands, and skills (depends on ocx-tools) |
| `ocx-default` | profile | Anthropic API profile (sonnet-4-6 + haiku-4-5) |
| `ocx-copilot` | profile | GitHub Copilot profile |
| `ocx-haiku` | profile | All-haiku Anthropic profile |
| `ocx-haiku-copilot` | profile | All-haiku GitHub Copilot profile |
| `ocx-free` | profile | OpenCode Zen free-tier profile |
| `ocx-ollama` | profile | Local Ollama profile (run `ollama cp <model> opencode-model` to set model) |

All profiles depend on `ocx-bundle`, which depends on `ocx-tools`.

## Agent System

One orchestrator routes to five specialists:

| Agent | Model tier | Role | Parallel? |
|-------|-----------|------|-----------|
| **headwrench** | sonnet | Primary orchestrator, planning, delegation | N/A |
| **context-scout** | haiku | Quick codebase reads (step budget: 12) | Yes |
| **context-insurgent** | sonnet | Deep multi-file reasoning (step budget: 20) | No |
| **junior-dev** | haiku | Targeted code edits (step budget: 10) | Yes |
| **external-scout** | haiku | Web and documentation research via MCP (step budget: 15) | Yes |
| **quick-doc** | haiku | Single-file document writes (step budget: 8) | Yes |

Users interact only with HeadWrench. It reads intent and delegates to specialists.

## Planning System

One DAG-driven planning mode ships: **plan-session**, triggered by `/plan-session`.

The `plan-session` DAG lives in `files/planning/plan-session/` and follows this flow:

```
session-overview → scout → scout-node-library → research-gate
  → [research-brief → sequential-thinking → clarifying-questions → propose-plan
        → [write-dag → activation-gate]              (approved path)
        → [propose-plan-2 → write-dag-2 → activation-gate-2]]  (rethink path)
  → [sequential-thinking-2 → clarifying-questions-2 → propose-plan-3
        → [write-dag-3 → activation-gate-3]            (approved path)
        → [propose-plan-4 → write-dag-4 → activation-gate-4]]  (rethink path)
  (all paths) → [activate-now → plan-complete]  (activate now path)
         → [plan-complete-2]               (activate later path)
```

| Node | Todo | Purpose |
|------|------|---------|
| `session-overview` | `[]` | Entry, auto-advance |
| `scout` | `["task","task","task","task"]` | 3x @ContextScout in parallel, plus 4th task dispatches HeadWrench as subagent for git context |
| `scout-node-library` | `["task"]` | @ContextScout reads node library (pure info-gathering) before the research gate |
| `research-gate` | `["question", "question"]` | HW assesses context, forms recommendations, then asks two questions: (1) is cursory planning-time research needed? (2) should the generated DAG include execution-time research nodes? |
| `research-brief` | `["question", "task"]` | User picks research topic; ExternalScout does a cursory lookup |
| `sequential-thinking` | `["sequential-thinking_sequentialthinking"]` | HW designs complete plan with full context (Branch A: with research) |
| `clarifying-questions` | `["question"]` | HW summarizes understanding and asks any last-minute clarifying questions before plan presentation (Branch A: with research) |
| `sequential-thinking-2` | `["sequential-thinking_sequentialthinking"]` | HW designs complete plan with full context (Branch B: no research) |
| `clarifying-questions-2` | `["question"]` | Same as clarifying-questions (Branch B: no research) |
| `propose-plan` | `["question"]` | HW presents complete plan (structure + decomposition), user approves |
| `write-dag` | `["task","validate_dag","task"]` | HW subagent writes plan files (reads node library docs first), validate, verify |
| `activation-gate` | `["question"]` | Ask user: activate now or later? |
| `activate-now` | `[]` | HW calls `activate_plan`, then calls `next_step()` to advance to `plan-complete` (terminal) |
| `plan-complete` | `[]` | Terminal: informs user the plan is written and how to activate |

The `planning-enforcement` plugin manages DAG state, enforces todo ordering, and blocks
off-sequence tool calls at runtime. Enforcement applies to ALL agents in the session — not only HeadWrench. The `PRIMARY_AGENT` constant is defined in the plugin source but is unused; every agent's tool calls are subject to todo enforcement.

**Exempt tools** (never blocked by DAG enforcement, regardless of current todo): `plan_session`, `activate_plan`, `next_step`, `recover_context`, `question`, `exit_plan`, `validate_dag`, `todowrite`, `sequential-thinking_sequentialthinking`. Note: the last tool uses an underscore between the two halves of the name — any typo causes a permanent block.

### Node Library

`files/planning/plan-session/node-library/` contains reusable node type templates that planning
agents select from when composing project DAGs. Each node type has three files:

- `plan.json` — fixed id, prompt filename, todo array
- `README.md` — when to use it, what the planning agent must resolve before writing it
- `prompt-template.md` — scaffold with section headers the agent fills in

**14 node types:**

| Node type | Todo | Notes |
|-----------|------|-------|
| `session-overview` | `[]` | Entry, auto-advance |
| `scout-parallel` | `["task","task","task"]` | 3x @ContextScout |
| `analyze-deep` | `["task"]` | @ContextInsurgent, serial |
| `sequential-thinking` | `["sequential-thinking_sequentialthinking"]` | HW reasons directly |
| `decision-gate` | `["question"]` | User branch |
| `parallel-tasks` | `["task","task","task"]` | Parallel haiku agents |
| `verification-check` | `["task"]` | @HeadWrench subagent, shell access |
| `conditional-branch` | `[]` | HW calls `next_step` from prior context |
| `compression-node` | `["compress"]` | HW calls compress tool directly (DCP plugin) |
| `output-success` | `[]` | Terminal, happy path |
| `output-failure` | `[]` | Terminal, failure path |
| `research-basic` | `["task"]` | Targeted external lookup via @ExternalScout |
| `research-deep` | `["task"]` | Intensive investigative research via @ExternalScout |
| `generic` | flexible | Escape hatch, custom todo |

Node ID conventions: repeated nodes use `-<N>` suffix (e.g. `test-2`, `fix-3`). DAG is a
tree — nodes cannot be shared across branches; each branch needs its own terminal instance.
**Every node id must be globally unique within the DAG tree.** Reusing an id (e.g. for a
loop-back) silently overwrites the node_map entry and causes the node to behave as a terminal,
ending the session prematurely. The plugin now throws a validation error on duplicate ids.

**Branch routing uses node-ID matching, not `when`-string matching.** When HeadWrench calls `next_step({ next: "<node-id>" })` at a branching node, the plugin resolves the branch by comparing the `next` value against each branch's `nodeId` — not against the human-readable `when` string. The `when` field exists only for display purposes (shown in the branch-choice prompt and in `recover_context()` output). Always pass the exact child node's `id` value — not the `when` description — when routing a branch.

## Key Files

| File | Purpose |
|------|---------|
| `registry.jsonc` | Component definitions — edit when adding/removing/modifying components |
| `files/agents/headwrench.md` | Primary orchestrator prompt |
| `files/plugins/planning-enforcement.ts` | Plugin source — auto-compiled to `.js` during `bun run build`, do not manually edit |
| `files/planning/plan-session/plan.json` | The executable planning DAG |
| `files/planning/plan-session/node-library/CATALOGUE.md` | Node type reference |
| `files/planning/reference/dag-design-guide.md` | DAG schema spec and authoring rules |
| `files/profiles/default/opencode.jsonc` | Reference profile: model assignments, MCP setup |

## Development Workflow

### Adding a new component

1. Create source file(s) under `files/` following the naming conventions below
2. Add the component entry to `registry.jsonc` with name, type, description, and files array
3. If it belongs in the bundle, add it to `ocx-bundle`'s files array
4. Run `bun run build` and verify the component appears in `dist/index.json`

### Modifying an agent

1. Edit the Markdown file in `files/agents/`
2. Agent files use YAML frontmatter for metadata (description, mode, steps, color, permission)
3. The prompt body follows standard Markdown

### Modifying the planning DAG

- **Node/edge structure** → edit `files/planning/plan-session/plan.json`
- **Prompt content** → edit files in `files/planning/plan-session/prompts/`
- **New prompt file added** → also add it to `registry.jsonc` under `ocx-tools`
- **Node library** → edit files in `files/planning/plan-session/node-library/`; new files
  go in `registry.jsonc` too

> **`validate_dag` scope:** The `validate_dag` tool validates project DAGs written to
> `.opencode/session-plans/{name}/` — it does **not** validate the source planning DAG files
> in `files/planning/plan-session/`. If you modify `plan.json` or prompt files here, validate
> your changes manually by reading the file and checking the structure. Do not attempt to call
> `validate_dag plan-session` against the source files; any apparent success is an artifact of
> a stale local session copy, not a real validation of your edits.
>
> Note: `validate_dag` is legitimately called during planning sessions when agents are writing
> a *project* DAG — that is its intended use and is correct behavior.

### Updating profiles

1. Edit `opencode.jsonc` and/or `ocx.jsonc` in `files/profiles/{name}/`
2. `scripts/update-profiles.sh` can help synchronize changes across profiles

## Prompt Engineering

### Improvement Methodology

When improving prompts in this codebase, use the **research → insurgent → write** workflow:
1. **Research best practices** with @ExternalScout — targeted external lookup for the specific technique category being improved (Context7 first, Exa second). This establishes the gold-standard criteria before analysis.
2. **Analyze gaps** with @ContextInsurgent — read all relevant files, evaluate against the research-established criteria, produce a precise per-file change list
3. **Implement targeted edits** with @JuniorDev — surgical changes only; no rewrites of correct content

This workflow (first applied in commit df83c18) consistently produces better results than ad-hoc prompt editing. Research precedes analysis so CI has external criteria to audit against, not just internal conventions.

### Prompt Engineering Categories

Prompts in this codebase fall into three categories with distinct improvement patterns:

**Category A — Direct agent prompts** (`files/agents/*.md`)
The agent model reads the file directly. No delegation or double-indirection. Standard prompt engineering applies.

**Category B — Planning DAG delegation prompts** (`files/planning/plan-session/prompts/*.md`)
These teach HeadWrench how to write delegation prompts for subagents. Double-indirection: the prompt shapes *another* prompt. Improving these requires understanding both HW's orchestration behavior and the subagent's capabilities.

**Category C — Node library templates** (`files/planning/plan-session/node-library/*/`)
Triple-indirection: `README.md` + `prompt-template.md` teach the planning agent which node type to select and how to fill the template → the filled template becomes a project DAG node prompt → that prompt delegates to a subagent at execution time.

#### Category A: Improving direct agent prompts

Apply these techniques when editing any `files/agents/*.md` file:

1. **Explicit role definition at the top** — Open the prompt body with a single declarative sentence stating what the agent is and what it does. Readers (including the agent) should not have to read past the first paragraph to understand the agent's scope.
   - ✓ *"You are ContextScout — a quick, targeted codebase and context explorer."*
   - ✗ *"This agent handles various codebase tasks as needed."*

2. **Positive constraint framing** — State what the agent does, not just what it avoids. Reserve `NEVER`/`Never` for categorical hard prohibitions only (e.g., never modify files, never re-delegate). For behavioral guidance, prefer positive framing.
   - ✓ *"Deliver a concise, structured orientation report."*
   - ✗ *"Don't produce vague or overly broad reports."*

3. **Inline examples for ambiguous behaviors** — Where the agent must choose between plausible interpretations (input format ambiguity, partial information, conflicting signals), provide an inline example showing the expected handling. This is more reliable than abstract rules.
   - ✓ *"Log your interpretation: `Interpretation: no paths provided — used broad Glob to orient, then focused on *.ts files in src/.`"*
   - ✗ *"Use your best judgment when paths are not provided."*

4. **Explicit error handling** — Every agent prompt should specify what to do when the input is malformed, missing required information, or out of scope. The answer is never silence.
   - ✓ *"If your task requires external research, flag it under Potential Concerns: 'This task requires external research (ExternalScout) — not within ContextScout scope.'"*
   - ✗ (no guidance — agent silently fails or guesses)

5. **Refusal anchored to role, not constraint** — When an agent must decline a request, the explanation cites its role boundary, not an imposed rule. This produces cleaner redirection behavior.
   - ✓ *"When something is outside your role, say so clearly and tell the user where to go instead."*
   - ✗ *"You are not allowed to perform web searches."*

6. **Prompt structure ordering** — Order the system prompt sections to exploit positional weighting: (1) Role definition, (2) Core instructions + priorities, (3) Capability boundaries (CAN/CANNOT), (4) Output format, (5) Uncertainty handling, (6) Tool rules (if applicable), (7) Examples, (8) Operational guardrails. Role and core instructions belong first; guardrails belong last.
   - ✓ Agent prompt opens with a single-sentence role, immediately followed by behavioral priorities, then a "What You Do / Don't Do" section, then output format.
   - ✗ Interleaving tool rules with examples before the role is defined — the model applies role context to what follows it; content before the role lacks that anchoring.

7. **Delegation boundary explicitness** — For orchestrators, list both what they delegate and what they handle directly. Ambiguity at the delegation boundary is the most common source of HW doing too much or too little.
   - ✓ The `## What You Don't Do (as orchestrator)` section in `headwrench.md` with explicit → delegate targets.

**When to apply Category A:** Any time you are editing `files/agents/*.md` directly — adding a new section, sharpening an existing rule, improving output format instructions, fixing a recurring behavior failure observed in sessions, or optimizing prompt section ordering for positional weighting.

#### Category B: Improving planning DAG delegation prompts

**What makes Category B different from Category A:** Category B prompts (`files/planning/plan-session/prompts/*.md`) are read by HeadWrench at DAG execution time. Their job is not to instruct an agent directly — it is to instruct HW how to *write* a delegation prompt for a subagent. This double-indirection means quality degrades at two levels: a weak Category B prompt produces a weak dispatch prompt, which produces a weak subagent output. Category A techniques (role definition, positive framing, error handling) apply to the *subagent's* prompt — Category B techniques govern how HW is taught to produce that prompt.

Apply these techniques when editing any `files/planning/plan-session/prompts/*.md` file:

1. **Embed a dispatch template, not just a directive** — Every Category B prompt that triggers a subagent dispatch must contain a numbered template inside a blockquote telling HW exactly what to include in the subagent's task prompt. Do not tell HW to "write a good prompt." Give it the numbered slots to fill.
   - ✓ From `scout.md`: `"> **Writing scout prompts:** When writing each scout's task prompt, include: (1) specific file paths or glob patterns to read — not just thematic descriptions; (2) a clear statement of what the scout should return; (3) an explicit instruction that the scout must report findings as specific facts, not as generic 'Codebase Overview' or 'Key Decisions' sections."`
   - ✗ *"Dispatch three ContextScouts to explore the codebase."* (no template — HW must derive the prompt structure from first principles, producing inconsistent results)

2. **Embed structural artifacts verbatim when the subagent must reproduce them** — When the subagent's output requires a specific format (e.g., JSON schema, directory layout, file structure), embed the exact format in the Category B prompt as a code block. Do not describe the structure in prose. The subagent writes what it is shown; if shown JSON, it writes JSON; if shown prose, it may invent its own format.
   - ✓ From `write-dag.md`: the full `plan.json` nested-tree schema is embedded with a ❌ wrong / ✅ correct pair showing the exact JSON structure the subagent must produce
   - ✗ *"Tell the subagent to write a plan.json using the nested tree format."* (HW cannot reliably reconstruct the schema from a label)

3. **State subagent-specific constraints as rejection criteria** — For each subagent the prompt dispatches, include an explicit "do not do X" that is specific to that agent type's known failure mode. This prevents the most common dispatch errors without requiring HW to consult external documentation at runtime.
   - ✓ From `write-dag.md`: `"Do NOT include paths."` (for `prompt` field values), `"Do not invent todo values — use only valid OpenCode tool names from this table"`, `"Do NOT write prompts that describe or reference the planning system"`
   - ✓ From `research-brief.md`: `"@ContextScout is for internal codebase exploration ONLY. It must never be used for external research."` (prevents misrouting)
   - ✗ Omitting rejection criteria entirely — HW defaults to generic dispatch behavior and produces formless prompts

4. **Name the tool-use sequence explicitly** — When the subagent must call tools in a specific order, state that order in the dispatch template, not in a separate section. HW embeds whatever it reads in the blockquote; guidance in a different section may be skipped or not propagated to the subagent.
   - ✓ From `research-brief.md`: `"Instruct them to follow this tool priority: (1) Context7 first — use context7_resolve-library-id to identify libraries and context7_query-docs to retrieve documentation; (2) Exa second — only search the web for content not covered by Context7."`
   - ✗ *"Tell ExternalScout to research the topic."* (tool order unspecified — ExternalScout may invert order, wasting Exa queries)

5. **Specify the return format in the template** — The dispatch template must include a return-format slot. The subagent's output feeds into a downstream planning step; vague return format produces summaries that lose precision. State: what sections to include, what level of specificity (exact strings vs. themes), and what to do when nothing is found.
   - ✓ From `research-brief.md`: `"The output should be a brief structured summary (key findings, relevant APIs or patterns, caveats). Emphasize that this is a one-shot, quick pass — no follow-ups or deep dives."`
   - ✓ From `scout.md`: `"report findings as specific facts, not as generic 'Codebase Overview' or 'Key Decisions' sections"`
   - ✗ *"Have the scout report back its findings."* (no format — HW propagates the vagueness)

6. **Separate what HW does from what it delegates** — Category B prompts mix HW's own actions (calling `question`, calling `next_step`, summarizing results) with the subagent dispatch. Make the boundary explicit: use separate sections or explicit markers so HW does not accidentally do the work itself instead of delegating, or vice versa.
   - ✓ From `write-dag.md`: the `## Todo` section lists numbered steps (`task`, `validate_dag`, `task`) with distinct ownership; the narrative sections (schema, node rules, examples) are framed as content to pass through, not instructions for HW to act on directly
   - ✓ From `research-brief.md`: `"After the user answers: immediately call the task tool in the same turn — do not emit a response and wait for a new user message"` (explicit sequencing of HW's own actions vs. dispatch)
   - ✗ A single undifferentiated prompt body that mixes "HW should think about X" with "dispatch @ContextScout to do Y" — HW may attempt both or conflate them

7. **Delegation failure prevention — check against MAST failure modes** — Before finalizing a Category B prompt, verify the dispatch template addresses the 6 highest-frequency delegation failure modes: (1) task misinterpretation — is the subagent's deliverable stated concretely, not as a theme? (2) ambiguous role definitions — does the prompt name the exact subagent and what it produces? (3) context collapse — does the dispatch template carry all context the subagent needs (file list, prior findings, constraints)? (4) format mismatches — does the return format in the template match what the downstream node expects? (5) missing context — are there any implicit assumptions about what the subagent already knows? (6) no termination condition — does the subagent know when it is done?
   - ✓ A dispatch template that names the subagent, provides an explicit file list, states the return format, and includes "one-shot — no follow-ups or deep dives."
   - ✗ "Dispatch @ContextInsurgent to analyze the authentication system." — fails on (1), (3), (4), and (6).

**When to apply Category B:** Any time you are editing `files/planning/plan-session/prompts/*.md` — adding a new delegation node, sharpening dispatch instructions for an existing node, fixing a recurring subagent output quality failure traced back to a vague dispatch prompt HW wrote, or adding a new subagent type to an existing node. If a session produces a weak subagent output and the root cause is a formless dispatch prompt HW wrote, the fix is a Category B improvement, not a Category A improvement.

#### Category C: Improving node library templates

**What makes Category C different from Category B:** Category C artifacts (`files/planning/plan-session/node-library/*/`) introduce a third indirection hop. A Category B prompt teaches HW how to write a dispatch prompt. A Category C template teaches the *planning agent* how to write a node prompt — which HeadWrench will later read as a Category B-style prompt and use to dispatch a subagent. The quality chain is: README + template → planning agent fills template → filled template becomes a project DAG node prompt → HW reads it and dispatches a subagent. A weakness at the authoring layer (bad `README.md`) degrades the filled template; a weakness at the execution layer (bad template structure) degrades the subagent's output even when the planning agent fills placeholders correctly. Both layers must be engineered independently.

The core engineering challenge is **satisfying two audiences simultaneously**: the planning agent (who reads the README and fills the template's `{{PLACEHOLDER}}` slots) and the executing agent (who reads the filled template at DAG runtime and must dispatch a subagent from it). A good Category C artifact gives the planning agent clear authoring guidance and gives the executing agent a complete execution spec — embedded in the same document.

Apply these techniques when editing any `files/planning/plan-session/node-library/*/` file:

1. **README.md must contain an explicit "What the planning agent must resolve" section** — This is the authoring-layer contract. It lists every piece of information the planning agent must determine *before* writing the node's prompt, so the `{{PLACEHOLDER}}` slots are filled with precise, actionable content, not vague descriptions. Each item should name what is needed and distinguish good from bad input.
   - ✓ From `analyze-deep/README.md`: `"**Synthesis question** — What specific question should ContextInsurgent answer? Be precise."` and `"**Complexity justification** — Why haiku scouts are insufficient for this task. Good: 'This requires tracing three interdependent call chains across 8 files.' Bad: 'Need to understand the codebase.'"` (both name the item and distinguish well-formed from malformed input)
   - ✗ A README that says only "Use when multi-file analysis is needed" — the planning agent has no authoring checklist and will invent placeholder content from thin air

2. **README.md must state the output constraint the planning agent must propagate into the filled prompt** — When the executing subagent has a known failure mode (e.g., producing boilerplate section headers instead of specific evidence), that rejection criterion must appear in the README's "must resolve" section so the planning agent knows to embed it in the node prompt. The constraint travels from README → filled prompt → subagent.
   - ✓ From `analyze-deep/README.md`: `"**Output constraint** — The dispatched prompt must include this instruction: 'Do not produce a generic "Architecture Overview" or "Key Decisions" section — report specific file paths, line numbers, and exact strings.'"` (names the exact instruction the planning agent must copy into the prompt)
   - ✗ Leaving output constraints only in the template's fixed sections — the planning agent may not understand *why* the constraint is there and may inadvertently weaken it when paraphrasing

3. **Template placeholders must be surrounded by authoring-guidance comments, not left bare** — A bare `{{PLACEHOLDER}}` tells the planning agent only where to write, not what to write. The comment or italic annotation adjacent to the placeholder specifies what the slot expects, what to include, and what to avoid. This guidance is read by the planning agent at authoring time and is invisible to (or safely ignored by) the executing agent.
   - ✓ From `analyze-deep/prompt-template.md`, the `{{CONTEXT_TO_PROVIDE}}` slot is followed immediately by: `"*The file list CI must read (e.g., \`src/auth/token.ts\`, \`src/auth/helpers/*.ts\`) and any prior scout findings to build on. Always include an explicit list of files — do not substitute contextual prose for file paths.*"` (names the exact content type, gives an example, and states an anti-pattern to avoid)
   - ✗ A template with `{{INPUT_FILES}}` and no adjacent guidance — planning agent may write a prose description of a feature area instead of a list of file paths, producing a useless dispatch prompt

4. **Template must include a fixed execution-spec section that the executing agent reads verbatim** — Fixed sections (not placeholders) carry the subagent's behavioral constraints to runtime. These are not filled by the planning agent — they are part of the template's permanent structure and must survive the fill step unchanged. They constitute the execution layer of the three-zone structure.
   - ✓ From `analyze-deep/prompt-template.md`: the `## Output format requirements` section is entirely fixed: `"Answer the question directly with specific evidence from the code. Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings."` — HW reads this at DAG runtime and propagates it to ContextInsurgent
   - ✓ From `analyze-deep/prompt-template.md`: the `## Scope restriction` section is entirely fixed and carries the `.opencode/` exclusion rule — the planning agent cannot accidentally omit it because it is not a placeholder
   - ✗ Encoding all behavioral constraints as placeholders — the planning agent may fail to fill them, or fill them weakly, allowing the subagent to fall back to default behavior

5. **Template must embed a dispatch blockquote naming the exact prompt construction requirements** — Identical to Category B technique #1, but appearing inside the template itself (not in a planning DAG prompt). The blockquote is read by HW at DAG execution time and tells it what the subagent's task prompt must contain. It must be a numbered list of concrete slots, not a directive like "write a good prompt."
   - ✓ From `analyze-deep/prompt-template.md` (line 29): `"> **Writing the ContextInsurgent's prompt:** The prompt must specify: (1) the exact analysis question specified for this node; (2) which files or directories to read; (3) the expected return format — a direct answer with supporting evidence, not boilerplate section headers."` (numbered, concrete, names three distinct requirements)
   - ✗ A blockquote that says only `"> Dispatch @ContextInsurgent with the analysis question."` — HW dispatches without file list, without output format spec, producing an unfocused analysis

6. **README.md must document node-type-specific failure modes in a Notes section** — Beyond the "must resolve" checklist, the README should capture failure patterns specific to *this node type* that cannot be inferred from the node type name alone. These prevent misuse at planning time, before a bad prompt is ever written.
   - ✓ From `analyze-deep/README.md` Notes: `"If the goal is context compression rather than deep analysis, use compression-node instead — analyze-deep produces reasoning artifacts, not context window pruning."` (names a specific misuse pattern and redirects to the correct node type)
   - ✓ From `analyze-deep/README.md` Notes: `"Do not instruct ContextInsurgent to read .opencode/ session directories — they contain stale plan artifacts that may conflict with the actual codebase."` (specific failure mode with concrete consequence)
   - ✗ A Notes section that only says "Use sparingly" — no actionable discrimination between correct and incorrect use

7. **Template section ordering exploits primacy-recency** — Structure `prompt-template.md` in this order: (1) Fixed role/expertise declaration at the start (sets frame for all that follows), (2) Authoring-layer placeholders in the middle (filled by planning agent), (3) Fixed execution-spec sections near the end (output format, scope restriction, behavioral constraints — high-recency weight), (4) Fixed dispatch blockquote as the final element (HW reads it last and acts on it immediately).
   - ✓ `analyze-deep/prompt-template.md`: opens with dispatch preamble → `{{ANALYSIS_QUESTION}}` and `{{CONTEXT_TO_PROVIDE}}` in the middle → `## Output format requirements` and `## Scope restriction` near end → dispatch blockquote as final element.
   - ✗ A template that puts the dispatch blockquote before the fixed execution-spec — the executing agent reads the blockquote before receiving the output format constraint, potentially dispatching without propagating it.

8. **Constraint cascade — same constraint must appear in three places** — Any critical behavioral constraint (e.g., "no generic section headers", "no `.opencode/` reads", "one-shot only") must appear in: (1) README.md "must resolve" section — so the planning agent knows to embed it; (2) template's fixed execution-spec section — so it survives the planning-agent fill step verbatim; (3) dispatch blockquote — so HW re-states it when writing the actual task prompt for the subagent. A constraint that appears in only one or two layers will be dropped at one indirection hop.
   - ✓ The "no generic section headers" constraint in `analyze-deep`: README states it under "Output constraint" → template's `## Output format requirements` repeats it verbatim → dispatch blockquote includes it as item (3).
   - ✗ A constraint that only appears in the dispatch blockquote but not in the README — the planning agent may weaken or omit the blockquote when filling the template, dropping the constraint.

**When to apply Category C:** Any time you are editing files under `files/planning/plan-session/node-library/` — adding a new node type, sharpening a README's "must resolve" section, adding an output constraint that a subagent is repeatedly violating, adding a fixed execution-spec section that planning agents are accidentally overwriting, or fixing a recurring planning-time error where the planning agent is filling placeholders with the wrong content type. If a session produces a poorly-filled node prompt and the root cause is insufficient authoring guidance in the README or template, the fix is a Category C improvement. If the filled prompt is correct but the executing agent still produces weak output, check whether the template's fixed execution-spec sections and dispatch blockquote are strong enough — those are also Category C concerns.

### Per-Agent Prompting Patterns

When HeadWrench dispatches a subagent, the task prompt must include:

**@ContextScout:**
- Specific file paths or glob patterns — not thematic descriptions ("look at the auth system")
- A clear statement of what to return (e.g., "return the exact function signatures from X")
- Verbatim-return instruction when summarization would lose information: *"Do not produce generic 'Codebase Overview' or 'Key Decisions' sections — report specific file paths, line numbers, and exact strings."*

**@ContextInsurgent:**
- A single, specific analysis question (the "Answer / Conclusion" CI should produce)
- An explicit file list — CI needs the full reading list, not just a topic
- Expected output format (e.g., "return a file-by-file change list")
- Scope exclusion: instruct CI explicitly NOT to read `.opencode/` session directories — they contain stale planning artifacts that can corrupt analysis. State: "Do not read any files under `.opencode/`."

**@ExternalScout:**
- Tool priority: *"Use Context7 first (context7_resolve-library-id, then context7_query-docs). Use Exa second."*
- The exact question or topic — not just a subject area
- Return format: cite versions, include code examples, synthesize into a direct answer (not a list of links)

**@JuniorDev:**
- Specific target files (repo-relative paths)
- Success criterion: what the edit achieves, as an observable outcome
- Scope note: files JD must NOT touch

**@QuickDoc:**
- Target file path
- What to write and what format/template to follow
- Conventions reference: point to an existing file to match

### Verbatim-Return Pattern

Use verbatim-return instructions when the downstream step needs raw content, not a summary:
- Planning agents reading the node library (need exact node type names and todo arrays)
- Scouts reading config files or schemas
- Any retrieval task where summarization destroys precision

**Exact instruction language:** *"Return file contents verbatim. Do NOT summarize, restructure, or add section headers. The planning agent needs the raw content — summarizing destroys the information."*

### Agent Boundary Rules

- **@ContextScout = internal codebase only.** Never dispatch for external research (docs, APIs, web search). Misrouting burns its 12-step budget on network lookups it cannot perform.
- **@ExternalScout = external research only.** Never dispatch for codebase reads. It is the designated agent for ALL external lookups — from a quick API reference to a deep multi-source investigation.

### Anti-Patterns

- **Thematic scout prompts** — "Look at the auth system" → scout cannot orient on a less-capable model. Always provide file paths.
- **Generic output sections** — Asking for "Codebase Overview" or "Key Decisions" produces thematic summaries instead of actionable facts. Ask for specific file paths, line numbers, and exact strings.
- **CS for external research** — ContextScout cannot browse the web. Routing external lookups to CS produces nothing useful.
- **ES tool order reversed** — Exa before Context7 wastes Exa queries on library docs that Context7 covers better. Always Context7 first.
- **Wrong tool name in todo array** — The plugin does exact string matching. `sequential-thinking_sequentialthinking` uses an underscore (not a hyphen) between the two parts of the name. Any variant (`sequential-thinking-sequentialthinking`, etc.) causes a permanent block — the expected tool is never called. Copy tool names verbatim from the exempt tools list.
- **Dispatch without numbered slots in blockquote** — Writing a Category B or C prompt that tells HW to "dispatch @ContextScout to explore X" without a numbered blockquote template forces HW to derive the subagent's full task prompt from scratch, producing inconsistent and often weaker output. Every dispatch instruction requires a numbered template blockquote.

### Prompting-Mechanism DAG Rule

When generating a project DAG that touches any prompting mechanism — agent files, node library templates, headwrench.md delegation sections, or planning prompts — always structure the DAG using the **research-deep → insurgent → improve** workflow:

1. **Research phase** — One `research-deep` node per distinct audit category (agent self-regulation patterns, template design, delegation prompting patterns, etc.). Run them sequentially. This establishes the external gold-standard criteria that analysis will audit against.
2. **Compress** — A `compression-node` after the research phase to crystallize best-practice findings before analysis begins.
3. **Analyze phase** — One or more `analyze-deep` nodes (ContextInsurgent) to audit each category of prompting files against the research-established criteria. Produce a per-file change list.
4. **Compress** — A second `compression-node` after the analysis phase to crystallize the change list before implementation.
5. **Implement phase** — `parallel-tasks` nodes to apply changes (separate nodes for agent files vs. node library files).
6. **Review** — An `analyze-deep` node (ContextInsurgent) to verify all changes against gold-standard criteria.
7. **Approval gate** — A `decision-gate` for user approval before finalizing.
8. **Finalize** — `parallel-tasks` to update CHANGELOG.md and AGENTS.md.

**Trigger:** Any DAG whose implementation phase will modify or create files in `files/agents/`, `files/planning/plan-session/node-library/`, or `files/planning/plan-session/prompts/`.

## File Naming Conventions

- Agents: `files/agents/{kebab-case-name}.md`
- Commands: `files/commands/{kebab-case-name}.md`
- Skills: `files/skills/{kebab-case-name}/SKILL.md`
- Plugins: `files/plugins/{kebab-case-name}.ts`
- Profiles: `files/profiles/{kebab-case-name}/opencode.jsonc` + `ocx.jsonc`
- Node library nodes: `files/planning/plan-session/node-library/{node-name}/`

## Code Conventions

### The 5 Laws

1. **Early Exit** — Guard clauses, fail fast, return early
2. **Parse, Don't Validate** — Zod schemas at boundaries
3. **Atomic Predictability** — Pure functions, same input = same output
4. **Fail Fast, Fail Loud** — Clear errors immediately, no silent failures
5. **Intentional Naming** — Names reveal intent, code reads like sentences

### Configuration format

All config files use JSONC (JSON with comments). Environment variables are referenced as
`{env:VAR_NAME}` in config values.

### Instruction file priority

OpenCode uses "first type wins" at each directory level: `AGENTS.md` > `CLAUDE.md` > `CONTEXT.md`.
Registry components should NOT install to root instruction files — use `opencode.instructions`
with custom paths instead.

## MCP Servers

Profiles configure these MCP servers:

| Server | Purpose | Requirement |
|--------|---------|-------------|
| `context7` | Documentation lookup | None |
| `sequential-thinking` | Step-by-step reasoning | None |
| `exa` | Web search | `EXA_API_KEY` env var |

## Changelog Policy

Before creating any non-release commit that touches shipped registry files (agents, prompts, plugins, planning files, profiles, skills), update the `## [Unreleased]` section of `CHANGELOG.md` to describe the changes. Group entries under `### Added`, `### Changed`, `### Fixed`, or `### Removed` as appropriate. Include `CHANGELOG.md` in the same commit as the code changes — do not create a separate changelog commit.

**Do not add `AGENTS.md` changes to `CHANGELOG.md`.** `AGENTS.md` is a dev-only artifact — it is tracked in git and committed normally, but its changes are not part of the shipped registry and do not belong in the changelog. Only changes to shipped registry files (agents, prompts, plugins, planning files, profiles, skills, user docs) go in `CHANGELOG.md`.

## Release Workflow

When the user says "creating a vX.Y.Z release" or similar, follow these steps in order:

1. **Find the last tag** — `git tag --sort=-version:refname | head -5`
2. **Review commits since that tag** — `git log <last-tag>..HEAD --oneline`
3. **Get file-level detail** — `git show <sha> --stat` for each commit to understand scope
4. **Update `CHANGELOG.md`**:
   - Add a new `## [X.Y.Z] - YYYY-MM-DD` section under `## [Unreleased]`
   - Group entries under `### Added`, `### Changed`, `### Fixed`, `### Removed` as appropriate
   - Add the comparison link at the bottom: `[X.Y.Z]: https://github.com/NAGAGroup/CodeAccelerate-OpencodeConfig/compare/v<prev>...vX.Y.Z`
   - Update the `[Unreleased]` link to compare from the new tag
5. **Update `registry.jsonc`** — bump `"version"` field to the new version number
6. **Update `AGENTS.md`** — bump `Current version:` to the new version number
7. **Commit** — `git add CHANGELOG.md registry.jsonc AGENTS.md && git commit -m "chore: release vX.Y.Z"`
8. **Tag** — `git tag -a vX.Y.Z -m "vX.Y.Z"`
9. **Push** — `git push origin main && git push origin vX.Y.Z`
10. **Create GitHub release** — `gh release create vX.Y.Z --title "vX.Y.Z" --notes "<changelog body>"`
    - Release notes body = the new changelog section content (without the `## [X.Y.Z]` heading line)

## Deployment

Three targets configured — choose one:

- **Cloudflare Workers:** `bun run deploy` (uses `wrangler.jsonc`)
- **Vercel:** Push to GitHub, auto-deploys (uses `vercel.json`)
- **Netlify:** Push to GitHub, auto-deploys (uses `netlify.toml`)

All serve the same static `dist/` output.

## Troubleshooting

- **Build fails:** Check `registry.jsonc` syntax and that all referenced files exist under
  `files/`. Run `bunx ocx build . --out dist --verbose` for details.
- **Component missing after deploy:** Verify it appears in `dist/index.json`. Clear CDN cache.
- **Plugin not loading:** Ensure default export, valid TypeScript, and `satisfies Plugin` assertion.
- **DAG node not advancing:** Check that the tool name in `todo[]` exactly matches the real
  OpenCode tool name. The plugin does string matching — no aliases.
