<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Subtask 03 — Harden Debug Planning Workflow Prompts + Embedded Session Artifact Templates

## Objective

Apply strictness language standards to all 5 debug planning workflow node prompts AND to the embedded session artifact content inside `debug/finalize.md`. The embedded content is especially critical: `finalize.md` contains inline templates for the generated `verify.md`, `diagnose.md`, `fix.md`, and optionally `hypothesis-gate.md` — these templates must use the strictest possible language, particularly for the fix→verify loop which must specify exact verification steps, "execute exactly once," and strict loop-back behavior with no agent discretion.

## Scope

- **Edit:** all files in `opencode/planning/debug/`:
  - `bug-intake.md`
  - `context-gather.md`
  - `hypothesis-form.md`
  - `confirm-mode.md`
  - `finalize.md` — including the embedded `verify.md`, `diagnose.md`, `fix.md`, and `hypothesis-gate.md` template content within it
- **Write:** nothing new
- **Excluded:** all files outside `opencode/planning/debug/`

## Constraints

- Read `opencode/planning/plan-design-guidelines.md` first — specifically the "Prompt Strictness Standards" section. Use it as the canonical reference.
- Read each target file before editing it.
- Do NOT restructure file content. Preserve all existing sections, headings, and ordering.
- Do NOT add new top-level sections. Do NOT remove sections. Only update language within existing sections.
- `finalize.md` is terminal — update its own Advance section to use `close_session()`, not `next_step()`.
- The embedded `verify.md` template content inside `finalize.md` is the highest-priority target. It MUST conform to the verification node strictness pattern:
  - "Execute ONLY the following steps, in order, exactly once"
  - Explicit pass/fail criteria with a single action for each outcome
  - "Do NOT attempt to fix anything here — call `next_step()` exactly once and stop"
- The embedded `diagnose.md` template content must be strict about what the agent writes to `fix.md` and when it loops vs. advances.
- The embedded `hypothesis-gate.md` template content (if present) must apply the gate node strictness pattern: present, wait, do not advance without explicit user response.
- `confirm-mode.md` is a gate/question node — it must wait for explicit user response before advancing.

## Todolist

1. Read `opencode/planning/plan-design-guidelines.md` — locate and internalize the "Prompt Strictness Standards" section.
2. Read all 5 files in `opencode/planning/debug/`.
3. Edit `bug-intake.md` — harden Constraints and Advance sections.
4. Edit `context-gather.md` — harden Constraints and Advance sections.
5. Edit `hypothesis-form.md` — harden Constraints and Advance sections.
6. Edit `confirm-mode.md` — apply gate node strictness: present question, wait for response, do not advance without explicit user answer.
7. Edit `finalize.md`:
   a. Harden the planning node's own Constraints section.
   b. Update the embedded `verify.md` template to use full verification node strictness: exact steps, exactly once, strict pass/fail actions, no extra actions.
   c. Update the embedded `diagnose.md` template to use loop node strictness: exactly one action set, write to `fix.md`, then call `next_step()` exactly once.
   d. Update the embedded `hypothesis-gate.md` template (if present) to use gate node strictness.
   e. Update the embedded `fix.md` template to clearly prohibit the agent from running tests or verifying — verification is `verify.md`'s job only.
   f. Update finalize.md's own Advance to use `close_session()`.

## Delegation

**Agent:** HW (direct)
**Reason:** The embedded template content inside `finalize.md` requires complex judgment about what exact strictness language to embed — the inline content must be coherent as a standalone generated artifact while also being correct according to the strictness standards. This is too high-stakes and nuanced for a haiku model.

## Advance

Call `next_step()` NOW. Do this exactly once. Do NOT read session files or DAG state to determine whether to advance. Do NOT take any other action before or after calling `next_step()`.
