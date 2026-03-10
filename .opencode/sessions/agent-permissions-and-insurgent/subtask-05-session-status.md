# Subtask 05 — /session-status Plugin Sidebar Panel

## Delegation
- **Agent:** @CodeWriter
- **Model tier:** standard (github-copilot/claude-sonnet-4.6)
- **Reason:** TypeScript plugin implementation. Real API discovery required — plugin must read `spec.json`, handle missing-session gracefully, and expose a sidebar panel. CodeWriter with standard tier appropriate for judgment under uncertainty.

---

## Objective

Build a TypeScript plugin at `opencode/plugins/session-status.ts` that exposes a **sidebar panel** showing the current session's subtask progress list. The panel reads from the active session's `spec.json` and renders each subtask with its status.

### Approved Spec (from Gate G1)

**What to display:**
- List of all subtasks in the session with their status (done ✅ / in_progress 🔄 / pending 🔲)
- Graceful empty state when no active session is running (don't error — show "No active session")

**What NOT to display:**
- Session name/goal (already visible in the running todo item HW maintains)
- Circuit breaker state, git status — out of scope

**Plugin location:** `opencode/plugins/session-status.ts`

**Data source:** `.opencode/sessions/{name}/spec.json` — read the `subtasks` array and `currentSubtask` field. The active session name comes from the session activation metadata (check how `activate_session` tool writes its state file — likely `.opencode/active-session` or similar).

---

## Todolist

### 1. Discover the plugin API and active session data location
- [ ] Read `opencode/plugins/` directory — what plugins already exist? Use them as reference for structure/imports
- [ ] Find where `activate_session` writes its state — grep for "active" or "active-session" in `.opencode/`
- [ ] Read the OpenCode plugin type definitions if available (check `node_modules/@opencode-ai/plugin` or similar)

### 2. Implement the plugin
- [ ] Create `opencode/plugins/session-status.ts`
- [ ] Read active session name from the activation state file
- [ ] Read `spec.json` from the active session directory
- [ ] Expose a `sidebar` hook returning a panel with subtask status items
- [ ] Handle gracefully: no active session, missing spec.json, malformed JSON

### 3. Register the plugin (if needed)
- [ ] Check if `opencode.json` needs a new entry for this plugin, or if plugins in `opencode/plugins/` are auto-discovered

### 4. Verify
- [ ] TypeScript type-check: `npx tsc --strict --target ES2022 --module ESNext --moduleResolution bundler --noEmit opencode/plugins/session-status.ts` (or equivalent for the project's tsconfig)
- [ ] Confirm the plugin file is valid TypeScript with no type errors

---

## Scope
- **Write:** `opencode/plugins/session-status.ts` (new file)
- **Edit:** `opencode/opencode.json` only if plugin registration is required
- **Read:** Existing plugin files in `opencode/plugins/`, `.opencode/` for activation state location, `node_modules` for plugin type defs
- **Excluded:** Agent files, protocol files, session files (other than reading spec.json at runtime)

---

## Patterns
```
✅ GOOD — Read spec.json from disk; render subtask list as sidebar items
✅ GOOD — Return empty/placeholder panel if no active session (don't throw)
✅ GOOD — Model after existing plugins in opencode/plugins/ for correct import/export shape
❌ BAD  — Calling OpenCode internal APIs not exposed by the plugin package
❌ BAD  — Crashing the sidebar if spec.json is missing or malformed
❌ BAD  — Adding session name/goal to the panel (user said: not needed, HW todo covers that)
```

---

## Constraints
- If the sidebar API does not exist or is unavailable in the plugin package, **do not guess** — document what was found, note the blocker, and stop. HeadWrench will surface this to the user.
- TypeScript type-check is mandatory before declaring done
- Plugin must handle all error/missing-file cases gracefully (no uncaught exceptions)
- Only show subtask list — do not scope-creep into session metadata display

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
