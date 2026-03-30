# Codebase Exploration

Dispatch three `@ContextScout` agents to explore different areas of the codebase. Call all three `task` tools sequentially — OpenCode runs them concurrently.

## Guidance

Each scout goal should be a specific question or targeted area — not just "explore X". Good: "Identify all files that import AuthService and trace the token-refresh flow." Bad: "Look at the auth code."

If only two areas need coverage, drop one scout section and adjust the todo array to `["task","task"]` in plan.json.

## Scout 1 — Affected code

{{SCOUT_1_GOAL}}

Paths to explore: {{SCOUT_1_PATHS}}

*List as comma-separated paths or globs: e.g., `src/auth/`, `lib/utils/**`*

## Scout 2 — Patterns and architecture

{{SCOUT_2_GOAL}}

Paths to explore: {{SCOUT_2_PATHS}}

*List as comma-separated paths or globs: e.g., `src/auth/`, `lib/utils/**`*

## Scout 3 — Dependencies and boundaries

{{SCOUT_3_GOAL}}

Paths to explore: {{SCOUT_3_PATHS}}

*List as comma-separated paths or globs: e.g., `src/auth/`, `lib/utils/**`*

## Scope restriction

**Do NOT** send scouts into `.opencode/` session directories — completed sessions contain stale content. Exception: planning infrastructure files (e.g., the node-library) are permitted when explicitly specified.

## Todo

1. `task` — Dispatch @ContextScout to explore affected code: {{SCOUT_1_GOAL}}
2. `task` — Dispatch @ContextScout to explore patterns and architecture: {{SCOUT_2_GOAL}}
3. `task` — Dispatch @ContextScout to explore dependencies and boundaries: {{SCOUT_3_GOAL}}

Call all three task tools before waiting for results — they run in parallel.

## Before advancing

If scout results surfaced unexpected findings, ambiguities, or anything that might affect the plan direction, consider flagging it to the user before calling `next_step()`. This is optional — if results are clear, advance when ready.
