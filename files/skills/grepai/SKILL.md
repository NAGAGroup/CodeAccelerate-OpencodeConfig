---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for project exploration.
---
<rules>
Always call grepai_grepai_index_status() before searching — stale or unhealthy indexes return results from deleted files.
Always describe what code does in queries, never what it is called. "user login validation" not "login". "how errors are handled in API requests" not "error handling".
Always run multiple varied queries — one query never covers it. Vary the angle, specificity, and path scope.
Always use compact=True and format="toon" by default — only set compact=False when you need to read the actual code content.
Never stop at the first result — use broad searches to orient, then narrow with path filtering and targeted follow-ups.
</rules>

<example>
// Step 1: always check index health first
grepai_grepai_index_status()

// Step 2: broad orientation (compact, no content)
grepai_grepai_search(query="[describe what the code does — behavior, not name]", compact=True, format="toon", limit=10)
grepai_grepai_search(query="[another angle on the same goal]", compact=True, format="toon", limit=10)
grepai_grepai_search(query="[README to understand project context]", path="README.md", compact=False)

// Step 3: focused follow-up (narrow path, read content)
grepai_grepai_search(query="[specific behavior]", path="src/[relevant-dir]", compact=False, limit=5)
grepai_grepai_search(query="[related aspect]", path="src/[relevant-dir]", compact=True, format="toon", limit=5)

// Step 4: trace relationships once you have a symbol name
grepai_grepai_trace_callers(symbol="[FunctionName]", compact=False)   // who calls this?
grepai_grepai_trace_callees(symbol="[FunctionName]", compact=False)   // what does this depend on?
grepai_grepai_trace_graph(symbol="[FunctionName]", depth=2)           // full call graph

// Use search to FIND code. Use trace to EXPLORE relationships.
// Trace is more reliable than searching for relationships semantically.

Bad — keyword, too narrow:
  grepai_grepai_search(query="config")
  grepai_grepai_search(query="processJob")

Good — semantic, varied angles:
  grepai_grepai_search(query="how jobs are queued and processed", compact=True, format="toon")
  grepai_grepai_search(query="job scheduling and retry logic", compact=True, format="toon")
  grepai_grepai_search(query="background task execution flow", path="src/workers", compact=False, limit=5)
</example>
