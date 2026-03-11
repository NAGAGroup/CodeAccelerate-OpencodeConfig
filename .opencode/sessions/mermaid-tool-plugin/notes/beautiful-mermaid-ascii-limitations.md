# Note: beautiful-mermaid Library — ASCII Limitations

## Date: 2026-03-10

## ASCII Support

`renderMermaidAscii(source)` only supports **flowcharts** (`graph` / `flowchart` diagram types).
For any other diagram type (sequence, class, state, etc.), the function throws.

## Fallback Strategy

When `renderMermaidAscii` throws, fall back to a markdown fenced block:
```
```mermaid
[diagram source]
```
```
This is also injected via `session.prompt` (not returned as a tool result) for consistency.

## SVG Support

`renderMermaid(source)` is async and supports all 5 diagram types:
- flowchart / graph
- sequence
- class
- state
- pie

Returns a standalone SVG string (no DOM dependencies, MIT license).

## Themes

The library has 15 built-in themes. Default theme is used unless overridden.
No theme selection is exposed in the `render_mermaid` tool (out of scope).
