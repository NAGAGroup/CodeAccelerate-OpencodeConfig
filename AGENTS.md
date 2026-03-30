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
**Current version:** 3.4.0 (see `registry.jsonc`)
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
│   │   │   ├── prompts/    # One .md file per node (9 files)
│   │   │   └── node-library/ # Reusable node type templates (12 node types)
│   │   └── reference/      # dag-design-guide.md — schema spec and authoring guide
│   ├── plugins/            # planning-enforcement.ts (+ compiled .js bundle)
│   ├── profiles/           # 5 profile configs (opencode.jsonc + ocx.jsonc each)
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

The registry ships **7 components** defined in `registry.jsonc`:

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
| **deep-researcher** | haiku | Web/docs research via MCP (step budget: 15) | Yes |
| **quick-doc** | haiku | Single-file document writes (step budget: 8) | Yes |

Users interact only with HeadWrench. It reads intent and delegates to specialists.

## Planning System

One DAG-driven planning mode ships: **plan-session**, triggered by `/plan-session`.

The `plan-session` DAG lives in `files/planning/plan-session/` and follows this flow:

```
session-overview → scout → research-gate
  → [research-brief → scout-node-library → sequential-thinking → propose-plan
        → [write-dag]              (approved path)
        → [propose-plan-2 → write-dag-2]]  (rethink path)
  → [scout-node-library-2 → sequential-thinking-2 → propose-plan-3
        → [write-dag-3]            (approved path)
        → [propose-plan-4 → write-dag-4]]  (rethink path)
```

| Node | Todo | Purpose |
|------|------|---------|
| `session-overview` | `[]` | Entry, auto-advance |
| `scout` | `["task","task","task"]` | 3x @ContextScout in parallel |
| `research-gate` | `["question"]` | User decides if cursory external research is needed |
| `research-brief` | `["question", "task"]` | User picks research topic; DeepResearcher does a cursory lookup |
| `scout-node-library` | `["task"]` | @ContextScout reads node library (pure info-gathering) |
| `sequential-thinking` | `["sequential-thinking_sequentialthinking"]` | HW designs complete plan with full context (Branch A: with research) |
| `sequential-thinking-2` | `["sequential-thinking_sequentialthinking"]` | HW designs complete plan with full context (Branch B: no research) |
| `propose-plan` | `["question"]` | HW presents complete plan (structure + decomposition), user approves |
| `write-dag` | `["task","validate_dag","task"]` | Write plan files, validate, verify |

The `planning-enforcement` plugin manages DAG state, enforces todo ordering, and blocks
off-sequence tool calls at runtime.

### Node Library

`files/planning/plan-session/node-library/` contains reusable node type templates that planning
agents select from when composing project DAGs. Each node type has three files:

- `plan.json` — fixed id, prompt filename, todo array
- `README.md` — when to use it, what the planning agent must resolve before writing it
- `prompt-template.md` — scaffold with section headers the agent fills in

**12 node types:**

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
| `generic` | flexible | Escape hatch, custom todo |

Node ID conventions: repeated nodes use `-<N>` suffix (e.g. `test-2`, `fix-3`). DAG is a
tree — nodes cannot be shared across branches; each branch needs its own terminal instance.
**Every node id must be globally unique within the DAG tree.** Reusing an id (e.g. for a
loop-back) silently overwrites the node_map entry and causes the node to behave as a terminal,
ending the session prematurely. The plugin now throws a validation error on duplicate ids.

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
`${VAR_NAME}` in config values.

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

**Do not add `AGENTS.md` changes to `CHANGELOG.md`.** `AGENTS.md` is a dev-only artifact and is not part of the shipped registry.

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
