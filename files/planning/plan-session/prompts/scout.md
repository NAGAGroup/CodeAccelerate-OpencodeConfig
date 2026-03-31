# Scout 1 — Project Map

## Your Role

Your job in this node: dispatch Scout 1 to build a zero-assumption project map. Call `next_step()` when done.

## Todo

1. `task` — Dispatch @ContextScout for full project map (zero task context). Wait for result.

---

## Dispatch Instructions

Dispatch a single @ContextScout agent to build a zero-assumption project map. Scout 1 gets **no task context** — its only job is to discover what exists.

> **VERBATIM COPY REQUIRED — copy the numbered instructions below word-for-word into your dispatch prompt. Do NOT paraphrase, summarize, or convert to prose.**
>
> **When dispatching @ContextScout (Scout 1), your task prompt must include these exact instructions:**
> (1) Use the `read` tool with path `.` to get the top-level file and directory list only (depth-1 entries).
> (2) From the depth-1 list, identify 3–5 files that look like the most important orientation anchors (README, build config, project manifest, top-level entry point — whatever the project structure suggests). Read those files.
> (3) Return: the complete depth-1 entries list **verbatim as-is, one per line**. Then append a high-level summary covering: the overall directory structure and purpose suggested by the top-level layout, plus a brief description of each key file you read and what it reveals about the project's purpose and entry points.
> (4) Do NOT interpret the task or filter for relevance — return everything. HW will determine relevance.
> (5) Termination: return when you have the file list and key file summaries. Do not explore further.

✓ Good dispatch prompt: Contains the exact text `Use the \`read\` tool with path \`.\`` — copied verbatim from item (1) above.
✗ Bad: Rewriting item (1) as "Read the top-level directory structure" — this loses the tool name and causes the scout to use `glob` instead.
✗ Bad: "Find files related to the task." — Scout 1 gets no task context and must not filter by it.
✗ Bad: Using `glob` with `**/*` or recursively returning nested files — Scout 1's output must be depth-1-only.

## After Scout 1 Returns

Verify Scout 1's result: (a) it is not truncated mid-list; (b) it does not contain unexpectedly nested paths. If either condition fails, re-dispatch Scout 1 with stricter depth constraints before calling `next_step()`.

MUST call `next_step()` after Scout 1's result is verified. Do NOT dispatch Scouts 2 or 3 here — that happens in the next node.
