# Subtask 04 — Task Sizing + Prompting Philosophy

## Delegation
**Agent:** @CodeWriter
**Model:** fast (claude-haiku) — additive documentation work with clear specifications; no complex judgment needed

---

## Objective

Document two delegation best practices that are currently absent from the system: (1) task sizing limits — a single delegation should not be oversized; use the task_id resubmit pattern to break large tasks into sequential slices using the same subagent session. (2) Prompting philosophy — HeadWrench should give subagents structured context + a clear goal, not micro-instructions. Add both to `session-plan-schema.md` and `headwrench.md`.

---

## Todolist

### 1. Read current state
- [ ] Read `~/.config/opencode/protocols/session-plan-schema.md` — check for any existing delegation sizing guidance
- [ ] Read `~/.config/opencode/agents/headwrench.md` — check delegation section and what-HW-doesnt-do section

### 2. Add task sizing + resubmit pattern to session-plan-schema.md
- [ ] Add a new section "## Delegation Sizing Guidelines" (or similar) near the subtask spec section with:
  - Rule: a single delegation should not exceed ~3 files or ~500 lines of new/modified content
  - Anti-pattern: asking DocWriter to write a 5000-word document in one task invocation
  - The task_id resubmit pattern: if a slot's work is too large, launch part 1, capture the `task_id` from the result, then resubmit to the same agent session for part 2, and so on
  - Example showing part 1 → resume with task_id → part 2 pattern
  - Note: resubmit is for sequential slicing only (when parts depend on each other). For independent parts, use parallel groups instead.

### 3. Add prompting philosophy to headwrench.md
- [ ] In `headwrench.md` delegation section, add a "Prompting Philosophy" subsection with:
  - The right level: structured context + clear 1-2 sentence goal + constraints + verification criterion
  - What to include in a prompt: (a) what to read, (b) goal in 1-2 sentences, (c) hard constraints and patterns, (d) how to verify done
  - What NOT to include: step-by-step micro-instructions, line-by-line implementation guidance (let the agent reason)
  - Reference the pattern from `session-plan-schema.md` delegation sizing guidelines

### 4. Commit all changes
- [ ] Stage and commit: `git add -A && git commit -m "docs: add task sizing limits, resubmit pattern, and prompting philosophy"`

---

## Scope
- **Edit:** `~/.config/opencode/protocols/session-plan-schema.md` (add delegation sizing section)
- **Edit:** `~/.config/opencode/agents/headwrench.md` (add prompting philosophy to delegation section)
- **Read:** same two files above
- **Write:** nothing new
- **Excluded:** All other files.

---

## Patterns

```
✅ GOOD — Task sizing rule is concrete (3 files / 500 lines) and has a clear rationale
✅ GOOD — Resubmit pattern includes an example showing the task_id handoff
✅ GOOD — Prompting philosophy shows both what to include AND what to exclude
❌ BAD  — Vague guidance like "keep tasks small" without a concrete threshold
❌ BAD  — Documenting the resubmit pattern without distinguishing it from parallel groups
❌ BAD  — Prompting philosophy that just says "be clear" — needs actionable structure
```

---

## Constraints
- The task_id resubmit example must use realistic placeholder language (not actual agent calls).
- Do not remove or contradict any existing delegation guidance in `headwrench.md`.
- The sizing guideline (~3 files / ~500 lines) is a rule of thumb, not a hard limit — language the docs appropriately.

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
