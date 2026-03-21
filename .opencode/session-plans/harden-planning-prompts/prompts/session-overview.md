<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Session: harden-planning-prompts

## Goal

Harden all planning workflow prompt files and the session artifact templates they generate to use strict, directive, unambiguous language — eliminating soft/permissive instructions in favor of explicit "do this and only this" constraints.

## What This Session Is

4 sequential subtasks. No loop nodes. No gate nodes. All subtasks are markdown file edits.

Session files live in: `.opencode/session-plans/harden-planning-prompts/`

## Subtasks

1. **subtask-01 — Codify strictness language standards** (`@QuickDoc`)
   Edit `plan-design-guidelines.md` to add a canonical "Prompt Strictness Standards" section.

2. **subtask-02 — Harden generic planning workflow prompts** (`@JuniorDev`)
   Apply strictness standards to all 9 generic workflow prompt files.

3. **subtask-03 — Harden debug planning workflow prompts + embedded session artifact templates** (HW direct)
   Apply strictness to all 5 debug planning node prompts. Most critically: harden the embedded `verify.md`, `diagnose.md`, and `hypothesis-gate.md` content inside `debug/finalize.md`.

4. **subtask-04 — Harden collaborative + deep-research workflow prompts + embedded artifact templates** (HW direct)
   Apply strictness to both remaining workflows' node prompts and their `finalize.md` embedded artifact content.

## Operating Instructions

- Execute subtasks in order. Do NOT skip any subtask.
- Do NOT read session files to determine your current position — use `next_step()` to advance.
- Each subtask prompt is your complete instruction set for that subtask. Execute it fully before advancing.
- Subtask 01 must complete before 02, and both before 03 and 04 — the standards document is the reference for all subsequent edits.

## Advance

Read this overview exactly once, internalize it, then call `next_step()` immediately.
