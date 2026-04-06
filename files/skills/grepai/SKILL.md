---
name: grepai
description: How to use GrepAI semantic search and code intelligence tools effectively
---

# GrepAI

## Purpose

Use GrepAI tools for intent-based code discovery and dependency analysis. GrepAI searches by meaning — use it when you need to find code based on what it does, not what it is called. Fall back to grep or glob only when GrepAI returns no useful results or when you need exact string matching.

## When to Use GrepAI vs grep/glob

- **Use grepai_grepai_search:** Finding code by behavior ("user authentication flow", "error handling middleware", "database connection logic")
- **Use grep/glob:** Exact matches — specific function names, variable references, import statements, file patterns
- **Never use GrepAI** when you know the exact string to search for

## Available Tools

**grepai_grepai_search** — Semantic search by meaning. Use this first when exploring code by intent.

```
grepai_grepai_search(
  query="user authentication flow",
  limit=10
)
```

Use format="toon" parameter to reduce token usage by ~80% when you only need paths and scores:

```
grepai_grepai_search(
  query="validate password against stored hash",
  limit=10,
  format="toon"
)
```

**grepai_grepai_trace_callers** — Find all functions that call a specific function. Use before refactoring.

```
grepai_grepai_trace_callers(
  symbol="validateUser"
)
```

**grepai_grepai_trace_callees** — Find all functions called by a specific function. Use to understand dependencies.

```
grepai_grepai_trace_callees(
  symbol="processPayment"
)
```

**grepai_grepai_trace_graph** — Build a complete call graph around a function. Use for deep dependency analysis.

```
grepai_grepai_trace_graph(
  symbol="initializeDatabase",
  depth=3
)
```

**grepai_grepai_index_status** — Check index health. Use when search returns unexpected empty results.

**grepai_grepai_rpg_explore** — Traverse the RPG graph from a node. Use for structural code navigation.

**grepai_grepai_rpg_search** — Search RPG nodes by meaning. Use for finding architectural components.

**grepai_grepai_rpg_fetch** — Get detailed info about a specific RPG node. Use when you have a node ID.

## How to Write Effective Search Queries

- Use 3-7 words describing behavior or intent
- Describe what code DOES, not what it's called: "validate user credentials" not "getUserAuth"
- Use natural language: "connect to database", "handle HTTP errors", "serialize JSON response"
- Avoid single words or exact function names (use grep for those)

## Interpreting Results

Score interpretation:
- **0.90+** — Excellent match, directly addresses the query
- **0.80-0.89** — Good match, high relevance
- **0.70-0.79** — Related code, may contain useful context
- **Below 0.70** — Weak match, likely noise

## Anti-patterns

**Using exact function names in semantic search.** "Find the getUserData function" fails because GrepAI matches meaning, not names. Use grep for exact function names.

**Single-word queries.** "authentication" or "database" produces too much noise. Add context: "handle authentication errors in login flow" is far more effective.

**Searching when the answer is already known.** Do not use GrepAI to find something you can grep for. Know the exact string? Use grep. Do not know what you are looking for? Use GrepAI.

**Ignoring low scores.** Results below 0.70 are often false positives. Rephrasing the query is faster than reading weak matches.
