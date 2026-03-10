# Session: session-context-plugin

**Goal**: Replace the session-compaction plugin with a new session-context plugin that injects the active session's `spec.json` and the opencode session ID into the system prompt on every turn. Add `/activate-session` and `/deactivate-session` slash commands to manage which session plan is active per opencode session.

---

## Done Criteria

- [x] `opencode/plugins/session-compaction.ts` is deleted
- [x] `opencode/plugins/session-context.ts` exists and uses `experimental.chat.system.transform` to inject the opencode session ID + active session's `spec.json` into every system prompt
- [x] Plugin registers `activate_session` and `deactivate_session` tools; module-level state tracks `currentSessionID` set by the transform hook
- [x] `.opencode/session-ids/<sessionID>/active-session.json` is the metadata file format written by the tools
- [x] `opencode/commands/activate-session.md` exists — lists sessions, user picks one, calls `activate_session` tool
- [x] `opencode/commands/deactivate-session.md` exists — calls `deactivate_session` tool
- [x] Plugin TypeScript compiles without errors (`bun run typecheck` or equivalent)
- [x] Changes committed to `simple-rewrite` branch
- [x] **User sign-off**: user has tested `/activate-session` and `/deactivate-session` live in new opencode sessions targeting this session plan, and confirmed the injected block appears/disappears correctly — session is NOT complete until user explicitly signs off

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Delete session-compaction.ts; implement session-context.ts plugin — CodeWriter / standard |
| 02 | ✅ completed | Write activate-session.md and deactivate-session.md slash commands — DocWriter / fast |
| 03 | ✅ completed | Type-check plugin; verify command files; commit — HeadWrench / direct (session stays open pending user sign-off) |

---

## Current Focus

**All subtasks complete. User signed off 2026-03-10. Session closed.**

---

## Scope

**In scope**:
- `opencode/plugins/session-compaction.ts` — delete
- `opencode/plugins/session-context.ts` — create (new plugin)
- `opencode/commands/activate-session.md` — create (new command)
- `opencode/commands/deactivate-session.md` — create (new command)
- `.opencode/session-ids/` — new runtime directory, created by activate-session command

**Out of scope**:
- `opencode/opencode.json` — no changes needed (local plugins are auto-loaded)
- `opencode/package.json` — no new dependencies needed
- Any existing commands, agents, or protocols
- Any session plan files

---

## Patterns & Constraints

- Local plugins in `opencode/plugins/` are auto-loaded by opencode — no config changes needed
- The plugin hook is `experimental.chat.system.transform` — fires every turn; receives `{ sessionID, model }` in input
- Metadata file path: `.opencode/session-ids/<sessionID>/active-session.json` — contains `{ "sessionName": "<name>" }`
- Plugin maintains module-level `currentSessionID` — set by `experimental.chat.system.transform` hook on every turn; read by `activate_session` and `deactivate_session` tools
- The `activate_session(sessionName)` and `deactivate_session()` tools are registered by the plugin; they resolve the session ID internally — HW never passes it
- Commands are pure UX wrappers: `/activate-session` lists sessions + calls the tool; `/deactivate-session` just calls the tool
- Injected block format:
  ```
  ## Active Session State
  OpenCode Session ID: <sessionID>
  Active Plan: <sessionName>   ← only present if active session is set
  <spec.json content as JSON block>   ← only present if active session is set
  ```
- If metadata file is missing or unreadable, plugin injects sessionID only — no error thrown
- All TypeScript in plugin must use `@opencode-ai/plugin` package (already a dep in `opencode/package.json`)
- Branch: `simple-rewrite`
- Circuit breaker: 3 consecutive failures
- Architect: disabled
