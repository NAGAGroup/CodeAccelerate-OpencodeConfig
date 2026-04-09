---
name: searching-deeper
description: Teaches how to use glob, grep, and read alongside grepai for deep, exhaustive investigation of specific code areas.
---
<overview>
Use this skill after the grepai investigation procedure gives initial orientation. For each sub-area your goal requires you to understand deeply, run the investigation loop below.
</overview>

<procedure name="investigation-loop">
For each sub-area or subgoal, execute these steps in order:

Step 1 — Semantic search. Run grepai_grepai_search with queries specific to this sub-area. Use trace tools if available to map relationships between symbols found.

Step 2 — Coverage verification. Use glob to check for files grepai may have missed — files with unexpected names, unconventional structures, or content that does not match query phrasing. Glob for patterns related to the sub-area and for sibling files in directories grepai surfaced. Compare glob results against grepai results.

Step 3 — Exact pattern matching. Use grep to find exact references that semantic search cannot reliably surface. Grep for the specific function names, type names, variable names, error strings, and config keys discovered in steps 1-2. Use the include parameter to narrow to relevant file types.

Step 4 — Full context. Use read to get the full content of files that matter. Read directories to discover project structure. Use offset and limit for large files.

Then repeat for the next sub-area with new queries.
</procedure>

<rules>
Cite specific file paths and line numbers for every claim.
Each sub-area gets its own queries — do not recycle queries from a previous iteration.
Read directories with read to discover structure that neither grepai nor glob surfaced.
</rules>
