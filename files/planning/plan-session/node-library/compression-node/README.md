# compression-node

## When to use

When the context window has grown large from accumulated scout output, multi-step agent work, or lengthy exploration, and key findings need to be crystallized before proceeding. Use before a decision or implementation phase when retaining all raw context is unnecessary.

**Do not** use after every node — only when context has meaningfully accumulated (typically after scout phases, long analysis, or multi-step implementation). Overuse wastes a tool call and breaks narrative continuity.

## What it does

HeadWrench calls the `compress` tool directly (provided by the DCP plugin) to replace stale conversation content with a dense, high-fidelity summary. No agent is dispatched — HW synthesizes the accumulated context itself and writes a compressed summary that becomes the authoritative record of that phase.

## What the planning agent must resolve

- **What to compress** — Which phase of work has concluded and can be summarized (e.g., "scout findings from three ContextScout agents")
- **What to preserve** — Key findings, file paths, decisions, constraints that must survive compression
- **What to discard** — Verbose tool outputs, failed attempts, exploratory tangents
- **Synthesis question** — What question should the summary answer? (e.g., "What are the affected files and the key patterns to follow?")

## Node ID

Default: `compression-node`. Rename for clarity: `compress-scout-findings`, `compress-analysis`.

## Notes

- The `compress` tool is provided by the DCP (Dynamic Context Pruning) plugin and is always available to HW — no agent dispatch needed.
- Never reuse `compression-node` as the node ID if you have more than one. Duplicate IDs cause a validation error and corrupt the node map. Use unique IDs: `compress-scout-findings`, `compress-post-analysis`.
- This node is for **context management**, not reasoning. If you need a synthesis artifact (hypothesis, affected-paths list), use `analyze-deep` instead.
- Often appears between `scout-parallel` and `parallel-tasks` in long DAGs: scout → compress → implement
- In a multi-phase DAG, don't limit to one — include a compression node between major phases (e.g., after scouts, after analysis, before implementation). Use a unique node ID per instance: `compress-scout-findings`, `compress-post-analysis`.
- The prompt should tell HW exactly what to compress, what to preserve, what to discard, and what synthesis question the summary should answer.
