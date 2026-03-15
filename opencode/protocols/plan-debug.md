# plan-debug.md — Debug Session Type (Stub)

> **Note:** This is a stub. Expand in a future session.

The Debug session type handles bug reports, unexpected behavior, test failures, and error traces.

## Flow (Abbreviated)

1. **Phase 1** — Run `plan-init.md` (with extra focus on error traces, test output, and relevant code paths)
2. **Shared steps** — Run `plan-shared.md` (type-specific Q&A: reproduction steps, acceptance criteria)
3. **Subtask structure:**
   - **Reproduce** — Write reproduction steps as first subtask; HW runs directly
   - **Diagnose** — Delegate to @ContextInsurgent for deep analysis of relevant code
   - **Gate** — Review diagnosis with user before implementing fix
   - **Fix** — Delegate to session-local implementer
   - **Regression test** — HW runs directly
4. **Finalization** — Run `plan-end.md`

## Key Constraints

- Never skip the Gate before Fix — diagnosis must be reviewed before code changes
- Regression test must demonstrate the bug no longer occurs (not just "tests pass")
- If the fix subtask fails circuit breaker, surface the diagnosis note to the user before stopping
