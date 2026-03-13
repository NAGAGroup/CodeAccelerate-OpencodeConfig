# Session Note: /roadmap-add Command

**Date:** 2026-03-10
**Subtask:** 03 — Write .opencode/commands/roadmap-add.md

## What Was Built

`.opencode/commands/roadmap-add.md` — project-local slash command for adding features to ROADMAP.md.

Key behavior:
- Mode A: args (`/roadmap-add planned "name — desc"`, multiple features supported)
- Mode B: interactive (asks for features + section when no args)
- Preview before commit; always confirms before `git commit`
- Commit format: `roadmap: add <feature-name>` / `roadmap: add N features`
- Error handling: invalid section names, missing separator, git errors

## Notable Detail

DocWriter added an error-handling section covering invalid section names, missing ` — ` separator, and git errors. Not in the spec but a good addition.

## Committed

`feat: add /roadmap-add command and finalize session plan` (f2ca160)
