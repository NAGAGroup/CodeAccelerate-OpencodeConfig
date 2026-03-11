# Session: mermaid-tool-plugin

**Goal:** Implement a `render_mermaid` OpenCode tool plugin using the `beautiful-mermaid` library that allows agents to render Mermaid diagrams as ASCII unicode art, SVG, or GitHub-compatible markdown fenced blocks.

---

## Done Criteria

- [ ] `beautiful-mermaid` added to `opencode/package.json` and installed
- [ ] `opencode/plugins/mermaid-tool.ts` implemented with `render_mermaid` tool
- [ ] Tool registered/discoverable in OpenCode (follows existing plugin pattern)
- [ ] Smoke test passes: ASCII render of a simple flowchart produces unicode art
- [ ] TypeScript check passes (no type errors in plugin)
- [ ] ROADMAP.md mermaid diagram tool entry updated from 🔲 Planned → ✅ Recently Shipped
- [ ] CHANGELOG.md updated with the new feature
- [ ] PR created on `feat/mermaid-tool` → `main`

---

## Subtask Table

| # | Status | Description |
|---|--------|-------------|
| 01 | 🔲 pending | Implement mermaid-tool plugin — @CodeWriter / standard |
| G1 | 🚫 GATE | Verify plugin loads and renders correctly before marking Shipped |
| 02 | 🔲 pending | Update ROADMAP.md and CHANGELOG.md — @DocWriter / fast |
| 03 | 🔲 pending | Final commit and create PR — HeadWrench |

---

## Gates

### G1 — Verify Before Shipping

**Stop condition:** After Subtask 01 completes, HeadWrench runs a smoke test (`renderMermaidAscii` via bun eval) and TypeScript check. User reviews the rendered output and approves before proceeding to mark the feature as Shipped in ROADMAP.md.

**What approval is needed:** Confirm the plugin is correct and the test output looks right. Only then does Subtask 02 proceed to update ROADMAP.md to ✅.

---

## Current Focus

▶️ Planning complete — ready to begin Subtask 01 on user's "start" signal.

**Next:** Subtask 01 — Implement mermaid-tool plugin (CodeWriter)

---

## Scope

**In scope:**
- `opencode/plugins/mermaid-tool.ts` — new plugin file
- `opencode/package.json` — add `beautiful-mermaid` dependency
- `opencode/opencode.json` — plugin registration (if required)
- `ROADMAP.md` — status update
- `CHANGELOG.md` — feature entry
- Feature branch `feat/mermaid-tool`, PR to `main`

**Out of scope:**
- Changes to other plugins (session-context.ts)
- Changes to agent definitions or protocols
- Adding mermaid diagrams to docs (this is purely the tool implementation)
- Theme configuration (use library defaults)
- File-based output storage (all output is returned inline as strings)

---

## Patterns & Constraints

- Follow `opencode/plugins/session-context.ts` as the canonical plugin pattern
- All tools must be wrapped in try/catch — never throw from a plugin
- Use `process.cwd()` only if file I/O is needed (not needed here — all output is in-memory strings)
- Plugin must never break OpenCode startup (all errors surface as return string messages)
- `beautiful-mermaid` API: `renderMermaid(source)` → `Promise<string>` (SVG), `renderMermaidAscii(source)` → `string` (unicode)
- ASCII output: only flowcharts (`graph`) are supported by the library; fall back to markdown format for unsupported diagram types
- Branch: `feat/mermaid-tool` — PR to `main`
- Circuit breaker: 3 consecutive failures
