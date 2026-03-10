# Session: rewrite-user-docs

**Goal:** Delete all 5 stale documentation files (which describe the old tech_lead/junior_dev system) and write 4 accurate new user-facing docs for the current HeadWrench-based config.

---

## Done Criteria

- [x] All 5 stale files are removed: `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`, `docs/DOCUMENTATION_MAINTENANCE.md`
- [x] 4 new files are written: `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`
- [x] New docs accurately describe the current system (HeadWrench, subagents, sessions, skills, commands)
- [x] New docs are targeted at new users of this config
- [x] All changes committed as a final clean commit on `simple-rewrite` branch

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ done | Delete 5 stale documentation files — **HeadWrench / direct** |
| 02 | ✅ done | Write new `FEATURES.md` — **@DocWriter / fast (haiku-4.5)** |
| 03 | ✅ done | Write new `docs/CONCEPTS.md` — **@DocWriter / fast (haiku-4.5)** |
| 04 | ✅ done | Write new `docs/USAGE.md` — **@DocWriter / fast (haiku-4.5)** |
| 05 | ✅ done | Write new `README.md` — **@DocWriter / fast (haiku-4.5)** |
| G1 | ✅ done | User reviews all 4 new docs before final commit |
| 06 | ✅ done | Final session commit — **HeadWrench / direct** |

---

## Gates

### G1 — Review New Docs

**Stop condition:** All 4 new documentation files have been written.

**Required approval:** User reads the 4 new files and confirms they are accurate, complete, and ready to commit. Any corrections needed are handled here before the commit is made.

---

## Current Focus

**Status: COMPLETED** — All subtasks done. Final commit `3f2bdd5` pushed to `simple-rewrite`.

---

## Scope

**In scope:**
- Delete: `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`, `docs/DOCUMENTATION_MAINTENANCE.md`
- Write: `README.md`, `FEATURES.md`, `docs/CONCEPTS.md`, `docs/USAGE.md`
- Final commit on `simple-rewrite` branch

**Out of scope:**
- Changes to `opencode/` config files (agents, commands, protocols, skills, plugins)
- Changes to `.opencode/` sessions or context
- Creating `docs/CONFIG-REFERENCE.md` (per Q&A decision)
- Any TypeScript or plugin changes

---

## Patterns & Constraints

- All new docs describe the **current** system: HeadWrench as primary orchestrator, 7 subagents, /plan + /continue + /amend + /inbox + context commands, agent-delegation-expert skill, DCP plugin, session workflow
- **Never** reference old system names: tech_lead, junior_dev, test_runner, explore (as agent), librarian, build agent, workflow-* commands, guardrails plugin, reflection prompts
- Audience is **new users** — tone should be clear, practical, not overly technical
- `docs/CONCEPTS.md` — high-level mental model only, no deep implementation details
- `docs/USAGE.md` — core commands (/plan, /continue, /amend, /inbox, context commands) with examples
- `FEATURES.md` — authoritative component inventory, source of truth, updated to current system
- `README.md` — last file written (links to the others); install step = copy `opencode/` to `~/.config/opencode/`; no `bun install` needed
- opencode.json / dcp.jsonc config options are NOT documented in user docs (publicly documented configs)
- Git: WIP commits after each subtask; final clean commit at session close
- Circuit breaker threshold: 3
- Architect: disabled
