# Getting Started

## Install

Install OCX:

```sh
curl -fsSL https://ocx.kdco.dev/install.sh | sh
ocx init --global
ocx registry add https://ocx-registry.nagagroup.workers.dev --name naga-group --global
```

## Profile

Pick a profile and install it globally. Five options — choose based on your model provider and preference:

```sh
ocx profile add naga --global --source naga-group/ocx-default              # Anthropic (sonnet + haiku)
ocx profile add naga-haiku --global --source naga-group/ocx-haiku          # Anthropic (haiku only)
ocx profile add naga-copilot --global --source naga-group/ocx-copilot      # GitHub Copilot (sonnet + haiku)
ocx profile add naga-haiku-copilot --global --source naga-group/ocx-haiku-copilot # GitHub Copilot (haiku only)
ocx profile add naga-free --global --source naga-group/ocx-free            # OpenCode Zen free-tier
```

## API Keys

What each profile requires:
- **naga** — Anthropic API key (`ANTHROPIC_API_KEY`)
- **naga-haiku** — Anthropic API key (`ANTHROPIC_API_KEY`)
- **naga-copilot** — GitHub Copilot subscription (no API key needed)
- **naga-haiku-copilot** — GitHub Copilot subscription (no API key needed)
- **naga-free** — Nothing required; uses OpenCode Zen free-tier models

## Run

Launch with your chosen profile:

```sh
ocx oc -p naga
# or: ocx oc -p naga-haiku
# or: ocx oc -p naga-copilot
# or: ocx oc -p naga-haiku-copilot
# or: ocx oc -p naga-free
```

Run this from any project directory — the profile is picked up automatically.

## Git Setup

Add the following to your project's `.gitignore` to keep OpenCode planning artifacts out of version control:

```gitignore
# Ignore OpenCode session plans and DAG state
.opencode/**

# Keep project-specific OpenCode config (if you have one)
!.opencode/opencode.jsonc
!.opencode/opencode.json
```

Session plans, DAG state, and agent logs live under `.opencode/` and are ephemeral — they shouldn't be committed.
