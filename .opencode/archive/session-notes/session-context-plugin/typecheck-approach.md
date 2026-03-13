# TypeScript Type-Check Approach for opencode Plugins

## Context
ST03 of session-context-plugin. The project has no `bun` binary and no `tsconfig.json` in `opencode/`.

## What Works

Use `npx tsc` with bundler/ESNext resolution:

```
npx tsc --strict --target ES2022 --module ESNext --moduleResolution bundler --noEmit plugins/session-context.ts
```

This produces **zero errors** and correctly validates the plugin code.

## What Doesn't Work

Using `--module NodeNext --moduleResolution NodeNext` causes errors like:

```
node_modules/@opencode-ai/plugin/dist/index.d.ts(2,31): error TS2835: Relative import paths need explicit file extensions...
```

These are all inside `node_modules/@opencode-ai/plugin/dist/index.d.ts` — NOT in the plugin code. The package's own type declarations don't conform to NodeNext strict requirements. These errors are false positives for our purposes; opencode uses bundler-style resolution at runtime.

## Decision
Always use `--module ESNext --moduleResolution bundler` when type-checking opencode plugins. The NodeNext errors are noise from the package's internal declarations.
