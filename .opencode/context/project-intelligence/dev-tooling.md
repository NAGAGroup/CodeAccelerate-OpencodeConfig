# Dev Tooling Notes

Practical tooling discoveries for working on this repo.

---

## Type-Checking opencode Plugins

**Source:** `session-context-plugin` session, ST03 (2026-03-10)

When type-checking TypeScript files in `opencode/plugins/`, use `--module ESNext --moduleResolution bundler`, **not** `--module NodeNext`.

The `@opencode-ai/plugin` package's `.d.ts` files do not conform to NodeNext strict extension requirements, producing false-positive errors from `node_modules/` under NodeNext resolution. The `bundler` mode matches opencode's actual runtime resolution and produces clean results.

**Command:**
```
npx tsc --strict --target ES2022 --module ESNext --moduleResolution bundler --noEmit plugins/<filename>.ts
```

**Notes:**
- Project has no `bun` binary and no `tsconfig.json` in `opencode/`
- Run from the `opencode/` directory
