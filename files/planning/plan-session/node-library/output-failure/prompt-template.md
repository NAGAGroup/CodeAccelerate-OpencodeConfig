# Session Failed

The session has ended without completing successfully.

Tell the user the following:

## What was attempted

{{WHAT_WAS_ATTEMPTED}}

## Where it stopped

{{FAILURE_POINT}}

## Recovery options

{{RECOVERY_OPTIONS}}

## Guidance

### `{{WHAT_WAS_ATTEMPTED}}`
Brief summary of all major phases completed before failure — not just the last step. E.g., "Scout phase completed (3 scouts). Implementation was attempted (2 JuniorDev dispatches). Build verification failed on both attempts."

### `{{FAILURE_POINT}}`
Describe the exact node or phase where the plan stopped. E.g., "Build failed after 2 fix attempts — typescript errors in src/auth/token.ts remained unresolved."

### `{{RECOVERY_OPTIONS}}`
1–3 concrete actions the user can take. E.g., "Run `bun run typecheck` to see remaining errors. Manually fix src/auth/token.ts line 47."

## Note

`todo: []` — Terminal node. HW reads this prompt and communicates the failure summary to the user directly. No tools to call; the session ends after this node.
