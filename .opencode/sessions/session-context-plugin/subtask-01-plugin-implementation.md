# Subtask 01 — Plugin Implementation

## Delegation
- **Agent:** CodeWriter
- **Model tier:** standard (github-copilot/claude-sonnet-4.6)
- **Reason:** TypeScript plugin implementation with multiple interacting systems (file I/O, plugin hook API, custom tool registration, module-level state). Requires judgment about graceful fallbacks and correct hook usage. Standard tier for quality.

---

## Objective

Delete the old `session-compaction.ts` plugin and implement a new `session-context.ts` plugin. The plugin does two things:

**1. System prompt injection** (`experimental.chat.system.transform` hook):
- Fires every turn; receives `input.sessionID`
- Stores `sessionID` in module-level state (`let currentSessionID`)
- Reads `.opencode/session-ids/<sessionID>/active-session.json` to find the active session name
- If found: injects sessionID + session name + spec.json content into system prompt
- If not found: injects sessionID only
- All file I/O wrapped in try/catch — silent failure, never throws

**2. Session management tools** (`tool` hook):
- Registers two tools that HW (or any agent) can call:
  - **`activate_session({ sessionName: string })`**: reads `currentSessionID` from module state, creates `.opencode/session-ids/<sessionID>/` directory if needed, writes `active-session.json` with `{ "sessionName": sessionName }`
  - **`deactivate_session({})`**: reads `currentSessionID` from module state, removes `active-session.json`
- Tools use `currentSessionID` set by the system transform hook — HW never needs to know or pass the session ID

---

## Todolist

### 1. Read existing plugin and package
- [ ] Read `opencode/plugins/session-compaction.ts` in full (to understand imports, plugin structure, `definePlugin` usage, and `tool` hook patterns)
- [ ] Read `opencode/package.json` to confirm `@opencode-ai/plugin` is available and check exact package version

### 2. Delete old plugin
- [ ] Delete `opencode/plugins/session-compaction.ts`

### 3. Implement session-context.ts
- [ ] Create `opencode/plugins/session-context.ts` with:
  - Module-level state: `let currentSessionID: string | undefined = undefined`
  - `experimental.chat.system.transform` hook (see system prompt injection spec in Constraints)
  - `tool` hook registering `activate_session` and `deactivate_session` (see tool spec in Constraints)

### 4. Verify structure
- [ ] Read the created file to verify correctness
- [ ] Confirm injected block format, tool signatures, and error handling all match the spec

---

## Scope
- **Delete:** `opencode/plugins/session-compaction.ts`
- **Write:** `opencode/plugins/session-context.ts`
- **Read:** `opencode/plugins/session-compaction.ts` (before deleting), `opencode/package.json`
- **Excluded:** `opencode/opencode.json`, all other files

---

## Patterns
```
✅ GOOD — Module-level let currentSessionID; set in transform hook, read by tools
✅ GOOD — Uses definePlugin from @opencode-ai/plugin
✅ GOOD — Wraps all file I/O in try/catch with silent failure
✅ GOOD — Always injects sessionID; conditionally injects spec.json
✅ GOOD — Uses fs/promises (async) for file reads
✅ GOOD — process.cwd() to resolve project root (opencode runs from project root)
✅ GOOD — Tools return a success/failure message string for HW to display
❌ BAD  — Throwing errors from within any hook handler or tool
❌ BAD  — Blocking/synchronous file I/O
❌ BAD  — Tool asking HW to pass the session ID as a parameter
❌ BAD  — Importing anything not in opencode/package.json
❌ BAD  — Modifying opencode.json or package.json
```

---

## Constraints

### System prompt injection format
When active session is set, push a single string to `output.system`:
```
## Active Session State
OpenCode Session ID: <sessionID>
Active Plan: <sessionName>

\`\`\`json
<spec.json content>
\`\`\`
```
When no active session is set (or sessionID is undefined), push only:
```
OpenCode Session ID: <sessionID>
```
(If `input.sessionID` is undefined, push `"OpenCode Session ID: (unknown)"`.)

### File paths
- Metadata file: `<cwd>/.opencode/session-ids/<sessionID>/active-session.json`
- Metadata format: `{ "sessionName": "<name>" }`
- Spec file: `<cwd>/.opencode/sessions/<sessionName>/spec.json`

### Tool: activate_session
- Parameter: `{ sessionName: string }` — the plan to activate (e.g. `"my-session-name"`)
- Behavior:
  1. Read `currentSessionID` from module state; if undefined, return error message
  2. Create directory `<cwd>/.opencode/session-ids/<currentSessionID>/` (mkdir recursive)
  3. Write `active-session.json`: `{ "sessionName": sessionName }`
  4. Return success message: `"Activated session plan '<sessionName>' for opencode session <currentSessionID>"`
- Wrap in try/catch; return error message string on failure (do not throw)

### Tool: deactivate_session
- Parameters: none (`{}`)
- Behavior:
  1. Read `currentSessionID` from module state; if undefined, return error message
  2. Delete `<cwd>/.opencode/session-ids/<currentSessionID>/active-session.json` (use `fs.unlink`, ignore ENOENT)
  3. Return success message: `"Deactivated session for opencode session <currentSessionID>"`
- Wrap in try/catch; return error message string on failure (do not throw)

### General
- Use Node.js built-in `fs/promises` — no third-party file I/O libraries
- TypeScript must compile without errors (uses same tsconfig as existing plugin)
- Do NOT add `session-context` to `opencode/opencode.json` plugin array — auto-loaded as a local file

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
