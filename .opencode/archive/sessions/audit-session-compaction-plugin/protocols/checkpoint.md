# Protocol: Checkpoint

Run this at the end of every subtask, before moving to the next one.

## Steps

### 1. Git WIP commit
Stage and commit all changes with a WIP marker:
```
git add -A
git commit -m "wip: subtask-NN — <short description of what was done>"
```
If nothing changed (e.g. analysis-only subtask), skip but still note it.

### 2. Update index.md subtask status
Mark the completed subtask as done in the table:
```
| 01 | ✅ done    | Analyze plugin code vs documented behavior |
```
Update `spec.json` → increment `currentSubtask` by 1.

### 3. Write notes
Write any concept-specific findings to `.opencode/sessions/audit-session-compaction-plugin/notes/`.
- One concept per file
- Filename: `<concept>.md` (e.g. `audit-findings.md`, `path-fix.md`, `compact-tool.md`)
- Include: what was discovered, what was changed, why, and any open questions

### 4. Inbox
Write any pattern/convention observations to `.opencode/inbox/` for the user to review later.
Format: `<date>-<topic>.md`

### 5. Continue
Begin the next subtask per `index.md`.
If a `[🚫 GATE]` follows the completed subtask — **stop here** and surface findings to the user. Do not continue until you have explicit approval.

---

## WIP Commit Format
```
wip: subtask-01 audit findings written
wip: subtask-02 path constants fixed
wip: subtask-03 hook updated with spec injection and current subtask
wip: subtask-04 relay key invariant fixed and timeout added
```
