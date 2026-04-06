---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# GrepAI Semantic Search and Code Intelligence

This skill teaches how to use GrepAI semantic search and code intelligence tools effectively. Load it when you need to investigate code, locate files, understand dependencies, or trace function calls through the codebase.

## GrepAI Tools Overview

GrepAI provides multiple tool categories for different investigation needs.

**Search Tools:** Use grepai_grepai_search for semantic code search using natural language queries. Parameters: query (required), limit (default 10), compact (default false), workspace, project, path, format (json or toon).

**Trace Tools (Call Graph Analysis):** Use grepai_grepai_trace_callers to find all functions that call a specific symbol. Use grepai_grepai_trace_callees to find all functions called by a specific symbol. Use grepai_grepai_trace_graph to build complete call graph showing both callers and callees. Parameters: symbol (required), depth (default 2 for graph), workspace, project, compact (default false).

**Workspace Tools:** Use grepai_grepai_list_workspaces to list all available workspace names. Use grepai_grepai_list_projects to list projects within a workspace (requires workspace parameter).

**Status Tools:** Use grepai_grepai_index_status to check index health and statistics. Parameters: verbose (optional), workspace.

## When to Use GrepAI

Use GrepAI as your PRIMARY tool for understanding what code does or where functionality lives, finding implementations by intent or behavior, exploring unfamiliar parts of the codebase, understanding function dependencies before refactoring, cross-project search in multi-repo setups, and tracking property/state usage patterns.

Use standard tools (grep/glob) only for exact text matching (variable names, imports, specific strings) and file path patterns.

## Output Format Optimization

GrepAI supports multiple output formats optimized for different use cases.

Default format provides human-readable results with file paths, line numbers, scores, and code snippets. Use for exploration and understanding.

Compact mode (compact parameter set to true) omits the content field, reducing token usage by approximately 80 percent. Use when you only need file locations and scores, not the actual code snippets.

TOON format (format parameter set to toon) uses Token-Oriented Object Notation, approximately 50 percent fewer tokens than JSON. Use for high-volume operations or when token efficiency is critical.

For AI agent operations, use compact set to true by default unless you specifically need to see code snippets in the results. Use format set to toon when making many search calls or working with large result sets.

## Query Best Practices

Use English for queries because embedding models are trained on English and perform best with English queries.

Describe INTENT, not implementation. Write "handles user login" instead of "func Login" or "function that validates user credentials" instead of "validateUser".

Be specific with terminology. "JWT token validation" is better than just "token". Include domain-specific terms when relevant.

Natural language works best. "how are errors handled in API requests" is more effective than "error handler".

Good query examples: "user authentication flow", "database connection pooling", "error handling middleware", "JWT token validation logic".

Bad query examples: "auth" (too vague), "function Login" (describes implementation not intent), "JWT token expiration validation check implementation" (overly specific).

## Workflow Patterns

Standard investigation workflow: Start with grepai_grepai_search to find relevant code by describing what it does. Use grepai_grepai_trace_callers or grepai_grepai_trace_callees to understand dependencies. Use the read tool to examine the specific files identified by GrepAI. Use grep only for exact string matching within the narrowed scope.

Before refactoring workflow: Use grepai_grepai_trace_callers to find all functions that depend on the code you plan to change. Use grepai_grepai_trace_graph to visualize the complete dependency chain. Read the caller files to understand usage patterns. Make informed refactoring decisions based on actual usage.

Cross-project search in workspace mode: Use grepai_grepai_list_workspaces to see available workspaces. Use grepai_grepai_search with workspace parameter to search across all projects. Optionally filter by specific projects using the project parameter. Use path parameter to narrow results to specific directories.

## Rules

Start with grepai_grepai_search for broad exploration and code discovery. Use trace tools when you need to understand a specific function's dependencies and callers before making changes. Rely on GrepAI tools first for investigation — file operation tools (read, glob, grep) are fallbacks only after GrepAI has identified the specific files you need. Once GrepAI identifies relevant files, read those files using the read tool to understand their full context. Use the grep tool for exact string matching only when semantic search has narrowed the scope to specific files. Always use compact mode or TOON format for token efficiency unless you need to see code snippets in results.

If workspaces aren't configured for the project, use the tools without specifying a workspace.

## Anti-patterns

**Anti-pattern: Using file tools first for exploration**

What it looks like: You need to find authentication code. You call glob with pattern matching auth files to find files, getting back 20 results. You read all of them trying to find the right one.

Why it fails: Semantic search is far more efficient than trying many files. You waste effort on irrelevant code. GrepAI understands intent and returns focused results.

**Anti-pattern: Semantic search with overly specific phrases**

What it looks like: You search for "JWT validation implementation" when broader queries like "token validation" would capture more relevant results.

Why it fails: Semantic search matches meaning — overly specific queries reduce results and miss related code. Use natural language describing the behavior or intent.

**Anti-pattern: Ignoring low-scoring results**

What it looks like: Results below a score of 0.70 are often false positives. You read all results anyway, wasting time on noise.

Why it fails: Rephrasing the query is faster than reading weak matches. When scores are low, revise your search query and try again with different terms.

**Anti-pattern: Not narrowing before using grep**

What it looks like: You use the grep tool to search the entire codebase for "token" without first using grepai_grepai_search to narrow down to relevant files.

Why it fails: Grep across a large codebase produces noise. GrepAI identifies relevant files first, then grep can be used precisely within those files.

**Anti-pattern: Not using compact mode for AI operations**

What it looks like: You make multiple grepai_grepai_search calls without setting compact to true, consuming excessive tokens with code snippets you don't need.

Why it fails: Token usage adds up quickly. Use compact mode by default unless you specifically need to see code snippets in the results.

**Anti-pattern: Using trace when you need different queries**

What it looks like: You try to use grepai_grepai_trace_callers to find where an application state is accessed, but get no results because it's not a function call.

Why it fails: Trace tools work on function and method symbols. For other types of investigation, use grepai_grepai_search with semantic queries describing what you're looking for.

## Good and Bad Examples

**Good:** You need to understand token validation. You call grepai_grepai_search with query "token validation flow" and compact true. Results point you to three files. You read those files with the read tool. If you need to understand what functions call validateToken, you use grepai_grepai_trace_callers with symbol "validateToken" to map the call graph.

**Good:** Before refactoring a critical function, you call grepai_grepai_trace_graph with symbol "processPayment" and depth 3 to understand the complete dependency chain. This reveals 8 callers across 4 files that you need to consider.

**Good:** You need to find where a configuration state is being accessed and modified. You call grepai_grepai_search with query "configuration state updates" to locate relevant code sections.

**Bad — uses glob first:** You need to find authentication code, so you call glob with pattern matching auth files and read 15 files trying to find validation logic. Use grepai_grepai_search instead.

**Bad — overly specific semantic query:** You search for "JWT token expiration validation check implementation" when "token validation" would work better and return more relevant results.

**Bad — reads all weak results:** GrepAI returns results with scores 0.55 and 0.60. You read all of them even though they are likely false positives. Revise your query instead.

**Bad — wastes tokens:** You make 10 grepai_grepai_search calls without compact mode, getting back full code snippets each time when you only needed file paths and scores.

**Bad — wrong tool for the job:** You try to use grepai_grepai_trace_callers to find where a reactive property is accessed. Use grepai_grepai_search with a semantic query describing the property and its usage instead.
