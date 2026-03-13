# Final Plugin Design

**Date:** 2026-03-09

## What the plugin does

`opencode/plugins/session-compaction.ts` — a single `experimental.session.compacting` hook that fires on every auto-compaction.

### What it injects into `output.context`

1. **Active session plan** — reads `spec.json` for current subtask, reads `index.md` as master reference
2. **Session notes** — all `.md` files in the session's `notes/` directory
3. **Project context** — `.opencode/context/*.md|json`
4. **Global context** — `~/.config/opencode/context/*.md|json`
5. **Auto-resume instruction** — appended at the end:
   - Tells the agent NOT to wait for user input
   - Names the exact session, current subtask number and name
   - Includes the first 2000 chars of the current subtask spec file

### Key design decisions

- `findActiveSession()` sorts by `spec.json.created` timestamp (not alphabetically)
- All errors caught silently — hook never throws
- No `output.prompt` override (context injection is additive via `output.context.push`)
- No `compact` tool — removed after discovering `session.summarize` API couldn't be called reliably from plugin context; auto-compaction is sufficient
- `client` is used only for `app.log` (debug when no session found)

## What was tried and abandoned

- **Async relay via `session.idle`** — event never fired reliably
- **`session.promptAsync` with `/compact` text** — not interpreted as slash command
- **`session.command` with `"compact"`** — wrong command name
- **`session.command` with `"session.compact"`** — TUI-only event, server crashed with `command2.agent undefined`
- **`session.summarize` without body** — `providerID`/`modelID` required
- **`session.summarize` with body from last message** — may work but complex; abandoned in favor of no tool at all
