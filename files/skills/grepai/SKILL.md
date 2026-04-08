---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for code investigation and dependency tracing.
---

# What does this skill teach?

In this skill, you learn how to use GrepAI to find code by describing what it does and to trace how code elements connect across files.

## Tool reference

### `grepai_grepai_index_status`

| Parameter | Description |
|-----------|-------------|
| *(none required)* | Returns index health and statistics about indexed files |

### `grepai_grepai_search`

| Parameter | Description |
|-----------|-------------|
| `query` | Natural language description of what the code does — not keywords (required) |
| `limit` | Max results to return, default 10 (optional) |
| `compact` | Return file paths and line numbers only, without content (optional) |
| `format` | Use `'toon'` for ~50% fewer tokens (optional) |
| `path` | Restrict search to a specific file or directory prefix (optional) |

### Trace tools (not available to all agents)

The following tools are used for dependency tracing. If you do not have access to these tools, ignore this section entirely.

**`grepai_grepai_trace_callers`** — Find everything that calls a function. Params: `symbol` (required), `compact` (optional).

**`grepai_grepai_trace_callees`** — Find everything a function calls. Params: `symbol` (required), `compact` (optional).

**`grepai_grepai_trace_graph`** — Full call graph around a function. Params: `symbol` (required), `depth` (optional, default 2).

## How to think through this skill

<|think|>
- Am I following the investigation procedure in order — index status, then README, then broad discovery, then targeted reads?
- Am I describing what the code does in natural language, or am I using keywords that won't match semantically?
- Am I using compact=true and toon format for discovery searches to save tokens?
- Am I using the path argument to narrow targeted reads to specific files or directories?
- Have I run enough varied queries to be confident I've found all relevant code, or did I stop at the first result?
- Do I have access to trace tools? If yes, have I used them to understand connections? If no, have I skipped that section?

## Investigation procedure

This is your plan. Execute these steps in order — do not devise your own investigation strategy.

1. **Check index health.** Call `grepai_grepai_index_status`. If the index is unhealthy or missing files, note this in your findings. Do not skip this step.

2. **Read the README.** Call `grepai_grepai_search` with `path` set to `"README.md"` and a broad query describing the project's purpose. The README is the single most information-dense file in most projects. If no README exists, continue to step 3.

3. **Broad discovery.** Run `grepai_grepai_search` with `compact=true` and `format='toon'` using varied natural-language queries — one per aspect you need to understand. This gives you a map of where things are without burning tokens on full content.

4. **Targeted reads.** For the most relevant files identified in step 3, run `grepai_grepai_search` again without `compact=false` and with a `path` argument to retrieve full content from specific directories or files.

5. **Trace connections (if available).** If you have access to `grepai_grepai_trace_callers`, `grepai_grepai_trace_callees`, or `grepai_grepai_trace_graph`, use them now to understand how the code you found in steps 3-4 connects. Skip this step if these tools are not available to you.
