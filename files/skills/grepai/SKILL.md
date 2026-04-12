---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for project exploration.
---
<rules>
Always run `grepai status` before searching — if the index is stale or unhealthy, results may include deleted files or miss recent changes.
Always describe what code does in queries, never what it is called. "user login validation" not "login". "how errors are handled in API requests" not "error handling".
Always run multiple varied queries — one query never covers it. Vary the angle, specificity, and path scope.
Always default to `--toon --compact` — only drop `--compact` when you need to read the actual code.
Never stop at the first result — use broad searches to orient, then narrow with `--path` and follow-up queries.
</rules>

<workflow>
Step 1 — Check index health:
  grepai status

Step 2 — Broad orientation (compact, no content):
  grepai search "[describe what the code does, not its name]" --toon --compact --limit 10
  grepai search "[another angle on the same goal]" --toon --compact --limit 10
  grepai search "[README to understand project context]" --path README.md --toon --compact

Step 3 — Focused follow-up (narrow path, read content):
  grepai search "[specific behavior]" --path src/[relevant-dir] --toon --limit 5
  grepai search "[related aspect]" --path src/[relevant-dir] --toon --compact --limit 5

Step 4 — Trace relationships (once you have a symbol):
  grepai trace callers "[FunctionName]" --json    // who calls this?
  grepai trace callees "[FunctionName]" --json    // what does this depend on?
  grepai trace graph "[FunctionName]" --depth 2 --json  // full call graph

// Use search to FIND code. Use trace to EXPLORE relationships.
// Trace is more reliable than searching for relationships semantically.
</workflow>

<query tips>
Good:  "user login validation and session creation"
Bad:   "login"

Good:  "how database connections are managed and pooled"
Bad:   "db connect"

Good:  "where and how errors are surfaced to the caller"
Bad:   "error handling"

Good:  "CMake build configuration for external library dependencies"
Bad:   "CMakeLists"
</query tips>
