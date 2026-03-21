<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 02 — Harden Generic Planning Workflow Prompts

## Objective

Apply the strictness language standards (defined in subtask-01) to all 9 generic planning workflow prompt files. Every file must have its Advance section, Constraints section, and any loop/gate behavior updated to match the strict patterns. The goal is that an executing agent reading any of these files has no ambiguity about what to do and what not to do.

## Scope

- **Edit:** all files in `opencode/planning/generic/`:
  - `session-overview.md`
  - `task-intake.md`
  - `clarify.md` (loop node)
  - `scout.md`
  - `synthesize.md`
  - `decompose.md`
  - `agent-routing.md`
  - `review-gate.md` (gate node)
  - `finalize.md` (terminal node)
- **Write:** nothing new
- **Excluded:** all files outside `opencode/planning/generic/`

## Constraints

- Read `opencode/planning/plan-design-guidelines.md` first — specifically the "Prompt Strictness Standards" section added in subtask-01. Use it as the canonical reference for all language changes.
- Read each target file before editing it.
- Do NOT restructure file content beyond language hardening. Preserve all existing sections, headings, and ordering.
- Do NOT add new sections. Do NOT remove sections. Only update language within existing sections.
- `clarify.md` is a loop node — apply the loop node strictness pattern verbatim: one action, call `next_step()` immediately, stop.
- `review-gate.md` is a gate node — apply the gate node strictness pattern: present, wait, do not advance without explicit user response.
- `finalize.md` is terminal — its Advance section must say "Call `close_session()` exactly once" not `next_step()`.
- Preserve the `<!-- DO NOT COMPACT THIS NODE -->` comment if already present in any file.

## Todolist

1. Read `opencode/planning/plan-design-guidelines.md` — locate and internalize the "Prompt Strictness Standards" section.
2. Read all 9 files in `opencode/planning/generic/`.
3. Edit `session-overview.md` — harden Advance section.
4. Edit `task-intake.md` — harden Constraints section and Advance section.
5. Edit `clarify.md` — apply full loop node strictness pattern to Constraints and Advance sections.
6. Edit `scout.md` — harden Constraints and Advance sections.
7. Edit `synthesize.md` — harden Constraints and Advance sections.
8. Edit `decompose.md` — harden Constraints and Advance sections.
9. Edit `agent-routing.md` — harden Constraints and Advance sections.
10. Edit `review-gate.md` — apply full gate node strictness pattern.
11. Edit `finalize.md` — harden Constraints; update Advance to use `close_session()`.

## Delegation

**Agent:** @JuniorDev
**Model:** haiku-like
**Prompt structure:**
- Read: `opencode/planning/plan-design-guidelines.md` (Prompt Strictness Standards section), then all 9 files in `opencode/planning/generic/`
- Goal: Harden language in all 9 files to match the strictness standards — strict Advance sections, prohibition-heavy Constraints, loop node guards on `clarify.md`, gate node guards on `review-gate.md`, `close_session()` terminal on `finalize.md`
- Constraints: Additive/replacement only within existing sections; no restructuring; no new sections; no removed sections
- Verify: Each file's Advance section contains "exactly once" language and prohibits reading session files; clarify.md explicitly states the agent does NOT determine loop/advance; review-gate.md explicitly states the agent waits for user response before calling `next_step()`

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
