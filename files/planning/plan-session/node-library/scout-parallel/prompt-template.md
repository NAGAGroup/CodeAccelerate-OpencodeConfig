# Codebase Exploration

You are HeadWrench, the orchestrator. In this node, write and dispatch three ContextScout task prompts targeting different codebase areas.

Dispatch three `@ContextScout` agents to explore different areas of the codebase. Call all three `task` tools sequentially — OpenCode runs them concurrently.

## Guidance

Each scout goal should be a specific question or targeted area — not just "explore X". Good: "Identify all files that import AuthService and trace the token-refresh flow." Bad: "Look at the auth code."

If only two areas need coverage, drop one scout section and adjust the todo array to `["task","task"]` in plan.json.

## Scout 1 — Affected code

{{SCOUT_1_GOAL}}

*Specific question anchored to the paths below. Good: "Find all files that import AuthService and identify which ones call refreshToken." Bad: "Look at the auth code." The question must be answerable within 12 steps.*

Paths to explore: {{SCOUT_1_PATHS}}

*List as comma-separated paths or globs: e.g., `src/auth/`, `lib/utils/**` Bad: `auth code` (thematic label, not a path — ContextScout cannot locate files from this).*

## Scout 2 — Patterns and architecture

{{SCOUT_2_GOAL}}

*Specific question anchored to the paths below. Good: "Read src/**/*.ts and identify naming conventions, module organization, and any shared utility patterns." Bad: "Look at the patterns." The question must be answerable within 12 steps.*

Paths to explore: {{SCOUT_2_PATHS}}

*List as comma-separated paths or globs: e.g., `src/auth/`, `lib/utils/**` Bad: `auth code` (thematic label, not a path — ContextScout cannot locate files from this).*

## Scout 3 — Dependencies and boundaries

{{SCOUT_3_GOAL}}

*Specific question anchored to the paths below. Good: "Read package.json, bun.lockb, and any import-graph or config files to identify external dependencies and integration boundaries." Bad: "Find the dependencies." The question must be answerable within 12 steps.*

Paths to explore: {{SCOUT_3_PATHS}}

*List as comma-separated paths or globs: e.g., `src/auth/`, `lib/utils/**` Bad: `auth code` (thematic label, not a path — ContextScout cannot locate files from this).*

## Scope restriction

**Do NOT** send scouts into `.opencode/` session directories — completed sessions contain stale content. Exception: planning infrastructure files (e.g., the node-library) are permitted when explicitly specified.

## Before advancing

If scout results surfaced unexpected findings, ambiguities, or anything that might affect the plan direction, consider flagging it to the user before calling `next_step()`. This is optional — if results are clear, advance when ready.

## Fill examples

**Example 1 — TypeScript API service:**
- Scout 1 goal: "Find all files under `src/auth/` and `src/middleware/`. Report exact file paths and what each exports."
- Scout 1 paths: `src/auth/**`, `src/middleware/**`
- Scout 2 goal: "Read `tsconfig.json`, `package.json`, and any `*.config.ts` files. Report naming conventions and module structure patterns."
- Scout 2 paths: `tsconfig.json`, `package.json`, `*.config.ts`
- Scout 3 goal: "Read `package.json` and `bun.lockb`. Report all external dependencies with versions."
- Scout 3 paths: `package.json`, `bun.lockb`

## Output format requirement (fixed)

Each scout's task prompt must instruct the agent: "Report findings as specific facts and file locations — not as generic 'Codebase Overview', 'Key Decisions', or 'Patterns' sections. List what you found with exact references." Include this instruction verbatim in every scout dispatch.

## Todo

> **Writing scout prompts:** For each scout's task prompt, include: (1) the specific file paths or glob patterns specified for that scout; (2) a clear goal statement; (3) this instruction verbatim: "Report findings as specific facts and file locations — not as generic 'Codebase Overview', 'Key Decisions', or 'Patterns' sections. List what you found with exact references." (4) termination condition: "Return findings when done — do not wait for user confirmation or ask clarifying questions."

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ContextScout to explore affected code: {{SCOUT_1_GOAL}}
2. `task` — Dispatch @ContextScout to explore patterns and architecture: {{SCOUT_2_GOAL}}
3. `task` — Dispatch @ContextScout to explore dependencies and boundaries: {{SCOUT_3_GOAL}}

Call all three task tools before waiting for results — they run in parallel.
