# Subtask 04 — Fix the Compact Tool Async Relay Pattern

## Delegation
- **Agent:** CodeWriter
- **Model tier:** Standard (gpt-5.3-codex)
- **Reason:** The async relay is a subtle concurrency pattern — it must be verified against the actual type definitions confirmed in subtask-01. All the evidence is already in `notes/audit-findings.md`; this is pure implementation.

---

## Objective
Make the `compact` tool reliably trigger `client.session.summarize` after tool execution completes. There are two possible failure modes to fix:

1. **Key mismatch:** `context.sessionID` in `execute()` is `undefined` — the pending map entry is stored under `undefined`, and the `session.idle` event handler can never find it
2. **Event payload mismatch:** `(event as any).properties?.sessionID` is the wrong path to the session ID in the `session.idle` event — the handler extracts `undefined` and the pending entry is never consumed

Both produce the same symptom: compaction is queued but never fires.

---

## Pre-conditions
- Subtask 03 is complete
- `notes/audit-findings.md` section on "async relay pattern" confirms the actual property names from type definitions

---

## Todolist

### 1. Confirm `context.sessionID` from type defs (subtask-01 findings)
- [ ] Read `notes/audit-findings.md` — find the confirmed type of the `execute` context parameter
- [ ] The type is from `@opencode-ai/plugin` — look for the `ToolContext` or `ExecuteContext` interface
- [ ] **If `sessionID` exists:** no change needed for the `execute()` side — proceed to step 3
- [ ] **If `sessionID` is absent or differently named:**
  - Find the correct property name (e.g. `session`, `id`, `sessionId`)
  - Update line 189: `pendingCompactions.set(context.sessionID, ...)` to use the correct property
  - If `sessionID` truly does not exist on context, explore alternatives:
    - Does `client` provide a way to get the current session ID?
    - Is there a different tool execution context available?
    - Document findings and apply the best available fix

### 2. Confirm `session.idle` event payload shape (subtask-01 findings)
- [ ] Read `notes/audit-findings.md` — find the confirmed shape of the `session.idle` event
- [ ] Current code: `(event as any).properties?.sessionID`
- [ ] The actual path may be:
  - `event.sessionID` (flat)
  - `event.properties.sessionID`
  - `event.properties.session_id`
  - `event.metadata?.sessionID`
  - Something else entirely
- [ ] **If the correct path is confirmed:** update line 142 to remove the `as any` cast and use the typed path:
  ```ts
  // BEFORE (untyped guess)
  const sessionId = (event as any).properties?.sessionID
  
  // AFTER (typed, using confirmed property path)
  const sessionId = event.sessionID  // or whatever the correct path is
  ```
- [ ] **If `session.idle` carries no session ID at all:** the relay pattern cannot work as designed. Document this and see step 6 (fallback design).

### 3. Verify the key used in `pendingCompactions` matches in both directions
- [ ] The `compact` tool registers: `pendingCompactions.set(context.SESSION_ID_PROP, ...)`
- [ ] The event handler reads: `pendingCompactions.get(EVENT_SESSION_ID_PROP)`
- [ ] These two values **must be the same string** for the same session
- [ ] Write a comment in the code documenting this invariant:
  ```ts
  // KEY INVARIANT: The key used here must match what session.idle provides.
  // tool execute() uses: context.sessionID
  // event handler uses: (event as any).properties?.sessionID
  // Both confirmed against @opencode-ai/plugin@1.2.21 type defs in subtask-01.
  ```

### 4. Add a timeout / cleanup to prevent stale pending entries
- [ ] If a session ends without firing `session.idle`, the pending map leaks an entry
- [ ] Add a 30-second cleanup timeout when registering:
  ```ts
  const timeoutId = setTimeout(() => {
    if (pendingCompactions.has(sessionId)) {
      pendingCompactions.delete(sessionId)
      // Compaction was queued but session.idle never fired — silent cleanup
    }
  }, 30_000)
  
  pendingCompactions.set(sessionId, {
    reason: args.reason || "checkpoint",
    resolve: () => clearTimeout(timeoutId),
  })
  ```
- [ ] Call `pending.resolve()` after `pendingCompactions.delete(sessionId)` in the event handler to clear the timeout

### 5. Improve the compact tool return message
- [ ] The current return message says `Path: .opencode/sessions/*/index.md` — this is correct. Verify it was not accidentally broken.
- [ ] Also add: after compaction, what the agent should do first (re-read index.md)

### 6. Fallback design: if `session.idle` cannot provide session ID
- [ ] **Only needed if step 2 confirms session ID is unavailable in the event**
- [ ] Alternative relay strategy: use a single pending flag instead of a per-session map
  ```ts
  let pendingCompactionReason: string | null = null
  
  // In compact tool execute():
  pendingCompactionReason = args.reason || "checkpoint"
  
  // In event handler:
  if (event.type !== "session.idle") return
  if (!pendingCompactionReason) return
  const reason = pendingCompactionReason
  pendingCompactionReason = null
  await client.session.summarize(...)  // no session ID needed if client infers it
  ```
- [ ] This is less precise (would compact *any* idle session) but works if session.summarize infers the current session
- [ ] Only implement this fallback if the typed approach is impossible

### 7. Add logging for successful relay completion
- [ ] After `client.session.summarize` succeeds, log at info level:
  ```ts
  await client.app.log({
    body: {
      service: "session-compaction",
      level: "info",
      message: `Compaction completed for session ${sessionId}. Reason: ${pending.reason}`,
    },
  })
  ```
- [ ] This makes it possible to verify the relay works during the integration test (subtask-05)

### 8. Write notes
- [ ] Write `.opencode/sessions/audit-session-compaction-plugin/notes/compact-tool.md`
- [ ] Document: confirmed property names, the key invariant, and whether the fallback was needed

---

## Scope
- **Edit:** `opencode/plugins/session-compaction.ts` — `event` handler (lines 139–169) and `compact` tool `execute` (lines 186–204)
- **Read:** `.opencode/sessions/audit-session-compaction-plugin/notes/audit-findings.md`
- **Write:** `.opencode/sessions/audit-session-compaction-plugin/notes/compact-tool.md`
- **Excluded:** Do not touch `findActiveSession`, path constants, or the compaction hook

---

## Patterns
```ts
✅ GOOD — document the key invariant explicitly in code
// KEY INVARIANT: tool registers key X, event handler reads key X — must match

❌ BAD — assuming the property name without checking type defs
const sessionId = (event as any).properties?.sessionID  // unverified guess

✅ GOOD — cleanup timeout prevents map leak
const timeoutId = setTimeout(() => pendingCompactions.delete(sessionId), 30_000)

❌ BAD — no cleanup, pending map grows unbounded
pendingCompactions.set(sessionId, { reason, resolve: () => {} })
```

---

## Constraints
- Do not remove the async relay pattern entirely — it solves a real deadlock problem
- If `sessionID` is unavailable, prefer the single-flag fallback over scrapping the relay
- Keep all error paths silent (catch and log, never throw)

---

## [🚫 GATE]
After this subtask, **stop and present a `git diff` of all changes across subtasks 02–04** to the user. The user must review and approve before the integration test runs. This is the last chance to catch regressions before restarting opencode.

---

*At the end of this subtask, follow the checkpoint protocol: `protocols/checkpoint.md`*
