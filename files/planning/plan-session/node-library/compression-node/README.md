# compression-node

## When to use

When the context window has grown large from accumulated scout output, multi-step agent work, or lengthy exploration, and key findings need to be crystallized before proceeding. Use before a decision or implementation phase when retaining all raw context is unnecessary.

**Do not** use after every node — only when context has meaningfully accumulated (typically after scout phases, long analysis, or multi-step implementation). Overuse wastes a tool call and breaks narrative continuity.

## What it does

HeadWrench calls the `compress` tool directly (provided by the DCP plugin) to replace stale conversation content with a dense, high-fidelity summary. No agent is dispatched — HW synthesizes the accumulated context itself and writes a compressed summary that becomes the authoritative record of that phase.

## What the planning agent must resolve

- **What to compress** — Which phase of work has concluded and can be summarized (e.g., "scout findings from three ContextScout agents"). Good: "Scout findings from 3 parallel ContextScout agents plus the git context output." Bad: "Everything from before."
- **What to preserve** — Key findings, file paths, decisions, constraints that must survive compression. Good: "Token module confirmed at src/auth/token.ts; pattern: handler-per-route; constraint: public API must not change." Bad: "Important findings." (too vague — specific items are dropped)
- **What to discard** — Verbose tool outputs, failed attempts, exploratory tangents. Good: "Verbose bash command outputs, intermediate glob results, exploratory scout queries that found nothing." Bad: "Old stuff." (non-specific — compress call drops needed content)
- **Synthesis question** — What question should the summary answer? (e.g., "What are the affected files and the key patterns to follow?"). Good: "What files need to change and what patterns/constraints govern the changes?" Bad: "What happened?" (too broad — produces narrative summary, not technical reference)
- **Output constraint** — The prompt must include this instruction verbatim: "Compress accumulated context from [what]. Preserve: [findings]. Discard: [noise]. The compressed summary must answer: [synthesis question]."

## Node ID

Default: `compression-node`. Rename for clarity: `compress-scout-findings`, `compress-analysis`.

## Notes

- The `compress` tool is provided by the DCP (Dynamic Context Pruning) plugin and is always available to HW — no agent dispatch needed.
- Never reuse `compression-node` as the node ID if you have more than one. Duplicate IDs cause a validation error and corrupt the node map. Use unique IDs: `compress-scout-findings`, `compress-post-analysis`.
- This node is for **context management**, not reasoning. If you need a synthesis artifact (hypothesis, affected-paths list), use `analyze-deep` instead.
- Often appears between `scout-parallel` and `parallel-tasks` in long DAGs: scout → compress → implement
- In a multi-phase DAG, don't limit to one — include a compression node between major phases (e.g., after scouts, after analysis, before implementation). Use a unique node ID per instance: `compress-scout-findings`, `compress-post-analysis`.
- The prompt should tell HW exactly what to compress, what to preserve, what to discard, and what synthesis question the summary should answer.
- **Failure mode:** Compressing before scouts have reported — you discard unread findings. Always place the compression-node after the reporting phase is complete, not before.
- **Failure mode:** `{{FINDINGS_TO_PRESERVE}}` left vague ("important findings") — the compress call drops specific file paths. Always list concrete items: file names, decision strings, constraint values found during the scout phase.
