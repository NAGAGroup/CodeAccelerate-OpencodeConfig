<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: ocx-docs-update

## Goal

Update README.md and docs/ to replace the old git clone / symlink / copy installation model with OCX-based distribution. The config is now distributed via the Naga Group OCX registry with three profile choices (naga, naga-copilot, naga-free). All docs must reflect the new install flow and correct file paths for post-install customization.

## What This Session Is

4 subtasks. No gate or loop nodes — all changes are reversible doc edits. Subtasks 01–03 can run in parallel (independent files); subtask 04 runs after (HW-direct scan of remaining docs).

Session artifacts live in: `.opencode/session-plans/ocx-docs-update/`

## OCX Install Flow (reference for all subtasks)

```sh
curl -fsSL https://ocx.kdco.dev/install.sh | sh
ocx init --global
ocx registry add https://ocx-registry.nagagroup.workers.dev --name naga-group --global

# Choose one profile:
ocx profile add naga --global --source naga-group/ocx-default         # Anthropic (paid)
ocx profile add naga-copilot --global --source naga-group/ocx-copilot # GitHub Copilot
ocx profile add naga-free --global --source naga-group/ocx-free       # OpenCode Zen free-tier models

# Launch with chosen profile:
ocx oc -p naga
ocx oc -p naga-copilot
ocx oc -p naga-free
```

## Profile Descriptions

- **naga** (`ocx-default`) — Anthropic Claude models (paid API)
- **naga-copilot** (`ocx-copilot`) — GitHub Copilot models
- **naga-free** (`ocx-free`) — OpenCode Zen free-tier models (not open-source; free-tier via OpenCode Zen)

## Post-Install Customization

Users customize their config by editing the installed profile files directly:
- `~/.config/opencode/profiles/<name>/opencode.jsonc` — models, MCP servers, agent behavior
- `~/.config/opencode/profiles/<name>/ocx.jsonc` — OCX registry settings

## Operating Instructions

- Execute subtasks in order (01 → 02 → 03 → 04)
- Subtasks 01–03 may be dispatched in parallel as @QuickDoc agents
- Subtask 04 is HW-direct: scan the three remaining docs, dispatch @QuickDoc only if stale references are found
- Do not skip subtasks — even if a file seems "probably fine," verify it explicitly

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
