---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---
<tools>
grepai_grepai_index_status — index health and file coverage. No parameters required.

grepai_grepai_search — semantic search. Required: query. Optional: limit (default 10), compact (paths/lines only, no content), format ("toon" saves tokens), path (restrict to directory or file).

grepai_grepai_trace_callers — everything that calls a function. Required: symbol. Optional: compact.

grepai_grepai_trace_callees — everything a function calls. Required: symbol. Optional: compact.

grepai_grepai_trace_graph — full call graph. Required: symbol. Optional: depth (default 2).

Trace tools are not available to all agents. Skip those steps if you do not have access.
</tools>

<example name="good-vs-bad-queries">
Bad — keyword, too narrow:
  grepai_grepai_search(query="config")
  grepai_grepai_search(query="processor.ts")

Good — describes what the code does:
  grepai_grepai_search(query="loads and validates configuration at startup")
  grepai_grepai_search(query="transforms input data before passing to the next stage")
</example>

<example name="discovery-pass">
Check index first:
  grepai_grepai_index_status()

Broad discovery with compact+toon to map the landscape cheaply:
  grepai_grepai_search(query="entry point and application bootstrap", compact=True, format="toon")
  grepai_grepai_search(query="handles incoming work and routes it to the right handler", compact=True, format="toon")
  grepai_grepai_search(query="reads and writes persistent state", compact=True, format="toon")
  grepai_grepai_search(query="configuration and environment setup", compact=True, format="toon")

Each query targets a different aspect. Run as many as the goal requires.
</example>

<example name="targeted-read">
Once discovery identifies where things are, drill into a specific area:
  grepai_grepai_search(query="manages the lifecycle of long-running operations", path="src/core/")

Then trace if available:
  grepai_grepai_trace_callers(symbol="processJob", compact=True)
</example>

<rules>
Describe what code does in queries, not what it is called.
Use compact=True and format="toon" for discovery. Reserve full reads for targeted follow-up.
Run multiple varied queries — stopping at the first result misses relevant code.
</rules>
