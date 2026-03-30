# Deep Analysis

@ContextInsurgent is serial and expensive — use after `scout-parallel` when haiku cannot handle the synthesis, or when multi-file root-cause reasoning is required. Do not use for simple file reads.

Dispatch `@ContextInsurgent` to perform deep multi-file reasoning on the following question:

## Analysis question

{{ANALYSIS_QUESTION}}

## Context to provide

{{CONTEXT_TO_PROVIDE}}

*The file list CI must read (e.g., `src/auth/token.ts`, `src/auth/helpers/*.ts`) and any prior scout findings to build on. Always include an explicit list of files — do not substitute contextual prose for file paths.*

## Expected output

{{EXPECTED_OUTPUT}}

## Output format requirements

Answer the question directly with specific evidence from the code. Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings.

## Scope restriction

**Do NOT** instruct ContextInsurgent to read `.opencode/` session directories — completed sessions contain stale content that may poison analysis. Exception: planning infrastructure files (e.g., the node-library) are permitted when explicitly specified.

> **Writing the ContextInsurgent's prompt:** The prompt must specify: (1) the exact analysis question specified for this node; (2) which files or directories to read; (3) the expected return format — a direct answer with supporting evidence, not boilerplate section headers. Instruct the agent: "Do not produce generic 'Architecture Overview' or 'Key Decisions' sections. Answer the question directly with specific evidence from the code."

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ContextInsurgent to analyze: {{ANALYSIS_QUESTION}}. Provide the agent with: {{CONTEXT_TO_PROVIDE}}. The agent should return: {{EXPECTED_OUTPUT}}.

## Before advancing

If the analysis revealed significant architectural concerns, unexpected complexity, or questions where user input would change the approach, consider surfacing them before calling `next_step()`. This is optional — if findings are clear and actionable, advance when ready.
