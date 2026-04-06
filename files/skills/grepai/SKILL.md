# GrepAI Semantic Search and Code Intelligence

This skill teaches how to use GrepAI semantic search and code intelligence tools effectively. Load it when you need to investigate code, locate files, understand dependencies, or trace function calls through the codebase.

## GrepAI Tools and When to Use Them

Use grepai_grepai_search for semantic code search when exploring by intent or behavior:

```
grepai_grepai_search({
  query: "authentication token validation",
  limit: 10
})
```

Use grepai_grepai_trace_callers to find which functions call a specific function:

```
grepai_grepai_trace_callers({
  symbol: "validateToken"
})
```

Use grepai_grepai_trace_callees to find which functions a specific function calls:

```
grepai_grepai_trace_callees({
  symbol: "validateToken"
})
```

Use grepai_grepai_trace_graph to see both callers and callees for complete dependency analysis:

```
grepai_grepai_trace_graph({
  symbol: "validateToken",
  depth: 2
})
```

## Rules

Start with grepai_grepai_search for broad exploration and code discovery. Use trace tools when you need to understand a specific function's dependencies and callers before making changes. Rely on GrepAI tools first for investigation — file operation tools (read, glob, grep) are fallbacks only after GrepAI has identified the specific files you need. Once GrepAI identifies relevant files, read those files using the read tool to understand their full context. Use the grep tool for exact string matching only when semantic search has narrowed the scope to specific files.

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

## Good and Bad Examples

**Good:** You need to understand token validation. You call grepai_grepai_search with query "token validation flow". Results point you to three files. You read those files with the read tool. If you need to understand what functions call validateToken, you use grepai_grepai_trace_callers with symbol "validateToken" to map the call graph.

**Bad — uses glob first:** You need to find authentication code, so you call glob("**/*auth*.ts") and read 15 files trying to find validation logic. Use grepai_grepai_search instead.

**Bad — overly specific semantic query:** You search for "JWT token expiration validation check implementation" when "token validation" would work better and return more relevant results.

**Bad — reads all weak results:** GrepAI returns results with scores 0.55 and 0.60. You read all of them even though they are likely false positives. Revise your query instead.
