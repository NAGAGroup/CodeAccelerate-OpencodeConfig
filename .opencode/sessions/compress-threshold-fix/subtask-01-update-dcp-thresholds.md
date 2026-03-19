# Subtask 01 — Update dcp.jsonc Thresholds

## Delegation
- **Agent:** @session-local-implementer
- **Reason:** Simple targeted config edits to a JSONC file; implementation agent with read/edit/write is appropriate

---

## Objective

Update four threshold values in `~/.config/opencode/dcp.jsonc` to lower the context window trigger points so that compress fires earlier and with more buffer available. The changes are: `maxContextLimit` from `"60%"` to `"45%"`, `minContextLimit` from `"20%"` to `"15%"`, `nudgeFrequency` from `5` to `3`, and `iterationNudgeThreshold` from `8` to `5`. No other fields in the file may change.

> **Audience note:** This subtask file is read by HeadWrench. The operational content — file list, constraints, and todolist — is then passed to the assigned subagent as a self-contained task. The subagent has no awareness of session context beyond what is written here.

---

## Todolist

### 1. Read and edit dcp.jsonc
- [ ] Read `~/.config/opencode/dcp.jsonc` in full to confirm current values
- [ ] Change `compress.maxContextLimit` from `"60%"` to `"45%"`
- [ ] Change `compress.minContextLimit` from `"20%"` to `"15%"`
- [ ] Change `compress.nudgeFrequency` from `5` to `3`
- [ ] Change `compress.iterationNudgeThreshold` from `8` to `5`

### 2. Verify
- [ ] Re-read the file to confirm all four values are updated and no other fields changed
- [ ] Confirm all JSONC comments and formatting are preserved

---

## Scope
- **Edit:** `~/.config/opencode/dcp.jsonc`
- **Read:** `~/.config/opencode/dcp.jsonc`
- **Write:** none
- **Excluded:** Everything else — do not touch any other file

---

## Patterns
```
✅ GOOD — Edit only the four specified threshold fields using the Edit tool
✅ GOOD — Preserve all existing comments, formatting, and field order
❌ BAD  — Rewriting the whole file from scratch (risks losing comments/formatting)
❌ BAD  — Changing any field not explicitly listed above
❌ BAD  — Committing changes (HeadWrench owns all git commits)
```

---

## Constraints
- Only four fields change: `maxContextLimit`, `minContextLimit`, `nudgeFrequency`, `iterationNudgeThreshold`
- All JSONC comments and formatting must be preserved exactly
- Do NOT commit any files — HeadWrench owns all git commits
- Work only on the file specified in this subtask

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
