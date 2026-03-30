# Deep Analysis

Dispatch `@ContextInsurgent` to perform deep multi-file reasoning on the following question:

## Analysis question

{{ANALYSIS_QUESTION}}

## Context to provide

{{CONTEXT_TO_PROVIDE}}

## Expected output

{{EXPECTED_OUTPUT}}

## Scope restriction

**Do NOT** instruct ContextInsurgent to read `.opencode/` session directories — completed sessions contain stale content that may poison analysis. Exception: planning infrastructure files (e.g., the node-library) are permitted when explicitly specified.

## Todo

1. `task` — Dispatch @ContextInsurgent to analyze: {{ANALYSIS_QUESTION}}. Provide the agent with: {{CONTEXT_TO_PROVIDE}}. The agent should return: {{EXPECTED_OUTPUT}}.

## Before advancing

If the analysis revealed significant architectural concerns, unexpected complexity, or questions where user input would change the approach, consider surfacing them before calling `next_step()`. This is optional — if findings are clear and actionable, advance when ready.
