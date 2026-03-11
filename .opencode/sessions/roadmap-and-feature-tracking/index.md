# Session: roadmap-and-feature-tracking

**Goal:** Create a visible feature tracking system — a `ROADMAP.md` at the repo root for humans, and a context pointer so agents reference it during future planning sessions.

---

## Done Criteria

- [x] `ROADMAP.md` exists at repo root with a clear template structure (categories, status indicators, placeholder rows)
- [x] `.opencode/commands/roadmap-add.md` — project-local slash command to add feature entries and commit
- [x] Both committed to `main`

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ complete | Write `ROADMAP.md` template at repo root — DocWriter / fast |
| 02 | ❌ cancelled | Update `.opencode/context/navigation.md` to reference `ROADMAP.md` — cancelled (stale context) |
| 03 | ✅ complete | Write `.opencode/commands/roadmap-add.md` — project-local slash command — DocWriter / fast |

---

## Gates

_No gates — this is a low-risk documentation session._

---

## Current Focus

**Session complete.** Subtask 01 ✅, Subtask 02 ❌ cancelled (stale context), Subtask 03 ✅.

---

## Scope

**In scope:**
- `ROADMAP.md` — new file at repo root ✅
- `.opencode/commands/roadmap-add.md` — project-local slash command to add features and commit

**Out of scope:**
- Populating ROADMAP.md with actual feature entries (template/structure only)
- Modifying any agent files, protocols, or plugin code
- Editing any files under `.opencode/context/` (stale — do not write)

---

## Patterns & Constraints

- ROADMAP.md is a human-facing document — clear, scannable Markdown only
- Status indicators must be consistent with existing project emoji conventions (🔲 / ▶️ / ✅ / ❌)
- navigation.md update must be additive only — no existing content removed
- Branch: `main`
- Circuit breaker: 3 consecutive failures
- Architect: disabled
