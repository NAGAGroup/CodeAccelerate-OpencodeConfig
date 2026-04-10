---
name: searching-deeper
description: Teaches how to use glob, grep, and read alongside grepai for deep, exhaustive investigation of specific code areas.
---
<rules>
Use this after grepai gives initial orientation. For each sub-area, run the full four-step loop before moving on.
Each sub-area gets its own queries — never recycle queries from a previous iteration.
Read directories with read to discover structure that neither grepai nor glob surfaced.
Ask yourself after each iteration: are there more sub-areas I should investigate before stopping?
</rules>

<example>
For each sub-area or subgoal, run these four steps in order:

Step 1 — Semantic search.
  grepai_grepai_search(query="[specific to this sub-area]")
  grepai_grepai_trace_callers(symbol="[symbol found in step 1]")  // if available

Step 2 — Coverage verification.
  glob(pattern="[pattern related to sub-area]")  // check for files grepai may have missed
  // Compare glob results against grepai results. Unexpected files here are worth reading.

Step 3 — Exact pattern matching.
  grep(pattern="[exact function/type/variable names found in steps 1-2]", include="*.ts")
  // Use grep for exact references semantic search cannot reliably surface.

Step 4 — Full context.
  read("/path/to/important/file.ts")  // full content of files that matter
  read("/path/to/directory/")  // discover structure that wasn't surfaced yet

Then repeat for the next sub-area with new queries.
</example>
