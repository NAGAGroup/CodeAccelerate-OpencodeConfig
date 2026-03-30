# Compress Context

You are HeadWrench. In this node, call the `compress` tool directly — no agent is dispatched — to replace stale conversation context with a dense technical summary.

Call the `compress` tool to synthesize and compress the accumulated context from the phase that just completed. This is a direct tool call — no agent is dispatched.

## What to compress

{{WHAT_TO_COMPRESS}}

Name the phase that just ended — e.g., 'Output from three ContextScout agents in the scout phase.' Be specific about which phase's output is being compressed.

## Key findings to preserve

{{FINDINGS_TO_PRESERVE}}

*List specific items that must survive compression: exact file paths, decision strings, constraint values. Do not write "important findings" — name them explicitly. E.g., "Token module path: src/auth/token.ts; confirmed pattern: handler-per-route; constraint: must not modify public API."*

## What can be discarded

{{WHAT_TO_DISCARD}}

E.g., 'Verbose tool call outputs, failed attempts, redundant repetitions of the same finding. Raw file contents already summarized; failed search attempts; duplicate references to the same file.'

## Synthesis question

{{SYNTHESIS_QUESTION}}

*The single most important question the compressed summary must answer. This shapes the entire compression. E.g., "What files need to change, what patterns exist, and what are the key constraints?" Bad: "What happened?" (too vague — compress call will produce a narrative, not a technical summary).*

## Output requirements (fixed)

The compressed summary must include:
- All key file paths confirmed during the preceding phase
- All decisions made (the chosen option stated, not just the options considered)
- All constraints or patterns that downstream nodes must respect
- An explicit "gaps / unknowns" item if anything was unresolved

Do NOT produce a narrative recap — the summary is a technical reference, not a story.

## Todo

> **Writing the compress call:** The compress call must synthesize:
> (1) a bullet-list of all preserved findings with exact file paths and values;
> (2) all decisions made during the completed phase with their outcomes (not just "decision was made");
> (3) any open constraints or unknowns that downstream nodes must account for.
> Do NOT produce a prose narrative.
> (4) Do not ask the user for confirmation — complete the compression and advance.

1. `compress` — Call the compress tool to replace stale context with a dense technical summary. The summary must preserve: {{FINDINGS_TO_PRESERVE}}. Discard: {{WHAT_TO_DISCARD}}. The summary should answer: {{SYNTHESIS_QUESTION}}.

## Before advancing

After compressing, if gaps or uncertainties in the findings are revealed, consider surfacing them to the user before calling `next_step()`. This is optional — if the compression is clean and complete, advance when ready.

## Fill examples

**Example 1 — Scout phase compression:**
- What to compress: "Scout findings from 3 parallel ContextScout agents (Scouts 1–3 returned results in messages above)"
- Findings to preserve: "token.ts confirmed at src/auth/token.ts; exports: verifyToken, createToken. Pattern: handler-per-route. Constraint: public API must not change."
- What to discard: "Verbose glob outputs, exploratory queries that found nothing, intermediate bash results"
- Synthesis question: "What files need to change and what patterns/constraints govern the changes?"

**Example 2 — Post-analysis compression:**
- What to compress: "ContextInsurgent analysis output from analyze-auth-flow node"
- Findings to preserve: "verifyToken called at src/routes/users.ts:47, src/routes/admin.ts:23. Both use direct call, not middleware wrapper. No shared wrapper exists."
- What to discard: "CI's sequential thinking steps, file listing overhead"
- Synthesis question: "Which files need a new middleware wrapper and what exactly must change at each call site?"
