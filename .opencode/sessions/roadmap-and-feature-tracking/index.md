# Session: roadmap-and-feature-tracking

**Goal:** Create a visible feature tracking system — a `ROADMAP.md` at the repo root for humans, and a context pointer so agents reference it during future planning sessions.

---

## Done Criteria

- [ ] `ROADMAP.md` exists at repo root with a clear template structure (categories, status indicators, placeholder rows)
- [ ] `.opencode/context/navigation.md` references `ROADMAP.md` so ContextScout reads it during `/plan`
- [ ] Both files committed to `main`

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | 🔲 pending | Write `ROADMAP.md` template at repo root — DocWriter / fast |
| 02 | 🔲 pending | Update `.opencode/context/navigation.md` to reference `ROADMAP.md` — DocWriter / fast |

---

## Gates

_No gates — this is a low-risk documentation session._

---

## Current Focus

**Planning complete.** Awaiting user `start` to begin execution.

Next: Subtask 01 — Write `ROADMAP.md` template.

---

## Scope

**In scope:**
- `ROADMAP.md` — new file at repo root
- `.opencode/context/navigation.md` — add reference to ROADMAP.md

**Out of scope:**
- Populating ROADMAP.md with actual feature entries (template/structure only)
- Modifying any agent files, protocols, or plugin code
- Editing any other context files beyond `navigation.md`

---

## Patterns & Constraints

- ROADMAP.md is a human-facing document — clear, scannable Markdown only
- Status indicators must be consistent with existing project emoji conventions (🔲 / ▶️ / ✅ / ❌)
- navigation.md update must be additive only — no existing content removed
- Branch: `main`
- Circuit breaker: 3 consecutive failures
- Architect: disabled
