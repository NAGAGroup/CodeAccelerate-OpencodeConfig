---
name: searching-deeper
description: Teaches how to use glob, grep, and read alongside grepai for deep, exhaustive investigation of specific code areas.
---

# What does this skill teach?

In this skill, you learn how to go beyond grepai's semantic search to build exhaustive, evidence-grounded understanding of specific code areas. GrepAI finds where things are — this skill teaches you how to verify coverage, trace exact references, and read full context.

## When to use this

After the grepai skill's investigation procedure gives you initial orientation (index status, README, broad discovery), use this skill's investigation loop for each sub-area your goal requires you to understand deeply.

## The investigation loop

For each sub-area or subgoal in your investigation, execute this loop:

### 1. Semantic search (grepai)

Run `grepai_grepai_search` with queries specific to this sub-area. Each sub-area gets its own natural-language queries — the queries are different every iteration because you're targeting a different aspect of the codebase. Use trace tools (`grepai_grepai_trace_callers`, `grepai_grepai_trace_callees`, `grepai_grepai_trace_graph`) when you need to map relationships between the symbols you find.

This gives you candidate files, symbols, and line numbers to work from.

### 2. Coverage verification (glob)

Use `glob` to verify grepai didn't miss relevant files. GrepAI searches by semantic similarity — it can miss files with unexpected names, unconventional structures, or content that doesn't match your query phrasing.

- Glob for file patterns related to the sub-area: `**/*auth*`, `**/*.config.*`, `**/test/**`
- Glob for sibling files in directories grepai surfaced: if grepai found `src/handlers/user.ts`, glob `src/handlers/*` to see what else lives there
- Compare glob results against grepai results — anything glob found that grepai didn't is worth investigating

### 3. Exact pattern matching (grep)

Use `grep` to find exact references that semantic search can't reliably surface. Use the specific symbols, function names, variable names, error strings, and type names you discovered in steps 1-2 as grep patterns.

- Grep for function/method names to find all call sites
- Grep for type names to find all usage points
- Grep for string literals (error messages, config keys) to find where they originate and propagate
- Use the `include` parameter to narrow to relevant file types

### 4. Full context (read)

Use `read` to get the full content of files that matter for this sub-area. This is where you build the actual evidence for your findings.

- Read files to understand the complete implementation, not just the snippets grepai returned
- Read directories to discover project structure: `read` on a directory returns the file listing, which reveals files that neither grepai nor glob surfaced
- Use `offset` and `limit` for large files — read the relevant sections, not the entire file

### Repeat

Move to the next sub-area and start the loop again with new grepai queries. Each iteration targets a different aspect of the investigation goal.

## How to think through this skill

<|think|>
- Have I decomposed my investigation goal into distinct sub-areas that each need their own search queries?
- For the current sub-area: have I run grepai with queries specific to THIS sub-area, not recycled from a previous one?
- After grepai: did I glob to check for files it might have missed — unexpected names, sibling files, related patterns?
- After glob: did I grep for exact symbols and strings from my findings to find all references?
- After grep: did I read the full context of the files that matter, not just rely on search snippets?
- Am I citing specific file paths and line numbers for every claim I make?
- Have I checked directory listings with `read` to discover project structure I might be missing?
