# Session Overview: Add Haiku Profiles

## Task Goal

Add two new OpenCode profiles — `ocx-haiku` and `ocx-haiku-copilot` — that are identical to the existing `ocx-default` (Anthropic) and `ocx-copilot` (GitHub Copilot) profiles respectively, except every agent model is set to haiku. Currently `headwrench` and `context-insurgent` use sonnet in those profiles; in the new haiku profiles, they use haiku instead.

## Acceptance Criteria

- `files/profiles/haiku/opencode.jsonc` exists with all 7 agents on `anthropic/claude-haiku-4-5`
- `files/profiles/haiku/ocx.jsonc` exists (identical to `files/profiles/default/ocx.jsonc`)
- `files/profiles/haiku-copilot/opencode.jsonc` exists with all 7 agents on `github-copilot/claude-haiku-4.5`
- `files/profiles/haiku-copilot/ocx.jsonc` exists (identical to `files/profiles/copilot/ocx.jsonc`)
- `registry.jsonc` registers `ocx-haiku` and `ocx-haiku-copilot` with correct file paths and `ocx-bundle` dependency
- `bun run build` succeeds and both new components appear in `dist/index.json`

## Key Context

**Source profiles to mirror:**
- `haiku` mirrors `files/profiles/default/` — Anthropic provider, all `anthropic/*` model IDs
- `haiku-copilot` mirrors `files/profiles/copilot/` — GitHub Copilot provider, all `github-copilot/*` model IDs

**Agent model mapping (source → haiku version):**
- `haiku`: all agents → `anthropic/claude-haiku-4-5` (headwrench and context-insurgent change from `anthropic/claude-sonnet-4-6`)
- `haiku-copilot`: all agents → `github-copilot/claude-haiku-4.5` (headwrench and context-insurgent change from `github-copilot/claude-sonnet-4.6`)

**Everything else stays identical:** `autoupdate`, `small_model`, `plugin`, `default_agent`, disabled agents (`plan`, `general`, `explore`), all 4 MCP servers, and `ocx.jsonc`.

## DAG Shape

1A (Linear) — no gates or loops. Four sequential nodes:
1. `create-profile-files` — Write both profile directories (parallel @JuniorDev × 2)
2. `register-profiles` — Add both entries to `registry.jsonc` (@JuniorDev)
3. `build-verify` — Run `bun run build`, confirm output (HW direct)
4. `finalize` — Close session, persist to memory

## Constraints

- Do not modify any existing profile files
- File structure under `files/profiles/haiku/` and `files/profiles/haiku-copilot/` must exactly match `ocx.jsonc` + `opencode.jsonc`
- Registry component names: `ocx-haiku` and `ocx-haiku-copilot`
