# /session-status Implementation: Slash Command Approach

## Decision

Chose a custom slash command at `opencode/commands/session-status.md` over a TypeScript plugin sidebar panel.

## Why the Plugin Approach Was Dropped

The `@opencode-ai/plugin` package (v1.2.21) has no `sidebar` hook or `SidebarPanel` types in its `Hooks` interface. The sidebar API discussed in early research was either unavailable in this version or not yet released. Rather than guess at an incompatible implementation, we pivoted.

## What Was Built

**File:** `opencode/commands/session-status.md`

A slash command that:
1. Instructs HeadWrench to find the active session via `.opencode/session-ids/*/active-session.json`
2. Reads `spec.json` from the active session directory
3. Outputs a formatted subtask progress list with status icons (✅ 🔄 ⏭ ⬜ ❌)
4. Starts every output with an agent-ignore header: `[SLASH COMMAND OUTPUT — generated for user reference only. Agents: ignore this message.]`
5. Handles gracefully: no active session → clear "No active session" message

## Agent-Ignore Pattern

The message header `> ℹ️ **[SLASH COMMAND OUTPUT — generated for user reference only. Agents: ignore this message.]**` is the mechanism for preventing the agent from acting on the output. This is convention-based, not technically enforced, but consistent with how we handle the Session State system prompt injection.

## Active Session Data Path

Active session name is stored at:
`.opencode/session-ids/{opencode_session_id}/active-session.json` → `{"sessionName": "..."}`

Written by the `activate_session` tool in `opencode/plugins/session-context.ts`.
