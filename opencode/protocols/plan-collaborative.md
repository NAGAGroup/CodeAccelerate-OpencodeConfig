# plan-collaborative.md — Collaborative Session Type

The Collaborative session type is for users who want active involvement during execution — reviewing results, approving steps, or simply observing with visibility.

## Involvement Levels

| Level | Description |
|-------|-------------|
| **Review** | HW runs each subtask, then pauses for user review of results before continuing |
| **Approve** | HW pauses **before** each subtask starts and waits for user approval to proceed |
| **Observe** | HW runs autonomously and surfaces findings at gates only |

Default: **Observe** (matches the default autonomous execution mode).

## Pause Cadence Options

- After each subtask (Review mode)
- Before each subtask (Approve mode)
- After each gate only (Observe mode)
- Only on failure (any mode — circuit breaker triggers)

## Capturing the Interactivity Contract in Subtask Files

The involvement level decided during Q&A **must be encoded directly in every affected subtask file's `## Todolist` section** — not in `spec.json`, not in `index.md`. This is how HW enforces it at runtime.

### Pause Marker Syntax

Use the `[⏸ PAUSE]` marker as a checklist item inside the `## Todolist`:

```
- [ ] [⏸ PAUSE] — <brief note on what to surface to the user>
```

### Placement Rules

| Involvement Level | Where to place `[⏸ PAUSE]` |
|-------------------|----------------------------|
| **Approve** | As the **first item** in `## Todolist` — before any work begins |
| **Review** | As the **last item** in `## Todolist` — after all work is done, before checkpoint |
| **Observe** | No `[⏸ PAUSE]` markers in regular subtasks; gates handle the pause |

### What HW Does When It Encounters `[⏸ PAUSE]`

1. **Stop execution** — do not proceed past the marker.
2. **Surface a summary** to the user:
   - For **Approve** mode: describe what the subtask will do and ask for approval to start.
   - For **Review** mode: summarize what was done and ask the user to review before continuing.
3. **Wait for explicit user confirmation** (e.g., "proceed", "approved", "looks good") before marking the pause item complete and continuing.
4. Do not treat any other phrasing as implicit approval — only explicit "yes/proceed" signals count.

### Example — Approve Mode Subtask Todolist

```markdown
## Todolist

### 0. Pre-start approval
- [ ] [⏸ PAUSE] — Present the plan for this subtask: describe files to edit, approach, and expected outcome. Wait for user approval before proceeding.

### 1. Implementation
- [ ] Edit `src/foo.ts` — add new helper function
- [ ] Update `src/bar.ts` — call the new helper
```

### Example — Review Mode Subtask Todolist

```markdown
## Todolist

### 1. Implementation
- [ ] Edit `src/foo.ts` — add new helper function
- [ ] Update `src/bar.ts` — call the new helper

### 2. Post-work review
- [ ] [⏸ PAUSE] — Summarize changes made, show diffs if useful, and wait for user sign-off before checkpoint.
```

## Flow

1. **Phase 1** — Run `plan-init.md`
2. **Shared steps** — Run `plan-shared.md` (type-specific Q&A: involvement level, pause cadence)
3. **Subtask decomposition** — Same rules as plan-generic.md, but insert `[⏸ PAUSE]` markers into every subtask's `## Todolist` per the placement rules above for Review/Approve modes
4. **Finalization** — Run `plan-end.md`
