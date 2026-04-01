# Deep Analysis

Dispatch @ContextInsurgent to answer a specific analysis question across multiple files.

**Todo:** `["task"]`

## Zone 1 — Fixed execution spec

1. Dispatch @ContextInsurgent subagent
2. Fill `{{ANALYSIS_QUESTION}}` and `{{FILE_LIST}}` in the template below, then use it verbatim as the `prompt` field

```
You are a subagent. The primary agent is executing a task and has delegated this analysis to you. Do not ask the user questions.

Analysis question: {{ANALYSIS_QUESTION}}

Files to read: {{FILE_LIST}}

Read only the specified files and answer the analysis question above. Trace the exact code paths. Do not read .opencode/ or any files not listed.

Return a structured report with file:line citations. No thematic summaries — specific findings only.
```

## Zone 2 — Planning agent fills

**{{ANALYSIS_QUESTION}}**
One specific question that requires evidence (file paths, line numbers, code strings) to answer.
✓ Good: "Which kernel dispatch sites pass raw host pointers instead of USM device allocations?"
✗ Bad: "Analyze the kernel system"

**{{FILE_LIST}}**
Exact repo-relative file paths, comma-separated.
✓ Good: `src/auth/login.py, src/auth/session.py, include/auth/types.h`
✗ Bad: "all kernel files" or "the compute module"

## Zone 3 — Fixed constraints

Do not read `.opencode/` session directories. Return findings verbatim — specific evidence only, no thematic summaries.
