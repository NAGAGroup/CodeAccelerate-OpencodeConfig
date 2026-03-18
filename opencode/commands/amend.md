---
description: "Safely amend an active session plan with state-aware rules, protected completed work, and mandatory delegation recalculation after structural changes."
agent: headwrench
---

Amend the active session plan as follows: $ARGUMENTS

Follow `~/.config/opencode/protocols/session-plan-schema.md` and `~/.config/opencode/protocols/checkpoint.md`. Follow `~/.config/opencode/protocols/session-plan-schema.md` and `~/.config/opencode/protocols/checkpoint.md`.

## 1) Pre-Amend Context Load (Mandatory)

Before proposing any edits, load all current session state:

1. Read `.opencode/sessions/{active-session}/index.md`
2. Read `.opencode/sessions/{active-session}/spec.json`
3. Resolve `spec.json.currentSubtask`, then read the corresponding `subtask-NN-{name}.md` file

Do not amend blindly. You must understand:
- Current execution position
- Completed vs pending subtask boundaries
- Whether a subtask is currently `in_progress`
- Existing delegation entries in subtask files

## 2) Classify Requested Changes Before Editing

Classify each requested change into one of these safety categories.

### A. May change freely
- Session goal wording / descriptions
- Scope text (`in-scope` / `out-of-scope`)
- Non-structural constraints and pattern wording
- Clarifications in pending subtask objectives/todolists that do not alter ordering

### B. May change with recalculation
- Insert/remove/reorder pending subtasks
- Rename subtask title/slug requiring filename updates
- Change delegation assignments in subtask `## Delegation`
- Add/remove gate checkpoints inside todolists

When this category is used, recompute all impacted indices/IDs and keep `index.md`, subtask files, and `spec.json` synchronized.

### C. Must not change
- Completed subtask files (where matching `spec.json.subtasks[*].status == "completed"`)
- Completed subtask todo checkboxes/history
- `spec.json.currentSubtask` by manual overwrite

`currentSubtask` may only move through valid recalculation caused by structural edits (see Section 5).

> **Exception:** Adding retroactive session notes (files in `.opencode/sessions/{name}/notes/`) is always permitted even after session completion, as notes are historical records, not session plan artifacts.

## 3) In-Progress Session Safety Rules

- If any subtask is `in_progress`, pause active execution before editing plan artifacts.
- Never edit completed subtask files.
- Pending subtasks may be added, removed, split, merged, or reordered.
- If a request conflicts with protected state, stop and ask for explicit user decision with a safe alternative.

## 4) Gate Convention Rules

Gates are represented as `[🚫 GATE]` items in the **preceding subtask's Todolist** (and explained in relevant gate text), not as standalone executable subtask rows.

Do **not** create synthetic standalone task rows that behave like normal subtasks for gates.

## 5) `spec.json` Recalculation Rules (Required)

After any structural amendment:

1. Recompute `subtaskCount` (non-gate executable subtasks only).
2. Re-index subtask IDs/order consistently across `index.md`, filenames, and `spec.json.subtasks`.
3. Recalculate `currentSubtask` to keep pointing to the same logical in-progress/next executable work.

Critical rule:
- If subtasks are inserted/removed **before** the previous `currentSubtask` position, adjust `currentSubtask` by the same positional delta.
- Never set `currentSubtask` directly to an arbitrary value.

## 6) Subtask File Management Rules

- **Add subtask** → create `subtask-NN-{name}.md` with required schema sections.
- **Remove subtask** → delete its `subtask-NN-{name}.md` file.
- **Reorder subtasks** → rename files so `NN` prefixes match new order.
- Keep filename slug and `spec.json.subtasks[*].name` aligned.
- Preserve mandatory checkpoint footer in every remaining/created subtask file.

## 7) Mandatory Delegation Re-Run After Structural Changes

After **any** structural change (add/remove/reorder/rename subtasks, or changing delegation assignments), delegation routing must be re-applied.

Required procedure:
1. Load the `agent-delegation-expert` skill using the **`skill` tool**.
2. Apply its routing/model-tier rules to all affected subtasks.
3. Write updated assignments into each affected subtask file under `## Delegation`.

This is mandatory, not optional. Do not invoke it as a subagent.

## 8) Checkpoint Protocol Awareness

If amendment changes protocol-level settings (for example `circuitBreakerThreshold` or checkpoint behavior assumptions), call out explicitly that this impacts **all remaining subtasks** and checkpoint handling going forward.

## 9) Confirmation Diff Before Any Writes (Mandatory)

Before editing files, present a structured preflight diff summary and wait for explicit user confirmation.

Use this format:

- **Add**: list of files to create
- **Modify**: list of files to edit + concise reason per file
- **Delete**: list of files to remove
- **Reindex impact**: old vs new subtask ordering and `currentSubtask` recalculation result
- **Delegation rerun impact**: which subtasks will get refreshed `## Delegation`

Only write files after user approval.

## 10) Execution Order

1. Load context (Section 1)
2. Classify requested changes (Section 2)
3. Validate in-progress safety (Section 3)
4. Present confirmation diff (Section 9) and obtain approval
5. Apply file edits with schema compliance
6. Recalculate `spec.json` indices/counts/current pointer
7. Re-run delegation via `skill` tool (Section 7)
8. Commit the amended changes: `git commit -m 'amend: {session-name} — {brief description of amendment}'`. This is an amendment commit, not a WIP commit.
9. Return concise amendment report with what changed and why
