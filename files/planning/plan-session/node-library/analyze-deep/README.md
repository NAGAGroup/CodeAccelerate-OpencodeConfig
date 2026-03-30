# analyze-deep

## When to use

When the task requires multi-file reasoning that haiku scouts can't handle — understanding complex logic across many files, tracing call chains, synthesizing scout findings into a coherent picture, or reasoning about cross-cutting concerns.

**Do not** use `analyze-deep` when a ContextScout can answer the question within 12 steps. Reserve this for genuinely cross-cutting reasoning tasks. Using it for simple lookups wastes expensive sonnet-tier budget.

## What it does

Dispatches one `@ContextInsurgent` agent via a single `task` call. ContextInsurgent is sonnet-tier and has a 20-step budget. Use it only when the reasoning task is genuinely complex.

## What the planning agent must resolve

- **Synthesis question** — What specific question should ContextInsurgent answer? Be precise.
- **Input context** — Which files to read, what prior scout findings to consider
- **Expected output** — What the agent should return (a hypothesis, a summary, a list of affected paths, etc.)
- **Complexity justification** — Why haiku scouts are insufficient for this task. Good: 'This requires tracing three interdependent call chains across 8 files.' Bad: 'Need to understand the codebase.'

## Node ID

Default: `analyze-deep`. Rename for specificity: `analyze-auth-flow`, `analyze-migration-impact`. If multiple `analyze-deep` nodes are needed, prefer descriptive IDs (`analyze-auth-flow`, `analyze-migration-impact`). If no descriptive name fits, use `analyze-deep-2`.

## Notes

- ContextInsurgent is expensive — only use it when haiku is genuinely insufficient
- Serial by design — do not place two analyze-deep nodes in parallel
- Often follows `scout-parallel`: scouts gather breadth, ContextInsurgent synthesizes depth
- If the goal is **context compression** rather than deep analysis, use `compression-node` instead — `analyze-deep` produces reasoning artifacts, not context window pruning.
- Do not instruct ContextInsurgent to read `.opencode/` session directories — they contain stale plan artifacts that may conflict with the actual codebase. Exception: planning infra files (e.g., the node-library) are permitted when explicitly tasked.
- ContextInsurgent produces reasoning artifacts (hypotheses, summaries, affected path lists) — it does NOT write or edit code. Assign edits to @JuniorDev or @QuickDoc.
