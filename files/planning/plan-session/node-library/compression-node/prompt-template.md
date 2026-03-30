# Compress Context

Call the `compress` tool to synthesize and compress the accumulated context from the phase that just completed. This is a direct tool call — no agent is dispatched.

## What to compress

{{WHAT_TO_COMPRESS}}

Name the phase that just ended — e.g., 'Output from three ContextScout agents in the scout phase.' Be specific about which phase's output is being compressed.

## Key findings to preserve

{{FINDINGS_TO_PRESERVE}}

## What can be discarded

{{WHAT_TO_DISCARD}}

E.g., 'Verbose tool call outputs, failed attempts, redundant repetitions of the same finding. Raw file contents already summarized; failed search attempts; duplicate references to the same file.'

## Synthesis question

{{SYNTHESIS_QUESTION}}

`{{SYNTHESIS_QUESTION}}` — The single most important question the compressed summary must answer. E.g., 'What files need to change, what patterns exist, and what are the key constraints?' This shapes the entire compression.

## Todo

1. `compress` — Call the compress tool to replace stale context with a dense technical summary. The summary must preserve: {{FINDINGS_TO_PRESERVE}}. Discard: {{WHAT_TO_DISCARD}}. The summary should answer: {{SYNTHESIS_QUESTION}}.

## Before advancing

After compressing, if gaps or uncertainties in the findings are revealed, consider surfacing them to the user before calling `next_step()`. This is optional — if the compression is clean and complete, advance when ready.
