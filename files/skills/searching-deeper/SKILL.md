---
name: searching-deeper
description: Teaches how to use filesystem tools, grep, and grepai for deep, exhaustive investigation of specific code areas.
---
<rules>
Always start with grepai — never skip straight to filesystem tools or grep. grepai finds what you don't know to look for; filesystem and grep find what you already know to look for.
Always run multiple varied grepai queries — vary the angle, scope, and path.
Always use trace tools when investigating a specific function or symbol — they reveal relationships that semantic searches miss.
Use filesystem_search_files and grep to verify and expand on grepai findings, not as a substitute.
Never guess file paths — use filesystem_read_file only after grepai or grep has identified the file.
</rules>

<workflow>
Phase 1 — Semantic discovery (grepai):
  grepai_grepai_index_status()  // always check index health first
  grepai_grepai_search(query="[describe what the code does]", compact=True, format="toon")
  grepai_grepai_search(query="[more specific angle]", path="[relevant-dir]", compact=False)
  grepai_grepai_search(query="[another angle]", path="[relevant-dir]", compact=True, format="toon", limit=5)

Phase 2 — Relationship tracing (once you have a symbol):
  grepai_grepai_trace_callers(symbol="[FunctionName]", compact=False)  // who calls this?
  grepai_grepai_trace_callees(symbol="[FunctionName]", compact=False)  // what does this depend on?
  grepai_grepai_trace_graph(symbol="[FunctionName]", depth=2)          // full call graph

Phase 3 — Precision targeting (filesystem/grep):
  filesystem_search_files(path=".", pattern="*.ts")  // find files by name pattern
  grep(pattern="[exact string or regex]", include="*.ts")  // find exact strings

Phase 4 — Full context (filesystem):
  filesystem_read_file(path="[path identified above]")  // read full file for context
</workflow>
