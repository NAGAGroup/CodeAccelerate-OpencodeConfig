# Subtask 05 — Task Sizing + Prompting Philosophy

## What was done

Added two new documentation sections to the planning system:

### `session-plan-schema.md` — `## Delegation Sizing Guidelines` (line 138)

- Soft rule of thumb: ~3 files or ~500 lines per delegation (heuristic, not hard cap)
- Anti-pattern: large single-invocation tasks (e.g., 5000-word DocWriter output in one shot)
- `task_id` resubmit pattern: Part 1 → capture task_id → resubmit Part 2 in same subagent session
- Prose example showing Part 1 / Part 2 handoff with realistic placeholder language
- Note: resubmit = sequential slicing; for independent parallel work, use parallel groups

### `headwrench.md` — `### Prompting Philosophy` (line 124, inside `## Delegation Rules`)

- Right level: structured context + 1-2 sentence goal + constraints + verification criterion
- What to include: specific file paths to read, concise goal, hard constraints, verification method
- What NOT to include: step-by-step micro-instructions, line-by-line guidance
- HW provides the **what**, not the **how**
- Cross-reference to `session-plan-schema.md` sizing guidelines

## Commit

`cbc1c36` — "docs: add task sizing limits, resubmit pattern, and prompting philosophy"
