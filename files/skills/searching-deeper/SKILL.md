---
name: searching-deeper
description: Teaches how to use glob, grep, and read alongside grepai for deep, exhaustive investigation of specific code areas.
---
<rules>
Always start with grepai semantic searches — never skip straight to glob or grep. grepai finds what you don't know to look for; glob and grep find what you already know to look for.
Run multiple varied grepai queries — a single search misses relevant code. Vary the angle, the scope, and the specificity.
Use the trace tools (trace_callers, trace_callees, trace_graph) when investigating functions or symbols — they reveal relationships that keyword searches miss.
Use glob and grep to verify and expand on grepai findings, not as a substitute for them.
Use read only after grepai or glob/grep has told you which file to read. Do not guess file paths.
</rules>

<workflow>
Phase 1 — Semantic discovery (grepai):
  grepai_grepai_index_status() // always check index health first
  grepai_grepai_search(query="[semantic description — what the code does, not what it's called]", compact=True, format="toon") // broad orientation
  grepai_grepai_search(query="[more specific semantic query]", path="[relevant directory]", compact=False) // focused
  grepai_grepai_search(query="[another angle on the same topic]", limit=5, compact=False) // vary the approach

Phase 2 — Relationship tracing (grepai trace tools):
  grepai_grepai_trace_callers(symbol="[function name]") // who calls this?
  grepai_grepai_trace_callees(symbol="[function name]") // what does this call?
  grepai_grepai_trace_graph(symbol="[function name]", depth=2) // full call graph around this symbol

Phase 3 — Precision targeting (glob/grep):
  Glob(pattern="**/*.ts") // find files by name pattern when you know what to look for
  Grep(pattern="[exact string or regex]", include="*.ts") // find exact strings across files

Phase 4 — Full context (read):
  Read(filePath="[path identified by grepai or glob/grep]") // read the full file for context
  // NOTE: Read is the only tool that satisfies the "must read before editing" requirement — grepai results do not
</workflow>
