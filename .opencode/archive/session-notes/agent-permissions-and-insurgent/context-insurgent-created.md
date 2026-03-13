# ContextInsurgent Agent Created

**Subtask:** 01
**Date:** 2026-03-10

## What Was Done

Created `opencode/agents/subagents/context-insurgent.md` — a new deep-exploration subagent.

Registered in `opencode/opencode.json` under `"subagents/context-insurgent": { "model": "github-copilot/claude-sonnet-4.6" }`.

## Key Properties

- `steps: 20` (more than ContextScout's 12 — allows deeper multi-step exploration)
- `color: "#f59e0b"` (amber, distinct from ContextScout's cyan `#06b6d4`)
- `sequential-thinking: allow` — can use the sequential thinking MCP
- `task: deny` — no delegation chains
- `edit: deny`, `write: deny` — fully read-only
- `question: allow` is NOT present — agent cannot ask user; HW asks on its behalf ("ask-only" pattern)
- Bash: restricted allowlist (cat/ls/find/grep/rg/head/tail/wc only)

## Ask-Only Pattern

"Ask-only" is enforced at the HeadWrench instruction level, NOT via permissions frontmatter. HW is instructed to use the `question` tool before each ContextInsurgent invocation. ContextInsurgent itself has no `question` permission.

## Distinction from ContextScout

| Property | ContextScout | ContextInsurgent |
|----------|-------------|-----------------|
| Model | claude-haiku-4.5 (fast) | claude-sonnet-4.6 (standard) |
| steps | 12 | 20 |
| Sequential thinking | No | Yes |
| Use case | Quick situational awareness pre-planning | Deep multi-file analysis, root cause, pattern tracing |
| Ask-only | No | Yes |
