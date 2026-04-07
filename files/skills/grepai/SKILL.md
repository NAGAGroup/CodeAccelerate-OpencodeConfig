---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# GrepAI: Semantic Code Search

Use GrepAI to find code by describing what it does in natural language, and to trace how code elements connect across files.

## Tools

**grepai_grepai_search** — Find code by semantic description
- `query`: What the code does (e.g., "error handling", "configuration loading")
- `path`: Narrow to a specific directory or file (optional)
- `limit`: Max results (default 10, start with 5-10)
- `compact`: true = locations only, no code snippets (use by default to save tokens)
- `format`: 'toon' = 50% fewer tokens (use when making multiple searches)

**grepai_grepai_trace_callers** — Find everything that calls a function
- `symbol`: Function name to trace
- `compact`: true = locations only, no code

**grepai_grepai_trace_callees** — Find everything a function calls
- `symbol`: Function name to trace
- `compact`: true = locations only, no code

**grepai_grepai_trace_graph** — Full call graph around a function (both directions)
- `symbol`: Function name
- `depth`: How many levels to traverse (default 2)

## Usage Patterns

**Wide exploration (breadth-first survey):**
1. Run multiple `grepai_grepai_search` calls with varied queries — each covering a different aspect of the goal
2. Use `compact=true` and `format='toon'` to stay token-efficient
3. Follow up on interesting results with more targeted queries

**Deep tracing (narrow analysis):**
1. `grepai_grepai_search` to locate entry points for the area of interest
2. `grepai_grepai_trace_callers` or `grepai_grepai_trace_callees` to follow logic across files
3. `grepai_grepai_trace_graph` to see the full call structure around a function
4. `read` files identified by tracing to verify implementation details

## Anti-patterns

- Do not use trace tools for wide exploration — trace tools are for following specific logic chains, not surveying
- Do not use a single search query and stop — run multiple varied queries to cover the goal from different angles
- Do not set limit higher than 10 — start narrow and follow up if needed
- Do not skip `compact=true` on the first pass — read snippets only when you need them
