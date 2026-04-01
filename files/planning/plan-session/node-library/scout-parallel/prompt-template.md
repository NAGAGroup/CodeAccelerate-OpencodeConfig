# Codebase Exploration — scout-parallel

Dispatch two @ContextScout agents in parallel to gather context from specific file regions.

**Todo:** `["task", "task"]`

## Zone 1 — Fixed execution spec

1. Dispatch two @ContextScout subagents in a single response turn — one per template below
2. Fill all `{{SCOUT_N_*}}` slots, then use each template verbatim as that scout's `prompt` field

**Scout 1 template:**
```
Discovery question: {{SCOUT_1_QUESTION}}

Files/patterns to read: {{SCOUT_1_FILES}}

Do NOT read .opencode/ directory. Use glob patterns like glob("src/**/*.ts").

Return: specific findings with file:line citations. State "Nothing found" if nothing is relevant. No interpretation.
```

**Scout 2 template:**
```
Discovery question: {{SCOUT_2_QUESTION}}

Files/patterns to read: {{SCOUT_2_FILES}}

Do NOT read .opencode/ directory. Use glob patterns like glob("src/**/*.ts").

Return: specific findings with file:line citations. State "Nothing found" if nothing is relevant. No interpretation.
```

## Zone 2 — Planning agent fills

**{{SCOUT_1_QUESTION}}**
Specific discovery question for the first scout.
✓ Good: "What functions are exported from src/api/?"
✗ Bad: "Analyze the API layer"

**{{SCOUT_1_FILES}}**
Glob patterns for Scout 1's file search.
✓ Good: `glob("src/api/**/*.ts")`
✗ Bad: `glob("src/api/index.ts,src/api/routes.ts")`

**{{SCOUT_2_QUESTION}}**
Specific discovery question for the second scout.
✓ Good: "What naming conventions do kernel functions follow in src/kernels/?"
✗ Bad: "Find the patterns"

**{{SCOUT_2_FILES}}**
Glob patterns for Scout 2's file search.
✓ Good: `glob("src/kernels/**/*.cpp")`
✗ Bad: "the kernel directory"

## Zone 3 — Fixed constraints

Do not read `.opencode/`. Each scout is independent. Return raw findings only — no thematic summaries or generic headers.
