# Session: compress-threshold-fix

**Goal:** Fix compress + auto-compaction failures on Copilot models by lowering context thresholds in dcp.jsonc and rewriting the context-limit-nudge prompt to prefer multiple smaller compressions instead of one large range.

---

## Done Criteria

- [x] `dcp.jsonc` updated: `maxContextLimit` → `"45%"`, `minContextLimit` → `"15%"`, `nudgeFrequency` → `3`, `iterationNudgeThreshold` → `5`
- [x] `context-limit-nudge.md` override rewritten: "ONE LARGE range" mandate removed; replaced with prefer-multiple-small-compressions instruction
- [x] Verification protocol written to `.opencode/inbox/compress-fix-verification.md`
- [x] Single final commit made: `feat: complete session — compress-threshold-fix`

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | ✅ complete | Update dcp.jsonc thresholds — @session-local-implementer |
| 02 | ✅ complete | Rewrite context-limit-nudge.md + write verification protocol — @session-local-implementer |

---

## Scope

**In scope:**
- `~/.config/opencode/dcp.jsonc` — threshold value changes only
- `~/.config/opencode/dcp-prompts/overrides/context-limit-nudge.md` — full rewrite of range strategy section
- `.opencode/inbox/compress-fix-verification.md` — new file (verification checklist)

**Out of scope:**
- `compress.md` override — no changes
- `system.md` override — no changes
- `turn-nudge.md` / `iteration-nudge.md` — no changes
- Model-specific overrides — not applicable
- Any `.opencode/` session or agent files beyond inbox

---

## Patterns & Constraints

- Do NOT change any field in `dcp.jsonc` except the four specified thresholds
- Preserve all YAML/JSONC comments and formatting in `dcp.jsonc`
- Keep the subtask protection exception in `context-limit-nudge.md` unchanged
- Keep the urgency ("MUST compress NOW") in `context-limit-nudge.md` unchanged
- Git: single final commit only — no WIP commits between subtasks
- Circuit breaker: 3 consecutive failures → escalate to user

---

## Current Focus

Session complete. All done criteria met.
