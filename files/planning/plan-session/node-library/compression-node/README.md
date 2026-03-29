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

- ContextInsurgent is sonnet-tier — use when context has meaningfully accumulated, not as a reflex. In a multi-phase DAG, don't limit to one — include a compression node between major phases (e.g., after scouts, after analysis, before implementation). Use a unique node ID per instance: `compress-scout-findings`, `compress-post-analysis`.
- This node is specifically for context management, not for producing deliverables. If you need deep analysis, use `analyze-deep` instead.
- Often appears between `scout-parallel` and `parallel-tasks` in long DAGs: scout → compress → implement
- The planning agent should note in the prompt what the HW subagent previously found, so ContextInsurgent knows what to retain
- The "accumulated context" to compress comes from codebase exploration — do not instruct ContextInsurgent to read `.opencode/` session directories for source material. Exception: planning infra files (e.g., the node-library) are permitted when explicitly tasked.
- The planning enforcement plugin's `compress` tool is exempt from DAG todo blocking — ContextInsurgent can always call it when dispatched.
