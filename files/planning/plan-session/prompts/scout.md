# Scout Codebase

Gather planning context in three sequential phases. Follow the ordering exactly — each phase depends on the previous.

## Phase 1: Project Map (Scout 1, BLOCKING)

Scout 1 has **zero knowledge of the user's task**. Its only job is to discover what exists so you can write informed prompts for the next phase.

**Dispatch Scout 1 and wait for its result before proceeding.**

> **When dispatching @ContextScout (Scout 1), your task prompt must tell the agent to:**
> (1) Use the `glob` tool with pattern `*` to get the top-level file and directory list only (depth-1 entries).
> (2) From the depth-1 list, identify 3–5 files that look like the most important orientation anchors (README, build config, project manifest, top-level entry point — whatever the project structure suggests). Read those files.
> (3) Return: the complete depth-1 entries list **verbatim as-is, one per line**. Then append a high-level summary covering: the overall directory structure and purpose suggested by the top-level layout, plus a brief description of each key file you read and what it reveals about the project's purpose and entry points.
> (4) Do NOT interpret the task or filter for relevance — return everything. HW will determine relevance.
> (5) Termination: return when you have the file list and key file summaries. Do not explore further.

✓ Good: Uses `glob` with pattern `*`, returns top-level paths one-per-line verbatim, then a brief structural overview and 3–5 key file summaries.

✗ Bad: "Find files related to the task." — Scout 1 gets no task context and must not filter by it.
✗ Bad: Using `glob` with `**/*` or recursively returning nested files — Scout 1's output must be depth-1-only.

Before dispatching Scouts 2 & 3, verify Scout 1's result: (a) it is not truncated mid-list; (b) it does not contain unexpectedly nested paths. If either condition fails, re-dispatch Scout 1 with stricter depth constraints before continuing.

**After Scout 1 returns:** Use the file list and summaries to write task-targeted prompts for Scouts 2 and 3.

## Phase 2: Task-Targeted Scouts (Scouts 2 + 3, PARALLEL, BLOCKING)

**You MUST dispatch Scouts 2 and 3 in the SAME response turn. Do NOT dispatch them in separate turns.**

❌ Wrong: Dispatch Scout 2. Wait for result. Then dispatch Scout 3.
✓ Correct: Include both Scout 2 and Scout 3 task tool calls in a single response.

Both scouts receive the user's task description and Scout 1's file map. Write both prompts using that context, then **emit both `task` calls in a single response turn**.

> **When dispatching @ContextScout (Scout 2), your task prompt must tell the agent to:**
> (1) Review the user's task description and Scout 1's file list.
> (2) Identify and read the files most relevant to the task, then extract: naming conventions, structural patterns, coding style, and any existing implementations the task will need to fit alongside.
> (3) Return: file paths read plus specific patterns found (naming, structure, style) with file:line citations — not thematic summaries.
> (4) State 'Nothing found' if an area has no content.

> **When dispatching @ContextScout (Scout 3), your task prompt must tell the agent to:**
> (1) Review the user's task description and Scout 1's file list.
> (2) Identify files that define build dependencies, external libraries, public interfaces, or integration points relevant to the task — then read and summarize them.
> (3) Return: dependency names and versions, public API surfaces, build system constraints — with exact file references.
> (4) State 'No relevant boundaries found' if nothing applies.

**Wait for both Scout 2 and Scout 3 to return before proceeding.**

## Todo

1. `task` — Dispatch @ContextScout for full project map (Scout 1). **Wait for result before proceeding.**

2. `task` — Dispatch @ContextScout for conventions and patterns in affected area (Scout 2, task-targeted using Scout 1's map). **Emit in same response as task 3.**

3. `task` — Dispatch @ContextScout for dependencies and integration boundaries (Scout 3, task-targeted using Scout 1's map). **Emit in same response as task 2.**

After all three tasks return, call `next_step()` to advance.
