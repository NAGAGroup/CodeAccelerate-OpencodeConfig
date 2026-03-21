<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 04 — Scan and Fix Remaining Docs

## Objective

Read `docs/planning.md`, `docs/agents.md`, and `docs/commands.md`. Check each for stale installation-specific references, path references to the old config location, or any mentions of git clone / symlink / copy. Fix any found. These files are expected to be mostly clean — but verify explicitly before declaring done.

## Scope

- **Read + conditionally edit:** `docs/planning.md`, `docs/agents.md`, `docs/commands.md`
- If edits are needed, dispatch @QuickDoc per file (one per file, in parallel if multiple need editing)
- If no edits are needed for a file, note it as confirmed clean

## Constraints

- Do not make cosmetic or unrelated changes — only fix stale installation/path references
- Stale references to watch for:
  - `~/.config/opencode/opencode.json` (old path)
  - `git clone`, `ln -s`, `cp -r` (old install instructions)
  - Any reference to "this repository" implying the user has the repo locally
- If a file has no stale references, it needs no edit
- `docs/commands.md` references `.opencode/session-plans/` — this is project-scope and correct; leave it
- `docs/planning.md` references `.opencode/session-plans/` — correct; leave it

## Todolist

- [ ] Read `docs/planning.md` — note any stale references found (or confirm clean)
- [ ] Read `docs/agents.md` — note any stale references found (or confirm clean)
- [ ] Read `docs/commands.md` — note any stale references found (or confirm clean)
- [ ] For each file with stale references: dispatch @QuickDoc to fix; for clean files: no action
- [ ] Verify any @QuickDoc edits are accurate before accepting

## Delegation

**Agent:** HW (direct)
**Reason:** Scan-first-then-conditionally-edit pattern across three files; HW reads and judges whether edits are needed, then dispatches @QuickDoc instances in parallel for any files that require changes.

## Advance

Call `next_step()` when this subtask is complete — the DAG will detect it is terminal and prompt you to call `close_session()`.
