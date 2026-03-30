# Deep Analysis

You are HeadWrench. In this node, write and dispatch a single ContextInsurgent task prompt for deep multi-file reasoning.

@ContextInsurgent is serial and expensive — use after `scout-parallel` when haiku cannot handle the synthesis, or when multi-file root-cause reasoning is required. Do not use for simple file reads.

Dispatch `@ContextInsurgent` to perform deep multi-file reasoning on the following question:

## Analysis question

{{ANALYSIS_QUESTION}}

*A single specific, bounded question. Good: 'Which call sites invoke `verifyToken()` directly vs. through a middleware wrapper, and in which files?' Bad: 'Analyze the auth system.' (No bounded deliverable.)*

## Context to provide

{{CONTEXT_TO_PROVIDE}}

*The file list CI must read (e.g., `src/auth/token.ts`, `src/auth/helpers/*.ts`) and any prior scout findings to build on. Always include an explicit list of files — do not substitute contextual prose for file paths.*

## Expected output

{{EXPECTED_OUTPUT}}

*What form the answer takes. Good: 'A bullet list of all call sites for `refreshToken` with file paths and line numbers.' Bad: 'Whatever CI finds.' (No format — CI returns a narrative.)*

## Output format requirements

Answer the question directly with specific evidence from the code. Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings.

## Scope restriction

**Do NOT** instruct ContextInsurgent to read `.opencode/` session directories — completed sessions contain stale content that may poison analysis. Exception: planning infrastructure files (e.g., the node-library) are permitted when explicitly specified.

> **Writing the ContextInsurgent's prompt:** The prompt must specify: (1) the exact analysis question specified for this node; (2) which files or directories to read; (3) the expected return format — a direct answer with supporting evidence, not boilerplate section headers. Instruct the agent: "Do not produce generic 'Architecture Overview' or 'Key Decisions' sections. Answer the question directly with specific evidence from the code." (4) termination condition: "Return your full structured report when analysis is complete. Do not ask the user for confirmation."

## Fill examples

**Example 1 — Authentication call chain:**
- Analysis question: "Which files call `verifyToken()` directly vs. through middleware? List exact file paths and line numbers."
- Context to provide: "Scout findings: `src/auth/token.ts` (exports verifyToken), `src/middleware/auth.ts`, `src/routes/users.ts`. Read these three files."
- Expected output: "Bullet list of all call sites with file path, line number, and whether direct or via middleware."

**Example 2 — Data migration impact:**
- Analysis question: "Which database query functions will break if the `users` table schema changes to add a required `tenant_id` column?"
- Context to provide: "Scout found DB queries in `src/db/users.ts`, `src/db/sessions.ts`, `src/api/admin.ts`. Read these files."
- Expected output: "Per-function list of affected queries with file paths and line numbers."

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ContextInsurgent to analyze: {{ANALYSIS_QUESTION}}. Provide the agent with: {{CONTEXT_TO_PROVIDE}}. The agent should return: {{EXPECTED_OUTPUT}}.

## Before advancing

If the analysis revealed significant architectural concerns, unexpected complexity, or questions where user input would change the approach, consider surfacing them before calling `next_step()`. This is optional — if findings are clear and actionable, advance when ready.
