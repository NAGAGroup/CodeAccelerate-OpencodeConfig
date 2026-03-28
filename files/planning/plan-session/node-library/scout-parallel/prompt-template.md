# Codebase Exploration

Dispatch three `@ContextScout` agents to explore different areas of the codebase. Call all three `task` tools sequentially — OpenCode runs them concurrently.

## Scout 1 — Affected code

{{SCOUT_1_GOAL}}

Paths to explore: {{SCOUT_1_PATHS}}

## Scout 2 — Patterns and architecture

{{SCOUT_2_GOAL}}

Paths to explore: {{SCOUT_2_PATHS}}

## Scout 3 — Dependencies and boundaries

{{SCOUT_3_GOAL}}

Paths to explore: {{SCOUT_3_PATHS}}

## Scope restriction

**Do NOT** send scouts into `.opencode/` session directories — completed sessions contain stale content. Exception: planning infrastructure files (e.g., the node-library) are permitted when explicitly specified.

## Todo

1. `task` — Dispatch @ContextScout to explore affected code: {{SCOUT_1_GOAL}}
2. `task` — Dispatch @ContextScout to explore patterns and architecture: {{SCOUT_2_GOAL}}
3. `task` — Dispatch @ContextScout to explore dependencies and boundaries: {{SCOUT_3_GOAL}}

Call all three task tools before waiting for results — they run in parallel.
