# analyze-deep

## When to use

When the task requires multi-file reasoning that haiku scouts can't handle — understanding complex logic across many files, tracing call chains, synthesizing scout findings into a coherent picture, or reasoning about cross-cutting concerns.

## What it does

Dispatches one `@ContextInsurgent` agent via a single `task` call. ContextInsurgent is sonnet-tier and has a 20-step budget. Use it only when the reasoning task is genuinely complex.

## What the planning agent must resolve

- **Synthesis question** — What specific question should ContextInsurgent answer? Be precise.
- **Input context** — Which files to read, what prior scout findings to consider
- **Expected output** — What the agent should return (a hypothesis, a summary, a list of affected paths, etc.)
- **Complexity justification** — Why haiku scouts are insufficient for this task

## Node ID

Default: `analyze-deep`. Rename for specificity: `analyze-auth-flow`, `analyze-migration-impact`.

## Notes

- ContextInsurgent is expensive — only use it when haiku is genuinely insufficient
- Serial by design — do not place two analyze-deep nodes in parallel
- Often follows `scout-parallel`: scouts gather breadth, ContextInsurgent synthesizes depth
- This node is also used for the `compression-node` pattern — if the goal is context compression rather than analysis, use `compression-node` instead
- Do not instruct ContextInsurgent to read `.opencode/` session directories — they contain stale plan artifacts that may conflict with the actual codebase. Exception: planning infra files (e.g., the node-library) are permitted when explicitly tasked.
