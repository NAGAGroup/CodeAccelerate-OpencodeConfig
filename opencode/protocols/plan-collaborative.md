# plan-collaborative.md — Collaborative Session Type (Stub)

> **Note:** This is a stub. Expand in a future session.

The Collaborative session type is for users who want active involvement during execution — reviewing results, approving steps, or simply observing with visibility.

## Involvement Levels

| Level | Description |
|-------|-------------|
| **Review** | HW runs each subtask, then pauses for user review of results before continuing |
| **Approve** | HW pauses before each subtask starts and waits for user approval |
| **Observe** | HW runs autonomously and surfaces findings at gates only |

Default: **Observe** (matches the default autonomous execution mode).

## Pause Cadence Options

- After each subtask (Review and Approve modes)
- After each gate only (Observe mode)
- Only on failure (any mode — circuit breaker triggers)

## Flow

1. **Phase 1** — Run `plan-init.md`
2. **Shared steps** — Run `plan-shared.md` (type-specific Q&A: involvement level, pause cadence)
3. **Subtask decomposition** — Same rules as plan-generic.md, but include explicit "pause" markers in subtask todos for Review/Approve modes
4. **Finalization** — Run `plan-end.md`
