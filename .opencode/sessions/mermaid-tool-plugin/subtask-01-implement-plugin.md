# Subtask 01 — Implement Mermaid Tool Plugin

## Delegation
- **Agent:** @CodeWriter
- **Model tier:** standard (claude-sonnet-4.6) — multiple interacting files (package.json + new plugin + opencode.json), requires judgment on plugin registration pattern

---

## Objective

Add `beautiful-mermaid` as a dependency and implement a new `opencode/plugins/mermaid-tool.ts` plugin that registers a `render_mermaid` tool. The tool accepts a mermaid diagram source string and a format specifier, then returns the rendered output inline as a string. Follow the exact same plugin pattern as `opencode/plugins/session-context.ts`.

**Note:** HeadWrench will handle the branch creation, `bun install`, smoke test, and TypeScript check — these are NOT part of CodeWriter's scope.

---

## Todolist

### 1. Read existing plugin and config for patterns
- [ ] Read `opencode/plugins/session-context.ts` — understand the plugin export shape, tool registration, error handling pattern
- [ ] Read `opencode/opencode.json` — understand how plugins are registered (look for `plugins` key and how `session-context.ts` is referenced)
- [ ] Read `opencode/package.json` — current dependencies

### 2. Add dependency
- [ ] Edit `opencode/package.json` — add `"beautiful-mermaid": "latest"` (or latest semver) to dependencies

### 3. Implement plugin
- [ ] Write `opencode/plugins/mermaid-tool.ts` with the following design:
  - Import `renderMermaid` (async, returns SVG string) and `renderMermaidAscii` (sync, returns unicode) from `'beautiful-mermaid'`
  - Export default async function `(ctx: PluginInput): Promise<Hooks>` (same shape as session-context.ts)
  - Register a single tool: `render_mermaid`
    - **Description:** "Render a Mermaid diagram. Use 'ascii' for terminal/chat (returns unicode box-drawing art), 'svg' for SVG markup, or 'markdown' to wrap the source in a ```mermaid fenced code block for GitHub rendering."
    - **Args:**
      - `diagram`: string — "Mermaid diagram source code (e.g. 'graph LR; A-->B')"
      - `format`: enum `["ascii", "svg", "markdown"]` — "Output format: ascii (unicode art, flowcharts only), svg (SVG string), or markdown (GitHub-renderable fenced block)"
    - **Execute logic:**
      - `"ascii"`: call `renderMermaidAscii(diagram)` synchronously. If it throws, catch and return markdown format as fallback with a note: `"// ASCII not supported for this diagram type — returning markdown\n\`\`\`mermaid\n${diagram}\n\`\`\`"`
      - `"svg"`: call `await renderMermaid(diagram)`. If it throws, return error string.
      - `"markdown"`: return `` `\`\`\`mermaid\n${diagram}\n\`\`\`` `` — no rendering needed
    - Wrap entire execute in try/catch. Never throw — always return string.

### 4. Register plugin in opencode.json (if required)
- [ ] If `session-context.ts` is referenced in `opencode.json` by file path, add an equivalent entry for `mermaid-tool.ts`
- [ ] If plugins are auto-discovered from the `opencode/plugins/` directory (no explicit registration needed), no changes to `opencode.json` required — document this finding in a comment in the file

### [🚫 GATE]
HeadWrench will: (1) create branch `feat/mermaid-tool`, (2) run `bun install` in `opencode/`, (3) run smoke test via `bun --eval`, (4) run TypeScript check. User reviews output before Subtask 02 begins.

---

## Scope
- **Edit:** `opencode/package.json`, `opencode/opencode.json` (if registration required)
- **Write:** `opencode/plugins/mermaid-tool.ts`
- **Read:** `opencode/plugins/session-context.ts`, `opencode/opencode.json`, `opencode/package.json`
- **Excluded:** Any other files. Do NOT modify `session-context.ts`, agent definitions, protocols, ROADMAP.md, CHANGELOG.md.

---

## Patterns
```
✅ GOOD — export default async (ctx: PluginInput): Promise<Hooks> => { return { tool: { render_mermaid: tool({ ... }) } } }
❌ BAD  — export function plugin() { ... } // Wrong export shape

✅ GOOD — try { return renderMermaidAscii(diagram) } catch { return fallback }
❌ BAD  — renderMermaidAscii(diagram) // Unguarded — may throw for non-flowchart types

✅ GOOD — import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid'
❌ BAD  — const bm = require('beautiful-mermaid') // CommonJS require
```

---

## Constraints
- Follow `session-context.ts` exactly for plugin shape: same import paths, same export default pattern, same tool registration via `tool()` helper from `@opencode-ai/plugin/tool`
- Never throw from inside `execute` — always catch and return error as string
- The `ctx: PluginInput` parameter may not be used in this plugin (no hooks needed, only a tool) — that's fine, follow the same signature anyway
- No file I/O — all output is returned inline as strings
- No `process.cwd()` usage needed (this plugin has no filesystem operations)
- `renderMermaid` requires `await` — the tool's execute function should be `async`
- Use named imports: `import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid'`

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`.*
