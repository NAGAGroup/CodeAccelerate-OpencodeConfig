# Plugin API: Correct Import Pattern

## What Was Discovered
`@opencode-ai/plugin` v1.2.21 does NOT export `definePlugin` or `tool` from its main entry point under NodeNext resolution.

## Correct Patterns

### Plugin export
```typescript
import type { Hooks, PluginInput } from "@opencode-ai/plugin"
export default async (_ctx: PluginInput): Promise<Hooks> => { ... }
```
No `definePlugin` wrapper — plugin is just an async function matching the `Plugin` type.

### Tool helper
```typescript
import { tool } from "@opencode-ai/plugin/tool"
// tool.schema is Zod z
tool({ description, args: { foo: tool.schema.string() }, execute: async ({ foo }) => "..." })
```
Must import from `@opencode-ai/plugin/tool` subpath, NOT from `@opencode-ai/plugin` directly.

### Hooks interface
All hook types (including `experimental.chat.system.transform`) live in `@opencode-ai/plugin` main entry.

## Why
The package uses subpath exports (`./tool` is a separate export). Under NodeNext `moduleResolution`, `export * from "./tool"` in the index does not re-export named bindings across subpath boundaries.

## Example Plugin
See `/home/jack/CodeAccelerate-OpencodeConfig/opencode/node_modules/@opencode-ai/plugin/dist/example.js` — the canonical reference.
