# Subtask 01 — Analyze Plugin Code vs Documented Behavior

## Delegation
- **Agent:** CodeWriter (read-only mode — no edits in this subtask)
- **Model tier:** Standard (gpt-5.3-codex)
- **Reason:** Systematic line-by-line audit requiring careful reading of both the plugin source and installed type definitions. No architectural decisions needed yet — just evidence gathering.

---

## Objective
Produce a complete bug inventory for `session-compaction.ts`. Every identified issue must have: a line reference, a root-cause description, and a proposed fix direction. This audit is the source of truth for subtasks 02–04.

---

## Todolist

### 1. Audit the session path
- [ ] Read `opencode/plugins/session-compaction.ts` lines 66–68
- [ ] Confirm: `join(directory, ".opencode", "sessions")` — is `.opencode` the right segment?
- [ ] Check the actual config root: `opencode/` is the directory containing `opencode.json`, `plugins/`, `sessions/`, etc.
- [ ] Confirm the correct path should be `join(directory, "opencode", "sessions")`
- [ ] Note: `directory` from the Plugin factory is the **project root** (where `opencode.json` is resolved from, one level up from `opencode/`)
- [ ] Also check: does opencode pass the `opencode/` subdirectory as `directory`, or the repo root? Read type definitions to confirm.

**Expected finding:** Path is wrong. Either `directory` is the repo root (fix: `join(directory, "opencode", "sessions")`) or `directory` is already `opencode/` (fix: `join(directory, "sessions")`). Must determine which.

### 2. Audit the context/globalContext paths
- [ ] Lines 68–73: `contextDir` and `globalContextDir`
- [ ] Same question: if `directory` is repo root, `contextDir` should be `join(directory, "opencode", "context")` not `join(directory, ".opencode", "context")`
- [ ] The global context path uses `XDG_CONFIG_HOME || ~/.config` + `opencode/context` — this looks correct for global config. Verify against `opencode/commands/context-add.md` if it documents the path.

### 3. Audit the `@opencode-ai/plugin` type definitions
- [ ] Read `opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` (or equivalent — glob for `.d.ts` files under `node_modules/@opencode-ai/plugin/`)
- [ ] Find the `Plugin` type signature — what does the factory receive? Does `directory` exist?
- [ ] Find the tool `execute` context type — does `context.sessionID` exist?
- [ ] Find the `event` handler type — what is the shape of `session.idle`? What properties does it have?
- [ ] Find `experimental.session.compacting` hook signature — confirm `output.context` is `string[]`

**Test command:**
```bash
find opencode/node_modules/@opencode-ai/plugin -name "*.d.ts" | head -20
```

### 4. Audit the compaction hook output
- [ ] Line 134: `output.context.push(blocks.join("\n\n---\n\n"))`
- [ ] Confirm `output.context` is `string[]` — pushing one big joined string vs multiple entries
- [ ] Check if there's a size/format expectation (e.g. does the compaction model expect structured markdown?)
- [ ] Verify: is the hook async-safe? Can it `await` anything? (it currently doesn't need to, but good to check)

### 5. Audit the async relay pattern
- [ ] Lines 139–169: `event` handler
- [ ] Check `(event as any).properties?.sessionID` — what is the actual event payload shape from type defs?
- [ ] If `session.idle` doesn't carry `sessionID`, the entire relay is broken — pending map never gets consumed
- [ ] Lines 186–192: `compact` tool `execute` — `context.sessionID` — confirm this exists on the context type
- [ ] If `sessionID` is absent from context, the `pendingCompactions.set(context.sessionID, ...)` call silently registers under `undefined` and the event handler never matches

### 6. Audit the `findActiveSession` sort logic
- [ ] Line 58: `sessions.sort().reverse()[0]`
- [ ] This sorts alphabetically and takes the last. For typical session names (e.g. `audit-session-compaction-plugin`), alphabetical is not the same as most recently created
- [ ] A better approach: sort by `spec.json` `created` field
- [ ] Document this as a reliability risk (not necessarily a bug if there's only one active session, but worth noting)

### 7. Write the audit report
- [ ] Write findings to `.opencode/sessions/audit-session-compaction-plugin/notes/audit-findings.md`
- [ ] Format: one section per issue, with line numbers, root cause, severity (critical/medium/low), and proposed fix direction
- [ ] Do NOT make any edits to `session-compaction.ts` in this subtask

---

## Scope
- **Read:** `opencode/plugins/session-compaction.ts`
- **Read:** `opencode/node_modules/@opencode-ai/plugin/dist/**/*.d.ts` (type definitions)
- **Read:** `opencode/commands/context-add.md`, `opencode/commands/context-list.md`
- **Write:** `.opencode/sessions/audit-session-compaction-plugin/notes/audit-findings.md` (new file — the audit report)
- **Excluded:** No edits to `session-compaction.ts` in this subtask

---

## Patterns
```
✅ GOOD — write findings to notes, not directly to the plugin
❌ BAD  — edit session-compaction.ts during the analysis pass

✅ GOOD — note.md section: "Issue: Wrong sessionsDir path (line 67) | Severity: Critical | Fix: verify .opencode/sessions is the correct target"
❌ BAD  — vague note: "the path seems wrong"
```

---

## Constraints
- This subtask is **read-only for the plugin file**
- Do not speculate — base every finding on evidence from the source or type defs
- If a type definition file cannot be found, document that uncertainty explicitly

---

## [🚫 GATE]
After completing this subtask and writing `notes/audit-findings.md`, **stop and show the findings to the user**. Do not proceed to subtask-02 until the user has reviewed and approved the bug inventory.

---

*At the end of this subtask, follow the checkpoint protocol: `protocols/checkpoint.md`*
