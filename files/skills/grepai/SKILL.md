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

## How to Write Queries

Write queries like explaining to a person: "how does the app handle user login" not "Login function".

Use the path parameter to narrow down if you know where to look, but start always start broad.

## Workflow

**Standard investigation:**
1. `grepai_grepai_search` with compact=true to find relevant files
2. `read` the files GrepAI found
3. Use `grep` only if you need exact string matching in those files

**Before changing code:**
1. `grepai_grepai_trace_callers` to see what depends on the code
2. `read` those caller files to understand usage
3. Make changes knowing the impact

**Finding related code:**
1. `grepai_grepai_search` for the feature area
2. `grepai_grepai_trace_graph` to see how functions connect
3. `read` key files to understand structure

## Token Efficiency Rules

- Always use `compact=true` unless you need code snippets
- Use `format='toon'` when making multiple searches
- Start with limit=5 or limit=10, not higher
- GrepAI finds files → read finds content → grep finds exact strings

## Example Calls

Find authentication code:
```
grepai_grepai_search(query="user authentication and login", limit=10, compact=true)
```

Search only in specific directory:
```
grepai_grepai_search(query="API route handlers", path="src/api/", limit=10, compact=true)
```

Search in specific file:
```
grepai_grepai_search(query="database connection setup", path="config/database.ts", compact=true)
```

Find what calls a function before refactoring:
```
grepai_grepai_trace_callers(symbol="validateToken", compact=true)
```

See full dependency chain:
```
grepai_grepai_trace_graph(symbol="processPayment", depth=2)
```

Multiple searches with token efficiency:
```
grepai_grepai_search(query="database queries", limit=5, compact=true, format='toon')
```
