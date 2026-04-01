# Scout 1 — Project Map

Call `task` to dispatch @ContextScout to build a zero-assumption project map of the repository.

**Todo:** `["task"]`

> (1) Dispatch @ContextScout subagent with no task context — its job is discovery only.
> (2) Ask: read the repository structure, identify key files (build configs, entry points, manifests), and extract directory purpose from file layouts.
> (3) Glob examples: ✓ `glob("src/**/*.ts")` / ✗ `glob("a.ts,b.ts,c.ts")` — use `**` for recursive, not comma lists.
> (4) Scope: read actual source files only; do NOT read `.opencode/` directory.
> (5) Return: bulleted list with file paths verbatim, no interpretation or section headers.
> (6) Output constraint: flat bulleted list only — no prose narrative, no analysis.

Call `next_step()` after the task completes.
