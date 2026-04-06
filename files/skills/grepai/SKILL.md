---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# GrepAI Semantic Search and Code Intelligence

This skill teaches how to use GrepAI semantic search and code intelligence tools effectively. Load it when you need to investigate code, locate files, understand dependencies, or trace function calls through the codebase.

## GrepAI Tools Overview

GrepAI provides multiple tool categories for different investigation needs:

**Search Tools:**
- `grepai_grepai_search` - Semantic code search using natural language queries. Parameters: query (required), limit (default: 10), compact (default: false), workspace, project, path, format (json or toon).

**Trace Tools (Call Graph Analysis):**
- `grepai_grepai_trace_callers` - Find all functions that call a specific symbol. Parameters: symbol (required), workspace, project, compact (default: false).
- `grepai_grepai_trace_callees` - Find all functions called by a specific symbol. Parameters: symbol (required), workspace, project, compact (default: false).
- `grepai_grepai_trace_graph` - Build complete call graph showing both callers and callees. Parameters: symbol (required), depth (default: 2), workspace, project.

**Refs Tools (Property/State Tracking):**
- `grepai_grepai_refs_readers` - Find where a property or state is read. Useful for Vue/Pinia state tracking.
- `grepai_grepai_refs_writers` - Find where a property or state is written.
- `grepai_grepai_refs_graph` - Build complete property usage graph.

**Workspace Tools:**
- `grepai_grepai_list_workspaces` - List all available workspace names.
- `grepai_grepai_list_projects` - List projects within a workspace. Parameters: workspace (required).

**Status Tools:**
- `grepai_grepai_index_status` - Check index health and statistics. Parameters: verbose (optional), workspace.

## When to Use GrepAI

**Use GrepAI as your PRIMARY tool for:**
- Understanding what code does or where functionality lives
- Finding implementations by intent or behavior
- Exploring unfamiliar parts of the codebase
- Understanding function dependencies before refactoring
- Cross-project search in multi-repo setups
- Tracking property/state usage patterns

**Use standard tools (grep/glob) only for:**
- Exact text matching (variable names, imports, specific strings)
- File path patterns

## Output Format Optimization

GrepAI supports multiple output formats optimized for different use cases:

**Default format** - Human-readable with file paths, line numbers, scores, and code snippets. Use for exploration and understanding.

**Compact mode** (`compact: true`) - Omits the content field, reducing token usage by approximately 80%. Use when you only need file locations and scores, not the actual code snippets.

**TOON format** (`format: "toon"`) - Token-Oriented Object Notation, approximately 50% fewer tokens than JSON. Use for high-volume operations or when token efficiency is critical.

**Recommendation:** For AI agent operations, use `compact: true` by default unless you specifically need to see code snippets in the results. Use `format: "toon"` when making many search calls or working with large result sets.

## Query Best Practices

**Use English for queries** - Embedding models are trained on English and perform best with English queries.

**Describe INTENT, not implementation** - Write "handles user login" instead of "func Login" or "function that validates user credentials" instead of "validateUser".

**Be specific with terminology** - "JWT token validation" is better than just "token". Include domain-specific terms when relevant.

**Natural language works best** - "how are errors handled in API requests" is more effective than "error handler".

**Good query examples:**
- "user authentication flow"
- "database connection pooling"
- "error handling middleware"
- "JWT token validation logic"

**Bad query examples:**
- "auth" (too vague)
- "function Login" (describes implementation, not intent)
- "JWT token expiration validation check implementation" (overly specific)

## Workflow Patterns

**Standard Investigation Workflow:**
1. Start with `grepai_grepai_search` to find relevant code by describing what it does
2. Use `grepai_grepai_trace_callers` or `grepai_grepai_trace_callees` to understand dependencies
3. Use the `read` tool to examine the specific files identified by GrepAI
4. Use `grep` only for exact string matching within the narrowed scope

**Before Refactoring Workflow:**
1. Use `grepai_grepai_trace_callers` to find all functions that depend on the code you plan to change
2. Use `grepai_grepai_trace_graph` to visualize the complete dependency chain
3. Read the caller files to understand usage patterns
4. Make informed refactoring decisions based on actual usage

**Cross-Project Search (Workspace Mode):**
1. Use `grepai_grepai_list_workspaces` to see available workspaces
2. Use `grepai_grepai_search` with workspace parameter to search across all projects
3. Optionally filter by specific projects using the project parameter
4. Use path parameter to narrow results to specific directories

**Property/State Tracking (Vue/Pinia):**
1. Use `grepai_grepai_refs_readers` to find where state is accessed
2. Use `grepai_grepai_refs_writers` to find where state is modified
3. Use `grepai_grepai_refs_graph` to see complete usage patterns

## Rules

Start with grepai_grepai_search for broad exploration and code discovery. Use trace tools when you need to understand a specific function's dependencies and callers before making changes. Use refs tools for property and state tracking, especially in reactive frameworks. Rely on GrepAI tools first for investigation — file operation tools (read, glob, grep) are fallbacks only after GrepAI has identified the specific files you need. Once GrepAI identifies relevant files, read those files using the read tool to understand their full context. Use the grep tool for exact string matching only when semantic search has narrowed the scope to specific files. Always use compact mode or TOON format for token efficiency unless you need to see code snippets in results.

## Anti-patterns

**Anti-pattern: Using file tools first for exploration**

What it looks like: You need to find authentication code. You call glob with "auth*.ts" to find files, getting back 20 results. You read all of them trying to find the right one.

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

**Anti-pattern: Using trace when you need refs**

What it looks like: You try to use grepai_grepai_trace_callers to find where a Vue store property is accessed, but get no results because it's not a function call.

Why it fails: Trace tools work on function calls. For property and state access patterns, use refs tools instead (grepai_grepai_refs_readers, grepai_grepai_refs_writers).

## Good and Bad Examples

**Good:** You need to understand token validation. You call grepai_grepai_search with query "token validation flow" and compact true. Results point you to three files. You read those files with the read tool. If you need to understand what functions call validateToken, you use grepai_grepai_trace_callers with symbol "validateToken" to map the call graph.

**Good:** Before refactoring a critical function, you call grepai_grepai_trace_graph with symbol "processPayment" and depth 3 to understand the complete dependency chain. This reveals 8 callers across 4 files that you need to consider.

**Good:** You need to find where a Pinia store property is being modified. You call grepai_grepai_refs_writers with the property name to see all write locations.

**Bad — uses glob first:** You need to find authentication code, so you call glob("**/*auth*.ts") and read 15 files trying to find validation logic. Use grepai_grepai_search instead.

**Bad — overly specific semantic query:** You search for "JWT token expiration validation check implementation" when "token validation" would work better and return more relevant results.

**Bad — reads all weak results:** GrepAI returns results with scores 0.55 and 0.60. You read all of them even though they are likely false positives. Revise your query instead.

**Bad — wastes tokens:** You make 10 grepai_grepai_search calls without compact mode, getting back full code snippets each time when you only needed file paths and scores.

**Bad — wrong tool for the job:** You try to use grepai_grepai_trace_callers to find where a Vue reactive property is accessed. Use grepai_grepai_refs_readers instead.
