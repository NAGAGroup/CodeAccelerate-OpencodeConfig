# Subtask 02 — Fix Session & Context Path Detection

## Delegation
- **Agent:** CodeWriter
- **Model tier:** Standard (gpt-5.3-codex)
- **Reason:** Targeted search-and-replace on known incorrect path segments. Clear spec, no design decisions needed.

---

## Objective
Correct the `sessionsDir`, `contextDir`, and `globalContextDir` constants in the plugin factory so they point to the actual locations of session plans and context files. After this fix, `findActiveSession` must be able to locate an active session and read its `index.md` and `notes/`.

---

## Pre-conditions
- Subtask 01 audit findings must be approved (`notes/audit-findings.md` exists and gate was passed)
- The correct value of `directory` (repo root vs `opencode/` subdir) must be confirmed from the type definition audit

---

## Todolist

### 1. Confirm `directory` value (from subtask-01 findings)
- [ ] Read `notes/audit-findings.md` — find the confirmed value of `directory` in the Plugin factory
- [ ] **Confirmed:** `directory` = project repo root → sessions are at `join(directory, ".opencode", "sessions")`
- [ ] The plugin's existing `.opencode` segment in `sessionsDir` is therefore **correct** — sessions live at `.opencode/sessions/` at the project root
- [ ] The fix needed is elsewhere (context paths and the `contextDir` segment — see below)

### 2. Verify `sessionsDir` — likely already correct
- [ ] In `session-compaction.ts` line 67: `const sessionsDir = join(directory, ".opencode", "sessions")`
- [ ] Confirmed correct: `.opencode/sessions/` exists at the project root
- [ ] No change needed — but add a confirming comment:
  ```ts
  // Sessions live at .opencode/sessions/ at the project root (confirmed)
  const sessionsDir = join(directory, ".opencode", "sessions")
  ```

### 3. Fix `contextDir`
- [ ] Line 68: `const contextDir = join(directory, ".opencode", "context")`
- [ ] Verify: does `.opencode/context/` exist, or is it `opencode/context/`?
- [ ] Check `opencode/commands/context-add.md` to confirm the path used by the `/context-add` command
- [ ] Apply whichever path is confirmed:
  ```ts
  // If context lives at .opencode/context/ (same convention as sessions):
  const contextDir = join(directory, ".opencode", "context")
  
  // If context lives at opencode/context/ (inside the opencode config subdir):
  const contextDir = join(directory, "opencode", "context")
  ```

### 4. Verify `globalContextDir`
- [ ] Lines 69–73: `globalContextDir` uses `XDG_CONFIG_HOME || ~/.config` + `opencode/context`
- [ ] This is for globally shared context (cross-project) — it is likely correct as-is
- [ ] Confirm by checking if `opencode/commands/context-add.md` documents a global context path
- [ ] If the path is correct, add a comment confirming it: `// Global context: ~/.config/opencode/context/ (XDG_CONFIG_HOME)`
- [ ] If wrong, fix it and document the correct location

### 5. Improve `findActiveSession` sort (low-priority fix)
- [ ] Line 58: replace alphabetical sort with creation-date sort using `spec.json`:
  ```ts
  // BEFORE (alphabetical — wrong for multi-session scenarios)
  return sessions.sort().reverse()[0] || null
  
  // AFTER (sort by spec.created descending — most recent active session)
  return sessions.sort((a, b) => {
    try {
      const aSpec = JSON.parse(readFileSafe(join(sessionsDir, a, "spec.json")))
      const bSpec = JSON.parse(readFileSafe(join(sessionsDir, b, "spec.json")))
      return new Date(bSpec.created).getTime() - new Date(aSpec.created).getTime()
    } catch {
      return 0
    }
  })[0] || null
  ```
- [ ] Note: `spec.json` was already parsed in the filter above — this is a second parse, which is acceptable for small session counts

### 6. Sanity-check: verify the sessions dir exists at the confirmed path
- [ ] After editing, read the plugin back and verify the paths look correct visually
- [ ] Check that `.opencode/sessions/audit-session-compaction-plugin/spec.json` exists (it should — we just created it)

**Test command (manual check):**
```bash
ls .opencode/sessions/
# Should show: audit-session-compaction-plugin
```

### 7. Update notes
- [ ] Write `.opencode/sessions/audit-session-compaction-plugin/notes/path-fix.md`
- [ ] Document: which paths were confirmed correct, which needed fixing, and which `directory` value was confirmed from type defs

---

## Scope
- **Edit:** `opencode/plugins/session-compaction.ts` — lines 67–73 only (path constants)
- **Read:** `.opencode/sessions/audit-session-compaction-plugin/notes/audit-findings.md`
- **Write:** `.opencode/sessions/audit-session-compaction-plugin/notes/path-fix.md`
- **Excluded:** Do not touch the hook, event handler, or tool in this subtask

---

## Patterns
```ts
✅ GOOD — confirm correct path with a comment, only change what is actually wrong
const sessionsDir = join(directory, ".opencode", "sessions")
// ^ .opencode/sessions/ at project root — confirmed correct

❌ BAD — changing more than the path constants in one subtask
// Don't also refactor findActiveSession's logic in the same edit
```

---

## Constraints
- Only touch the three path constants and the `findActiveSession` sort — nothing else
- If the `directory` value is ambiguous after checking type defs, default to **Case A** (repo root) since `directory` in most plugin systems refers to the project working directory, and add a `TODO` comment

---

*At the end of this subtask, follow the checkpoint protocol: `protocols/checkpoint.md`*
