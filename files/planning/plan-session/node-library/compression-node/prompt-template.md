# Compress Context

Dispatch `@ContextInsurgent` to synthesize and compress the accumulated context from the phase that just completed.

## What to compress

{{WHAT_TO_COMPRESS}}

## Key findings to preserve

{{FINDINGS_TO_PRESERVE}}

## What can be discarded

{{WHAT_TO_DISCARD}}

## Synthesis question

{{SYNTHESIS_QUESTION}}

## Scope note

**Scope note:** The context being compressed is from codebase exploration. Do NOT reference `.opencode/` session directories as source material — completed sessions are stale. Exception: planning infrastructure files (e.g., the node-library) are permitted.

## Todo

1. `task` — Dispatch @ContextInsurgent to synthesize the findings from {{WHAT_TO_COMPRESS}}. The agent must preserve: {{FINDINGS_TO_PRESERVE}}. It should discard: {{WHAT_TO_DISCARD}}. Answer the question: {{SYNTHESIS_QUESTION}}. The agent calls the `compress` tool to replace stale context with a dense technical summary.

## Before advancing

If synthesis revealed gaps, contradictions, or key uncertainties in the accumulated context, consider surfacing them to the user before calling `next_step()`. This is optional — if the compression is clean and complete, advance when ready.
