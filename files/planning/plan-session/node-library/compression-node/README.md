# compression-node

## When to use

When the context window has grown large from accumulated scout output, multi-step agent work, or lengthy exploration, and key findings need to be crystallized before proceeding. Use before a decision or implementation phase when retaining all raw context is unnecessary.

## What it does

Dispatches `@ContextInsurgent` via a single `task` call. ContextInsurgent reads the accumulated context, identifies the high-signal findings, and calls the `compress` tool to replace stale content with a dense technical summary. The compressed summary replaces the raw exploration in the context window.

## What the planning agent must resolve

- **What to compress** — Which phase of work has concluded and can be summarized (e.g., "scout findings from three ContextScout agents")
- **What to preserve** — Key findings, file paths, decisions, constraints that must survive compression
- **What to discard** — Verbose tool outputs, failed attempts, exploratory tangents
- **Synthesis question** — What question should the summary answer? (e.g., "What are the affected files and the key patterns to follow?")

## Node ID

Default: `compression-node`. Rename for clarity: `compress-scout-findings`, `compress-analysis`.

## Notes

- ContextInsurgent is sonnet-tier — expensive. Only use when context pressure is real.
- This node is specifically for context management, not for producing deliverables. If you need deep analysis, use `analyze-deep` instead.
- Often appears between `scout-parallel` and `parallel-tasks` in long DAGs: scout → compress → implement
- The planning agent should note in the prompt what the HW subagent previously found, so ContextInsurgent knows what to retain
