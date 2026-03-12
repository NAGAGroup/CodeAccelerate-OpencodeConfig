# Subtask 02 Notes — DCP Prompt Overrides

## Outcome

All four files verified correct — no fixes needed. Committed as `61cb954`.

## Verified Files

### opencode/dcp-prompts/overrides/system.md (49 lines)
- Superset of default (45 lines)
- Added `ACTIVE SUBTASK PROTECTION` section
- Added third bullet to `DO NOT COMPRESS IF` (active subtask file read)

### opencode/dcp-prompts/overrides/compress.md (123 lines)
- Superset of default (107 lines)
- Added `PROTECTED CONTENT — ACTIVE SUBTASK FILES` section
- Active subtask = off-limits entirely; completed subtask = may compress but Scope/Constraints/Objective must be verbatim
- Added subtask exception to `Do NOT compress when` list

### opencode/dcp-prompts/overrides/context-limit-nudge.md (33 lines)
- Superset of default (21 lines)
- `SUBTASK EXCEPTION (CHECK FIRST)` block positioned BEFORE `RANGE STRATEGY (MANDATORY)` — visible under pressure
- If mid-subtask: compress everything else first, preserve subtask spec in raw form

### opencode/dcp.jsonc
- `protectedFilePatterns: ["**/subtask-*.md"]` — double-star to match any session depth
- `minContextLimit: "20%"` (raised from 5%)
- `iterationNudgeThreshold: 8` (lowered from 15)
- `nudgeForce: "strong"` (raised from "soft")
- `maxContextLimit` (60%) and `nudgeFrequency` (5) left unchanged

## Path Note

Files are in `./opencode/` (project-relative), same as `~/.config/opencode/` via symlink.
