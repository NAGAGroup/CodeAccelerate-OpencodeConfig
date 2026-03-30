# Session Failed

The session has ended without completing successfully.

Tell the user the following:

## What was attempted

{{WHAT_WAS_ATTEMPTED}}
*Brief summary of all major phases completed before failure — not just the last step. E.g., "Scout phase completed (3 scouts). Implementation was attempted (2 JuniorDev dispatches). Build verification failed on both attempts."*

## Where it stopped

{{FAILURE_POINT}}
*Exact node or phase where the plan stopped. E.g., "Build failed after 2 fix attempts — TypeScript errors in src/auth/token.ts remained unresolved."*

## Recovery options

{{RECOVERY_OPTIONS}}
*1–3 concrete actions. E.g., "Run `bun run typecheck` to see remaining errors. Manually fix src/auth/token.ts line 47." Each item must be a specific command or file reference — not "try again."*

## Execution note (fixed)

`todo: []` — Terminal node. HW communicates the failure summary to the user as plain language. Do NOT reference DAG node IDs, plugin mechanics, or internal planning terminology in the user-facing message. The session ends immediately after this node — no `next_step()` call is needed or valid.
