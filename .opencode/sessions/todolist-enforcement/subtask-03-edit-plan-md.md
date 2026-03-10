# Subtask 03 — Edit plan.md (Conditional)

## Delegation
- **Agent:** CodeWriter
- **Model tier:** fast
- **Reason:** Small, targeted edit to a single markdown file (if needed at all). Fast tier is sufficient for a minor update.

---

## Objective

**This subtask is conditional.** If subtask 01 analysis determined that `plan.md` needs changes, apply them now. If subtask 01 determined no changes are needed, **skip this subtask** (mark as skipped in `spec.json` and `index.md` and proceed to G1).

The likely scenario: `plan.md` does NOT need changes because the new subtask todos and checkpoint todos are created at *execution start* (when the user says "start"), not during *planning* (Phase 7). Phase 7 already correctly handles the session summary todo creation. However, if subtask 01 identified a gap or inconsistency, address it here.

If changes ARE needed, apply them to `/home/jack/CodeAccelerate-OpencodeConfig/opencode/commands/plan.md`.

---

## Todolist

### 1. Check subtask 01 findings
- [ ] Review the subtask 01 analysis result for plan.md findings
- [ ] If "no changes needed" — mark this subtask skipped, proceed to gate review

### 2. Apply changes (only if needed)
- [ ] Read `/home/jack/CodeAccelerate-OpencodeConfig/opencode/commands/plan.md` in full
- [ ] Apply the specific changes identified in subtask 01
- [ ] Read the edited file to verify changes are correct

### 3. Gate
- [ ] 🚫 GATE — User reviews all edits to `headwrench.md` and `plan.md` before proceeding to commit. Present diffs and wait for explicit approval.

---

## Scope
- **Edit:** `opencode/commands/plan.md` (only if changes needed)
- **Read:** `opencode/commands/plan.md`
- **Write:** Nothing new
- **Excluded:** `headwrench.md`, protocol files, all other files

---

## Patterns
```
✅ GOOD — Applying only the specific changes identified in subtask 01
✅ GOOD — Skipping cleanly if no changes needed
❌ BAD  — Making speculative or unrequested changes
❌ BAD  — Editing any file other than plan.md
```

---

## Constraints
- Only apply changes explicitly identified in subtask 01 analysis
- Do not edit headwrench.md or any protocol file
- If skipping, do not create any files

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
