# Protocol: Build & Test

This session involves a TypeScript plugin file. There is no formal build step — the plugin is loaded directly by opencode at runtime. However, type-checking and linting can catch errors before the integration test.

## Type-check
```bash
cd opencode && npx tsc --noEmit --strict plugins/session-compaction.ts
```
If `tsconfig.json` doesn't exist in `opencode/`:
```bash
cd opencode && npx tsc --noEmit --strict --moduleResolution node --esModuleInterop true plugins/session-compaction.ts
```

Expected output: no errors.

## Lint (optional)
```bash
cd opencode && npx eslint plugins/session-compaction.ts --max-warnings 0
```

## Runtime test
The definitive test is restarting opencode and running the integration test in subtask-05.
There is no automated test suite for the plugin.

## On failure
If type-check fails:
1. Read the error message carefully — tsc errors are precise
2. Check the relevant type definition in `node_modules/@opencode-ai/plugin/dist/`
3. Fix the type error — do not use `as any` to silence it unless documented
4. Re-run type-check
5. If still failing after 3 attempts → circuit breaker (see `debug.md`)

## Expected plugin behaviour at runtime
- Plugin loads silently (no startup output)
- `compact` tool appears in the agent's tool list
- No errors in opencode's log output related to `session-compaction`
