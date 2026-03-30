# Compress Context

Call the `compress` tool to synthesize and compress the accumulated context from the phase that just completed. This is a direct tool call — no agent is dispatched.

## What to compress

{{WHAT_TO_COMPRESS}}

## Key findings to preserve

{{FINDINGS_TO_PRESERVE}}

## What can be discarded

{{WHAT_TO_DISCARD}}

## Synthesis question

{{SYNTHESIS_QUESTION}}

## Todo

1. `compress` — Call the compress tool to replace stale context with a dense technical summary. The summary must preserve: {{FINDINGS_TO_PRESERVE}}. Discard: {{WHAT_TO_DISCARD}}. The summary should answer: {{SYNTHESIS_QUESTION}}.

## Before advancing

After compressing, if gaps or uncertainties in the findings are revealed, consider surfacing them to the user before calling `next_step()`. This is optional — if the compression is clean and complete, advance when ready.
