<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session Overview — v2.1.0 Release

## Goal

Ship the v2.1.0 release of the CodeAccelerate-OpencodeConfig OCX registry. This involves writing the `[2.1.0]` CHANGELOG entry covering all user-facing changes since v2.0.0 (commit `695d9a98bcabacbcc623ee057c1c6f23c1277692`), bumping the registry version in `registry.jsonc`, and verifying the build passes.

## What This Session Is

3 sequential subtasks. No loop nodes. No gate nodes.

- **Subtask 01** — Write the `[2.1.0]` section in `CHANGELOG.md`
- **Subtask 02** — Bump `registry.jsonc` version from `2.0.0` → `2.1.0`
- **Subtask 03** — Run `bun run build` and verify `dist/index.json` reflects `2.1.0`

## Session Files

`.opencode/session-plans/v2.1.0-release/`

## Context

- Baseline: `CHANGELOG.md` at HEAD matches the v2.0.0 content exactly — no resurrection needed, just add the new section on top
- Comparison commit: `695d9a98bcabacbcc623ee057c1c6f23c1277692` (tagged `v2.0.0`)
- Changelog format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) — sections: Added, Changed, Fixed, Removed
- Filter out internal housekeeping commits (chore: archive, plan: add session …) — only document user-facing changes
- Version comparison links at the bottom of `CHANGELOG.md` need to be updated to include the `[2.1.0]` comparison

## Operating Instructions

- Execute subtasks in order. Do not skip.
- Each subtask prompt contains the full objective, scope, constraints, and todolist.
- Do not implement work outside the stated scope of each subtask.

## Advance

Read this overview once, internalize it, then call `next_step()` immediately.
