---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# What does this skill teach?

In this skill, you learn how to use GrepAI to find code by describing what it does and to trace how code elements connect across files.

## Related Tools

### `grepai_grepai_index_status`

| Parameter | Description |
|-----------|-------------|
| *(none required)* | Returns index health and statistics about indexed files |

### `grepai_grepai_search`

| Parameter | Description |
|-----------|-------------|
| `query` | Natural language description of what the code does — not keywords (required) |
| `limit` | Max results to return, default 10 (optional) |
| `compact` | Return file paths and line numbers only, without content (optional) |
| `format` | Use `'toon'` for ~50% fewer tokens (optional) |
| `path` | Restrict search to a specific path prefix (optional) |

### `grepai_grepai_trace_callers`

| Parameter | Description |
|-----------|-------------|
| `symbol` | Function or method name to find callers of (required) |
| `compact` | Return locations only without context (optional) |

### `grepai_grepai_trace_callees`

| Parameter | Description |
|-----------|-------------|
| `symbol` | Function or method name to find callees of (required) |
| `compact` | Return locations only without context (optional) |

### `grepai_grepai_trace_graph`

| Parameter | Description |
|-----------|-------------|
| `symbol` | Function or method name to build a call graph around (required) |
| `depth` | Traversal depth in both directions, default 2 (optional) |

## How to investigate code

1. Call `grepai_grepai_index_status` to confirm the index is healthy before relying on search results
2. Run `grepai_grepai_search` with `compact=true` and `format='toon'` to locate candidates with minimal token cost
3. Run additional `grepai_grepai_search` calls with varied queries — one query rarely surfaces everything relevant; approach from different angles
4. For candidates worth reading in full, run `grepai_grepai_search` without `compact` to retrieve content with file paths
5. If you have access to trace tools, use `grepai_grepai_trace_callers` to understand what depends on a symbol before changing it, `grepai_grepai_trace_callees` to understand what a symbol depends on, and `grepai_grepai_trace_graph` when you need the full picture around a symbol

## How to think through this skill

<|think|>
- Am I describing what the code does in natural language, or am I using keywords that won't match semantically?
- Have I checked index status — if results seem sparse, the index may not cover the relevant files?
- Have I run enough varied queries to be confident I've found all relevant code, or did I stop at the first result?
- Do I need to understand what calls this code (trace_callers), what this code calls (trace_callees), or both (trace_graph)?
- Am I using compact=true and toon format to save tokens on results I don't need to read in full?
