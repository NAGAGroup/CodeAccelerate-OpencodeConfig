---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# GrepAI Semantic Search and Code Intelligence

Use GrepAI semantic search and code intelligence tools for investigating code, locating files, understanding dependencies, and tracing function calls.

## GrepAI Tools Overview

**Search Tools:** grepai_grepai_search for semantic code search using natural language queries. Parameters: query (required), limit (default 10), compact, workspace, project, path, format.

**Trace Tools:** grepai_grepai_trace_callers to find all functions calling a symbol. grepai_grepai_trace_callees to find all functions called by a symbol. grepai_grepai_trace_graph to build complete call graph. Parameters: symbol (required), depth (default 2 for graph), workspace, project, compact.

**Workspace Tools:** grepai_grepai_list_workspaces to list available workspaces. grepai_grepai_list_projects to list projects within a workspace.

**Status Tools:** grepai_grepai_index_status to check index health. Parameters: verbose (optional), workspace.

## Query Best Practices

Use English for queries. Describe **intent, not implementation** — write "handles user login" instead of "func Login". Be specific with terminology. "JWT token validation" is better than just "token". Natural language works best: "how are errors handled in API requests" is more effective than "error handler".

Good queries: "user authentication flow", "database connection pooling", "error handling middleware".
Bad queries: "auth" (vague), "function Login" (implementation), "JWT expiration check implementation" (overly specific).

## Output Format and Efficiency

Default format provides human-readable results with file paths, line numbers, scores, and code snippets.

**Compact mode** (compact=true) omits content, reducing tokens by ~80%. Use when you only need locations and scores, not code snippets.

**TOON format** (format='toon') uses ~50% fewer tokens. Use for high-volume operations or token efficiency.

For AI agent operations, use compact=true by default unless you specifically need code snippets. Use format='toon' for many search calls.

## Workflow Patterns

**Standard investigation:** Start with grepai_grepai_search by describing what code does. Use trace tools to understand dependencies. Use read to examine identified files. Use grep only for exact string matching within narrowed scope.

**Before refactoring:** Use grepai_grepai_trace_callers to find all functions depending on code you plan to change. Use grepai_grepai_trace_graph to visualize the complete dependency chain. Read caller files to understand usage patterns.

**Cross-project search:** Use grepai_grepai_list_workspaces to see available workspaces. Use grepai_grepai_search with workspace parameter to search across projects. Optionally filter by project or path.

## Rules

- Start with grepai_grepai_search for broad exploration
- Use trace tools when you need to understand specific function dependencies before making changes
- Rely on GrepAI first for investigation; use file tools (read, glob, grep) as fallbacks after GrepAI identifies specific files
- Once GrepAI identifies relevant files, read them with the read tool to understand context
- Use grep only for exact string matching within files identified by GrepAI
- Always use compact mode or TOON format for token efficiency unless you need code snippets
