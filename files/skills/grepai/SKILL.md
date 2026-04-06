---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# GrepAI: Semantic Code Search

Use GrepAI to find code by describing what it does in natural language.

## Core Tools

**grepai_grepai_search** - Find code by description
- `query`: What the code does (e.g., "user authentication", "database queries")
- `path`: Search within a specific directory or file (optional)
- `limit`: Max results (default 10)
- `compact`: true = no code snippets, 80% fewer tokens (use by default)
- `format`: 'toon' = 50% fewer tokens (use for multiple searches)

**grepai_grepai_trace_callers** - Find what calls a function
- `symbol`: Function name to trace
- `compact`: true = locations only, no code

**grepai_grepai_trace_callees** - Find what a function calls
- `symbol`: Function name to trace
- `compact`: true = locations only, no code

**grepai_grepai_trace_graph** - Full call graph around a function
- `symbol`: Function name
- `depth`: How many levels (default 2)

## Workflow

**Standard investigation:**
1. `grepai_grepai_search` with compact=true to get a broad orientation of the project for key semantic areas without reading code snippets
2. `grepai_grepai_search` with compact=false with the path argument to read code snippets in relevant files

**Before changing code:**
1. `grepai_grepai_trace_callers` to see what depends on the code
2. `read` those caller files to understand usage
3. Make changes knowing the impact

**Finding related code:**
1. `grepai_grepai_search` for the feature area
2. `grepai_grepai_trace_graph` to see how functions connect
3. `read` key files to understand structure

## Contstraints

- Always use `compact=true` unless you need code snippets
- Always use `path=` to read exact files
- Use `format='toon'` when making multiple searches
- Start with limit=5 or limit=10, not higher
