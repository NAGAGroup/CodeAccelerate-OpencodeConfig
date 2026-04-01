# AGENTS.md

Reference guide for AI assistants working on this codebase — covering what to know about the source, not how to operate the agent system (the deployed config handles that).

## Project Identity

**CodeAccelerate-OpencodeConfig** is an OCX (OpenCode Components) registry that distributes a multi-agent development system called **CodeAccelerate** for the [OpenCode](https://opencode.ai/) platform.

Users install components via the OCX CLI. The registry is built into static JSON assets deployed to Cloudflare Workers, Vercel, or Netlify.

## Quick Commands

```bash
bun run build    # Build registry to dist/ (includes plugin compilation; bunx ocx build . --out dist)
bun run dev      # Build + local Cloudflare Workers dev server
bun run deploy   # Build + deploy to Cloudflare Workers
```

**Runtime:** Bun v1.3.5+
**Build tool:** OCX CLI (`bunx ocx build`)
**Current version:** 4.0.0 (see `registry.jsonc`)
**Min compatibility:** OpenCode 1.27.0, OCX CLI 1.0.16

## The Meta-Context Challenge

Any agent working on this project is running a deployed instance of the system it is modifying. This creates failure modes that don't exist in ordinary codebases.

**The source IS the deployed config.** `files/planning/plan-session/` contains both the source code (what gets shipped) and the files the running planning system reads. Edits take effect for future sessions, not the currently running one.

**`.opencode/` is runtime state, not source.** Files written to `.opencode/session-plans/{name}/` are ephemeral execution artifacts for the current project DAG. They are never source code and must never be edited as if they were.

**Project DAG nodes ≠ source node library entries.** When a planning session is working on this codebase, the planning agent writes DAG node prompts to `.opencode/session-plans/{name}/prompts/` — these are disposable execution artifacts. The shipped node library lives at `files/planning/plan-session/node-library/`. These are categorically different artifacts at different paths; confusing them is the single most common planning-session failure mode on this project.

**Reading node library source during planning is expected.** The plan-session DAG's `scout-node-library` node reads the CATALOGUE.md (copied to `.opencode/session-plans/plan-session-ses_{id}/node-library/CATALOGUE.md` at session start) to orient the planning agent before DAG design. This is correct behavior — don't shortcut it by reading node library files ad-hoc outside the designated DAG node.

## Repository Structure

```
├── registry.jsonc          # Registry manifest — single source of truth for components
├── files/                  # Source files for all registry components
│   ├── agents/             # 6 agent definitions (Markdown with YAML frontmatter)
│   ├── commands/           # 2 slash commands (plan-session, activate-plan)
│   ├── planning/           # DAG-driven planning scaffolds
│   │   ├── plan-session/   # The only shipped planning mode
│   │   │   ├── plan.json   # Executable DAG
│   │   │   ├── prompts/    # One .md file per node
│   │   │   └── node-library/ # Reusable node type templates (14 node types)
│   │   └── reference/      # dag-design-guide.md — schema spec and authoring guide
│   ├── plugins/            # planning-enforcement.ts (+ compiled .js bundle)
│   ├── profiles/           # 6 profile configs (opencode.jsonc + ocx.jsonc each)
│   └── skills/             # 1 skill (hello-world)
├── docs/                   # User-facing documentation
├── scripts/                # update-profiles.sh
├── CHANGELOG.md            # Release history
└── package.json            # Build scripts only, no runtime deps
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

## Prompting Framework

Prompts in this codebase fall into three categories with distinct indirection levels. Applying the wrong technique to the wrong category produces degraded output.

**Category A — Direct agent prompts** (`files/agents/*.md`)
The agent model reads the file directly. One hop. Standard prompt engineering applies: role-first ordering, positive framing, explicit error handling, positional weighting of constraints.

**Category B — Planning DAG delegation prompts** (`files/planning/plan-session/prompts/*.md`)
HeadWrench reads these to write dispatch prompts for subagents. Two hops: the prompt shapes *another* prompt. Techniques must account for the double-indirection — a weak B prompt produces a weak dispatch prompt, which produces a weak subagent output. Every dispatch instruction requires a numbered blockquote template, not a prose directive.

**Category C — Node library templates** (`files/planning/plan-session/node-library/*/`)
Three hops: planning agent fills the template → filled template becomes a project DAG node → HW reads it to dispatch a subagent. The template must serve two audiences simultaneously: the planning agent (who fills the `{{PLACEHOLDER}}` slots) and the executing agent (who reads the filled result at runtime). README.md is the authoring-layer contract; `prompt-template.md` is the execution-layer spec. Critical constraints must cascade through all three layers (README → fixed template section → dispatch blockquote) or they drop at an indirection hop.

**Minimum supported model:** Qwen3-14B with thinking disabled. All planning prompts and node-library templates are calibrated to this baseline. Do not introduce patterns that require a stronger model to follow reliably (e.g., >6-item lists, negative-framing constraints, multi-section prose sequences, code-block syntax examples of tool calls).

**Improvement methodology:** research → insurgent → write. This order is non-negotiable. ExternalScout establishes gold-standard criteria first; ContextInsurgent audits the source against those criteria and produces a per-file change list; JuniorDev/QuickDoc apply targeted edits. Ad-hoc editing without prior research produces changes that satisfy local conventions but violate external best practices.

**When working on prompting source, always identify the category first.** The category determines which technique set applies, which agent does the analysis, and what "correct" output looks like. Misidentifying Category C templates as Category A agent prompts (a common error) produces structurally sound but functionally incorrect changes.

## Planning Prompt Engineering Rules

These 16 rules are derived from Qwen3-14B failure analysis and apply to all Category B (planning session prompts) and Category C (node-library templates). Violations cause small-model compliance failures even when the prompt reads correctly to a larger model.

| Rule | Constraint |
|------|-----------|
| R1 | Opening sentence IS the action — "Call `X`" not "Your job is to call `X`" |
| R2 | No numbered steps in prose — todo array sequences; prose does not |
| R3 | `next_step()` mentioned once, last line only — never mid-prompt |
| R4 | No H2/H3 section headers inside prompt body — H1 title + blockquote only |
| R5 | Dispatch blockquote immediately after todo — zero prose between |
| R6 | Output constraint is the last item in every dispatch blockquote |
| R7 | ≤6 items in any numbered list or blockquote |
| R8 | Glob examples in every scout dispatch: `✓ glob("**/*.ext")` / `✗ glob("a.ext,b.ext")` |
| R9 | Routing instruction is last in prompt, exact node IDs, never `when`-strings |
| R10 | Scope restrictions inside blockquote, second-to-last position |
| R11 | Parallel dispatch: one prose sentence max; rely on todo array count |
| R12 | No "After X returns" sections — only post-action text is R3 |
| R13 | No `task_id` in blockquotes unless a specific `ses_` string is provided |
| R14 | Each `{{PLACEHOLDER}}`: one instruction sentence + `✓`/`✗` example, adjacent |
| R15 | Sequential-thinking: "Call repeatedly until conclusion clear, then `next_step()`" |
| R16 | Delete ALL code-block syntax examples of `sequential-thinking_sequentialthinking` |
| R16b | Don't name sequential-thinking questions with bold headers — use plain reasoning instructions |

**Dispatch prompt slot-fill pattern (Category B).** Planning session prompts that dispatch subagents use fenced prompt templates with `{{SLOT}}` markers. HW fills each slot from a named context source (e.g., Scout 1 output, user task description) and pastes the filled template verbatim into the `prompt` field. HW must never author the `prompt` field from scratch — this causes context-free dispatch where subagents receive no project-specific information.

## Path and Visibility Constraints

**`files/` is invisible to user agents.** The `files/` directory exists only in this registry source repo. After `ocx install`, components land in the user's OpenCode config — agents in user projects have no `files/` path. Any path starting with `files/` hardcoded inside a shipped file is broken for users.

**`{{SESSION_PATH}}` substitution applies only to planning session prompts.** The plugin substitutes `{{SESSION_PATH}}` → `.opencode/session-plans/{name}` at copy-time in files under `files/planning/plan-session/prompts/`. Node-library READMEs and prompt-templates are plain-copied without substitution — they must never use `{{SESSION_PATH}}` as a path token. Use concrete example paths instead (e.g., `.opencode/session-plans/plan-session-ses_{id}/node-library/`).

**Node-library runtime location.** During a live planning session the node-library lives at `.opencode/session-plans/plan-session-ses_{id}/node-library/` in the user's project. The source at `files/planning/plan-session/node-library/` is never visible to user agents. Path references in shipped files must target the runtime location, not the source location.

## Source Code Constraints

These invariants must hold after any edit to this codebase. Violating them breaks developer intent even when the code compiles and the build passes.

**Delegation returns distillation, not raw content.** Subagents synthesize and return findings to HW — they don't act as file passthrough pipes. The one legitimate exception is precision-critical retrieval: when summarization would destroy fidelity (e.g., reading a schema file or node library CATALOGUE for exact field names), the dispatch prompt explicitly instructs return-as-is. This exception must be deliberate and annotated; it is not the default.

**Full tool access → HW subagent dispatch, not plugin workaround.** Primary HW is intentionally constrained by the planning-enforcement plugin's todo sequencing. If a new use case requires unrestricted tool access in HW's context, the fix is to add a HW subagent dispatch mechanism to the source (as the `verification-check` and `write-dag` nodes do) — not to modify the plugin's exempt-tools list or attempt to work around enforcement.

**`validate_dag` validates session plans only.** The tool validates DAGs written to `.opencode/session-plans/{name}/` — it does **not** validate source planning files in `files/planning/plan-session/`. Running `validate_dag plan-session` against source files produces misleading results (any apparent success is an artifact of a stale local session copy). Validate source DAG edits manually by reading the file and checking structure.

**Never edit the compiled plugin bundle directly.** Plugin source is `files/plugins/planning-enforcement.ts`. The `.js` bundle in the same directory is auto-compiled by `bun run build`. Edits to the `.js` file are overwritten on next build.

**`sequential-thinking_sequentialthinking` uses an underscore.** This is the exact tool name the plugin matches against. Any typo (`sequential-thinking-sequentialthinking`, `sequentialthinking_sequentialthinking`, etc.) causes a permanent plugin block with no error message — the todo item is never satisfied and the DAG stalls. Copy the name verbatim from the exempt-tools list when writing `plan.json` todo arrays.

**Branch routing uses node IDs, not `when` strings.** When HW calls `next_step({ next: "<value>" })` at a branching node, the plugin matches `<value>` against branch `nodeId` fields — not against the human-readable `when` string. The `when` field exists only for display. Always pass the exact child node `id` value.

**Every node ID in a DAG must be globally unique.** Reusing an ID (e.g., for loop-back) silently overwrites the node_map entry, causing the node to behave as a terminal and ending the session prematurely. The plugin throws a validation error on duplicate IDs — `validate_dag` will catch this for session plan DAGs.

## Development Workflow

### Adding a new component

1. Create source file(s) under `files/` following the naming conventions below
2. Add the component entry to `registry.jsonc` with name, type, description, and files array
3. If it belongs in the bundle, add it to `ocx-bundle`'s files array
4. Run `bun run build` — if the component is absent from `dist/index.json`, the `registry.jsonc` entry is missing or malformed

### Modifying an agent

1. Edit the Markdown file in `files/agents/`
2. YAML frontmatter carries metadata (`description`, `mode`, `steps`, `color`, `permission`)
3. No `registry.jsonc` update needed — agent files are already registered

### Modifying the planning DAG

- **Node/edge structure** → edit `files/planning/plan-session/plan.json`
- **Prompt content** → edit files in `files/planning/plan-session/prompts/`
- **New prompt file added** → also add it to `registry.jsonc` under `ocx-tools` or it won't ship
- **Node library** → edit files in `files/planning/plan-session/node-library/`; new files go in `registry.jsonc` too

### Updating profiles

1. Edit `opencode.jsonc` and/or `ocx.jsonc` in `files/profiles/{name}/`
2. `scripts/update-profiles.sh` can help synchronize changes across profiles

## File Naming Conventions

- Agents: `files/agents/{kebab-case-name}.md`
- Commands: `files/commands/{kebab-case-name}.md`
- Skills: `files/skills/{kebab-case-name}/SKILL.md`
- Plugins: `files/plugins/{kebab-case-name}.ts`
- Profiles: `files/profiles/{kebab-case-name}/opencode.jsonc` + `ocx.jsonc`
- Node library nodes: `files/planning/plan-session/node-library/{node-name}/`

## Configuration Conventions

All config files use JSONC (JSON with comments). Environment variables are referenced as `{env:VAR_NAME}` in config values.

OpenCode uses "first type wins" at each directory level: `AGENTS.md` > `CLAUDE.md` > `CONTEXT.md`. Registry components must NOT install to root instruction files — use `opencode.instructions` with custom paths instead (prevents overwriting the user's own instruction file).

## MCP Servers

Profiles configure these MCP servers:

| Server | Purpose | Requirement |
|--------|---------|-------------|
| `context7` | Documentation lookup | None |
| `sequential-thinking` | Step-by-step reasoning | None |
| `exa` | Web search | `EXA_API_KEY` env var |

## Changelog Policy

Before creating any non-release commit that touches shipped registry files (agents, prompts, plugins, planning files, profiles, skills), update the `## [Unreleased]` section of `CHANGELOG.md`. Group entries under `### Added`, `### Changed`, `### Fixed`, or `### Removed`. Include `CHANGELOG.md` in the same commit as the code changes.

**Do not add `AGENTS.md` changes to `CHANGELOG.md`.** `AGENTS.md` is a dev-only artifact — its changes are not part of the shipped registry.

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
7. **Run `bun run build`** — verify the build succeeds before tagging
8. **Commit** — `git add CHANGELOG.md registry.jsonc AGENTS.md && git commit -m "chore: release vX.Y.Z"`
9. **Tag** — `git tag -a vX.Y.Z -m "vX.Y.Z"`
10. **Push** — `git push origin main && git push origin vX.Y.Z`
11. **Create GitHub release** — `gh release create vX.Y.Z --title "vX.Y.Z" --notes "<changelog body>"`
    - Release notes body = the new changelog section content (without the `## [X.Y.Z]` heading line)

## Deployment

Three targets configured — choose one:

| Target | Command | Config |
|--------|---------|--------|
| Cloudflare Workers | `bun run deploy` | `wrangler.jsonc` |
| Vercel | Push to GitHub (auto-deploys) | `vercel.json` |
| Netlify | Push to GitHub (auto-deploys) | `netlify.toml` |

All serve the same static `dist/` output.
