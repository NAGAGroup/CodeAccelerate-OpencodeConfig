# Subtask 05 — Integration Test

## Delegation
- **Agent:** HeadWrench (user-driven manual test — no code changes expected)
- **Model tier:** N/A (procedural checklist)
- **Reason:** Testing requires restarting opencode and observing behaviour live. This cannot be automated — the user must perform the restart and observe the post-compaction state.

---

## Objective
Verify that after the fixes in subtasks 02–04, the plugin correctly injects session context into every compaction event. The test must confirm three things:

1. The plugin **loads without errors** after the restart (no crash on startup)
2. The `compact` tool **triggers compaction** that actually fires (async relay works)
3. The session plan and notes **survive the compaction** (injected context is present post-compaction)

---

## Pre-conditions
- Gate after subtask-04 was passed (user reviewed the diff)
- All changes are saved to `opencode/plugins/session-compaction.ts`
- opencode is not currently running (or is about to be restarted)

---

## Todolist

### Phase A — Startup verification

- [ ] **A1. Restart opencode**
  - Quit the current opencode session
  - Restart: `opencode` (or however you normally launch it)
  - **Success criteria:** opencode starts without error. No "plugin failed to load" or "plugin threw during initialization" messages.
  - **Failure criteria:** Any crash, stack trace, or plugin error on startup → go to `protocols/debug.md`

- [ ] **A2. Verify `compact` tool is available**
  - In the new session, ask the agent: "what tools do you have available?"
  - OR attempt to call `compact` directly
  - **Success criteria:** `compact` tool appears in the tool list with its description
  - **Failure criteria:** Tool not found → the plugin registration is broken

### Phase B — Path verification (read-only check)

- [ ] **B1. Confirm `findActiveSession` resolves correctly**
  - Ask the agent: "Read `.opencode/sessions/audit-session-compaction-plugin/index.md` and tell me the current session status"
  - This is just a baseline — confirms the session files exist at the expected path
  - **Success criteria:** Agent reads the file successfully

- [ ] **B2. Simulate what the hook would read**
  - Ask the agent: "List the files in `.opencode/sessions/audit-session-compaction-plugin/`"
  - Confirm `index.md`, `spec.json`, `notes/`, `protocols/` are present
  - **Success criteria:** All session files visible at the path the hook will use

### Phase C — Compact tool relay test

- [ ] **C1. Call the `compact` tool manually**
  - Ask the agent to call: `compact` with reason "integration test subtask 05"
  - **Expected immediate response:** "Compaction queued for session [id]. It will execute after this tool call completes."
  - **Success criteria:** Tool returns the queued message without error

- [ ] **C2. Observe the compaction log message**
  - After the tool call completes, watch for the info log: "Compaction completed for session [id]. Reason: integration test subtask 05"
  - If opencode has a log viewer, check it. Otherwise, look for any compaction-related output.
  - **Success criteria:** Log message appears (confirms relay fired and `client.session.summarize` completed)
  - **Failure criteria:** No log after 10 seconds → relay did not fire. See `protocols/debug.md`.

### Phase D — Context survival test (the real test)

- [ ] **D1. Set up a context-heavy session**
  - In a new opencode session (separate from this one), do the following before triggering compaction:
    - Confirm the session has: `index.md` readable, at least one note in `notes/`
    - Note the current subtask number in `spec.json`

- [ ] **D2. Fill context to trigger auto-compaction, or use `compact` tool**
  - Option A (auto): Send enough messages to fill the context window and trigger auto-compaction
  - Option B (manual): Call `compact` directly with reason "survival test"
  - **Success criteria:** Compaction event fires (look for the completion log from Phase C)

- [ ] **D3. Verify context survived**
  - After compaction, ask the agent: "What session are you working on, and what is the current subtask?"
  - **Success criteria (all must pass):**
    - Agent correctly identifies the session name: `audit-session-compaction-plugin`
    - Agent knows the current subtask number (from the injected `spec.json`)
    - Agent can describe the current subtask objective (from the injected subtask file)
    - Agent mentions session notes by name (confirms `notes/` was injected)
  - **Failure criteria:** Agent says "I don't have information about the current session" or gives wrong subtask → compaction hook is not working. See `protocols/debug.md`.

### Phase E — Wrap up

- [ ] **E1. Update `spec.json` status**
  - If all tests pass, update `spec.json`: `"status": "complete"`
  - Update `index.md` subtask table: all rows → `✅ done`

- [ ] **E2. Write final notes**
  - Write `.opencode/sessions/audit-session-compaction-plugin/notes/integration-test-results.md`
  - Document: what was tested, what passed, any edge cases observed, known remaining risks

- [ ] **E3. Commit the fix**
  - Follow `protocols/git.md` for the final commit
  - Commit message format: `fix(plugin): correct session path detection and compaction relay in session-compaction.ts`

---

## Success Criteria Summary

| Check | Expected |
|-------|----------|
| Plugin loads | No startup errors |
| `compact` tool available | Appears in tool list |
| Relay fires | Log: "Compaction completed for session..." |
| Session name survives | Agent identifies correct session |
| Current subtask survives | Agent knows correct subtask number |
| Notes survive | Agent can reference session notes |

---

## Failure Paths

| Symptom | Likely cause | Debug starting point |
|---------|-------------|----------------------|
| Plugin crash on startup | TypeScript error in edited code | Check for syntax errors; run `bun typecheck` if available |
| `compact` tool missing | Plugin export broken or not registered | Re-read plugin export structure |
| Relay doesn't fire | `session.idle` event key mismatch | Re-examine `notes/audit-findings.md` — event payload shape |
| Context not injected | Hook still reading wrong path, or `output.context` API changed | Add a log statement inside the hook to confirm it fires at all |
| Agent doesn't know subtask | `spec.json` not injected, or `currentSubtask` is 0 | Verify subtask 03 added spec injection |

See `protocols/debug.md` for the full debug loop.

---

## Scope
- **No code changes expected** in this subtask unless a test reveals a regression
- **Write:** `.opencode/sessions/audit-session-compaction-plugin/notes/integration-test-results.md`
- **Edit (if test passes):** `spec.json` status → `"complete"`, `index.md` subtask statuses → `✅ done`

---

## Patterns
```
✅ GOOD — test the actual survival of context, not just that the tool ran
"What session are you working on and what is the current subtask?" — asks the agent to demonstrate knowledge

❌ BAD — calling compact and considering it done without verifying context survived
// The relay firing is necessary but not sufficient — the hook must actually inject the right content
```

---

*At the end of this subtask, follow the checkpoint protocol: `protocols/checkpoint.md`*
