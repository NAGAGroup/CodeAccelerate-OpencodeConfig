# Session Complete

The session has completed successfully.

Tell the user the following:

## What was accomplished

{{ACCOMPLISHMENTS}}

*Bulleted list of what the session achieved — specific file paths and function names, not themes. E.g., "Implemented token refresh logic in src/auth/token.ts; added test coverage in tests/auth.test.ts."*

## Artifacts produced

{{ARTIFACTS}}

*List all files written or modified with repo-relative paths. E.g., "src/auth/token.ts, tests/auth.test.ts, CHANGELOG.md."*

## Next steps

{{NEXT_STEPS}}

*1–3 actionable steps with specific commands or paths. E.g., "Run `bun run build` to verify output." Bad: "Review the changes."*

## Execution note (fixed)

`todo: []` — Terminal node. HW communicates the success summary to the user as plain language. Do NOT include HW-internal references, DAG node IDs, or planning mechanics in the user-facing message. The session ends immediately after this node — no `next_step()` call is needed or valid.
