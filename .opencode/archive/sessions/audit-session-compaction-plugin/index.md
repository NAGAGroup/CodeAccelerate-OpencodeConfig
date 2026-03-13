# Session: audit-session-compaction-plugin

## Goal
Audit and fix `opencode/plugins/session-compaction.ts` so compaction is less lossy — essential context (session plan, notes, persistent context) must reliably survive every compaction event.

## Done Criteria
- [ ] Every known bug is documented with a root-cause explanation in `notes/audit-findings.md`
- [ ] `findActiveSession` resolves the correct path (`.opencode/sessions/`, not `opencode/sessions/`)
- [ ] The compaction hook correctly populates `output.context` with session plan, current subtask, notes, and persistent context
- [ ] The `compact` tool's async relay fires `client.session.summarize` reliably after the session goes idle
- [ ] `context.sessionID` availability confirmed; relay map key matches event payload key
- [ ] Integration test passes: restart opencode, trigger compaction, verify context survives

## Subtasks

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ completed | Analyze plugin code vs documented behavior |
| 02 | ✅ completed | Fix session path detection |
| 03 | ✅ completed | Verify and fix compaction hook implementation |
| 04 | ✅ completed | Fix compact tool async relay pattern |
| 05 | ✅ completed | Integration test |

> `[🚫 GATE]` items are non-negotiable stops requiring explicit user approval before proceeding.

---

## Gates

- **[🚫 GATE] After subtask-01 (analyze):** Review the full audit findings before any code is changed. The root causes must be understood and agreed on before fixes begin.
- **[🚫 GATE] After subtask-04 (fix-compact-tool):** Review all changes as a diff before the manual test. Confirm nothing introduces regressions (e.g. crash on startup, broken tool schema).

---

## Current Focus

- **Session COMPLETE** — all 5 subtasks finished successfully.
- Integration test passed on 2026-03-09. See `notes/integration-test-results.md` for details.

---

## Scope

### In scope
- `opencode/plugins/session-compaction.ts` — the only file being changed
- Session storage path detection (XDG data dir vs config dir)
- `experimental.session.compacting` hook — `output.context` population
- `session.idle` event handler — async relay correctness
- `compact` tool — `context.sessionID` availability, relay registration

### Out of scope
- `opencode/opencode.json` (config) — do not change unless absolutely required
- Any agent `.md` files
- The DCP plugin (`@tarquinen/opencode-dcp`)
- Adding new features beyond what the plugin already promises

---

## Key Research Findings (Pre-loaded)

1. **Wrong session path:** The plugin reads `join(directory, ".opencode", "sessions")` — this was assumed to be wrong, but `.opencode/sessions/` is actually the correct location. Sessions live at `.opencode/sessions/` at the project root. The bug is that the plugin uses `directory` (which opencode sets to the project root) correctly, but the `.opencode` segment was previously thought to be wrong. Confirmed correct target: `join(directory, ".opencode", "sessions")`. Additionally, opencode stores its own session transcripts in `~/.local/share/opencode/` (XDG data dir) — that is a different, internal format and is not what the plugin should read.

2. **`output.context` is additive:** The `experimental.session.compacting` hook receives `output` with a `.context` array. `output.context.push(str)` is the correct API — ✓ already used. The content and format may need tuning.

3. **`session.idle` event payload:** The event type is `session.idle` but `(event as any).properties?.sessionID` is an assumption — the actual property key is unconfirmed. This is a risk.

4. **`context.sessionID` in tool execute:** The `context` parameter type from `@opencode-ai/plugin@1.2.21` may or may not expose `sessionID`. This must be verified against the installed type definitions.

---

## Patterns & Constraints

- **Never use `process.cwd()`** — use `directory` from the plugin factory args; it is the project root
- **Never write to disk** from the compaction hook — it is read-only (building context strings only)
- **No new dependencies** — the plugin uses only `fs` and `path` from Node stdlib
- **TypeScript strict-ish** — avoid `as any` casts unless unavoidable and comment why
- **Plugin must not throw** — all errors must be caught silently; a crashing plugin breaks opencode startup
- **Path resolution:** sessions live at `join(directory, ".opencode", "sessions")` — i.e. `.opencode/sessions/` at the project root. The plugin's existing path segment `.opencode` is correct; the bug was elsewhere.
