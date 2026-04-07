---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# GrepAI: Semantic Code Search

Use GrepAI to find code by describing what it does and to trace how code elements connect.

## Tools
**grepai_grepai_search** — Find code by semantic description. Key params: `query` (what code does), `limit` (max results, default 10), `compact` (true for locations only), `format` ('toon' for 50% fewer tokens).

**grepai_grepai_trace_callers** — Find everything that calls a function. Key params: `symbol` (function name), `compact` (true for locations only).

**grepai_grepai_trace_callees** — Find everything a function calls. Key params: `symbol` (function name), `compact` (true for locations only).

**grepai_grepai_trace_graph** — Full call graph around a function. Key params: `symbol` (function name), `depth` (levels to traverse, default 2).

## Patterns
**Wide exploration:** Run multiple grepai_grepai_search calls with varied queries, use compact=true and format='toon' for token efficiency, follow up on interesting results.

**Deep tracing:** Use grepai_grepai_search to locate entry points, trace_callers or trace_callees to follow logic across files, trace_graph to see full call structure.

## Anti-patterns
- Do not use keyword-based queries — use natural language descriptions of what code does
- Do not skip compact=true on search — always use by default to save tokens
- Do not assume first result is the only relevant one — run multiple queries to explore thoroughly
