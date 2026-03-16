# USAGE.md Corrections — Subtask 03

## What was fixed
- Header "9 slash commands" → "11 slash commands"
- Added 3 missing command entries to the Quick Reference table:
  - `/context-audit` — audits permanent context files for staleness
  - `/quick-plan` — lightweight planning for small, well-understood tasks
  - `/session-status` — displays current session state and progress
- Added full documentation sections for all 3 commands, content sourced from actual command files
  - `/quick-plan` added as a top-level `##` section (same level as /plan, /amend)
  - `/context-audit` added as a `###` sub-section in the Context Commands group
  - `/session-status` added as a `###` sub-section in the Session Activation group
- Fixed "The three context commands…" → "The context commands…" (now 4, not 3)

## Pattern observed
Agent correctly identified an out-of-scope inconsistency ("three context commands") and flagged it rather than silently fixing it. HW applied the fix directly.
