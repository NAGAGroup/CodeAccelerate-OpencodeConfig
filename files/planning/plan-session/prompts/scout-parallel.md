# Scouts 2 + 3 — Targeted Exploration

Call `task` twice in a single response to dispatch Scout 2 and Scout 3 in parallel.

**Todo:** `["task", "task"]`

> **Scout 2 — Code Patterns**
>
> (1) Dispatch @ContextScout subagent using the user's task description and Scout 1's project map.
> (2) Ask: identify naming conventions, structural patterns, and coding style in files relevant to the task.
> (3) Extract patterns with file:line citations — not thematic summaries.
> (4) Do NOT read `.opencode/` directory.
> (5) Return: specific patterns and file references, or state "Nothing found."
> (6) Output constraint: file paths and extracted patterns only — no interpretation.

> **Scout 3 — Dependencies & Integration**
>
> (1) Dispatch @ContextScout subagent using the user's task description and Scout 1's project map.
> (2) Ask: identify build dependencies, external libraries, public interfaces, and integration boundaries relevant to the task.
> (3) Extract dependency names, versions, and exact file references.
> (4) Do NOT read `.opencode/` directory.
> (5) Return: dependency information and API surfaces, or state "No relevant boundaries found."
> (6) Output constraint: dependency data and file references only — no narrative.

Call `next_step()` after both tasks complete.
