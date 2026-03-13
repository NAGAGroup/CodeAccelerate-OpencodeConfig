# Protocol: Debug

## Loop

```
Explore → Hypothesize → Fix → Retest
```

### 1. Explore
- Read the exact error message in full — do not paraphrase
- Locate the relevant lines in `opencode/plugins/session-compaction.ts`
- Delegate to `@explorer` for fast codebase search if needed
- Check `notes/audit-findings.md` — has this been seen before?

### 2. Hypothesize
- Form a single specific hypothesis: "I believe X is failing because Y"
- Write the hypothesis to `.opencode/sessions/audit-session-compaction-plugin/notes/debug-<date>.md`
- Do not fix multiple things at once — test one hypothesis per iteration

### 3. Fix
- Apply the minimal change that tests the hypothesis
- Delegate to `@CodeWriter` for implementation
- Do not refactor or clean up during a debug iteration

### 4. Retest
- Re-run the failed test (see `build-test.md`)
- If fixed: commit, update notes, continue
- If not fixed: return to step 1 with new information

---

## Circuit Breaker

**After 3 consecutive failed fix attempts on the same error — stop.**

Do not attempt a 4th fix. Instead:
1. Write everything known to `notes/debug-blocked.md`:
   - The original error
   - All 3 hypotheses tried
   - What each fix changed
   - Why each fix didn't work
2. Surface the problem to the user with the full notes content
3. Wait for user direction

The circuit breaker threshold for this session is **3** (set in `spec.json`).

---

## Common failure modes for this plugin

### Plugin crash on startup
- Cause: TypeScript/syntax error, missing import, or unhandled exception in the plugin factory
- Check: run `npx tsc --noEmit` first (see `build-test.md`)
- Check: does `@opencode-ai/plugin` export `tool` correctly? See `node_modules/@opencode-ai/plugin/dist/`

### `compact` tool not found
- Cause: Plugin not registered, wrong export name, or tool schema validation failure
- Check: Is `SessionCompactionPlugin` exported as `default`?
- Check: Is the plugin file path correct in `opencode.json`? (currently loaded via local file, not npm)

### Relay never fires (compaction queued but not executed)
- Cause: `session.idle` event payload mismatch or `context.sessionID` mismatch
- Check: Add `client.app.log` inside the event handler to confirm `event.type` is being seen at all
- Check: Log the full event object to see its actual shape:
  ```ts
  await client.app.log({ body: { service: "session-compaction", level: "info", message: JSON.stringify(event) } })
  ```

### Hook fires but context not injected
- Cause: `sessionsDir` still wrong, or `findActiveSession` returns null
- Check: Add logging inside the hook to confirm `activeSession` resolves:
  ```ts
  await client.app.log({ body: { service: "session-compaction", level: "info", message: `activeSession: ${activeSession}, sessionsDir: ${sessionsDir}` } })
  ```
  *(Note: the hook is async so logging is possible, but avoid logging in production — remove after debugging)*
