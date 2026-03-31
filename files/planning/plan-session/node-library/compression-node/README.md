# compression-node

## When to use

Use `compression-node` **between major phases** in longer planning DAGs when accumulated context (scout findings, analysis output, research results, or multi-step agent work) has grown large enough to impact clarity or token budget.

**Trigger conditions:**
- Multiple scouts have completed and reported their findings
- Deep analysis (ContextInsurgent) has produced multi-file evidence summaries
- Research phase has concluded with multiple external lookups
- A decision gate or implementation phase is about to begin, and prior context is verbose

**Do NOT use:**
- After every node (compress only when context has meaningfully accumulated, not at arbitrary intervals)
- Before scouts have finished reporting (you will discard unread findings)
- During an in-progress implementation phase (you may lose intermediate results needed by subsequent implementation nodes)
- When the goal is reasoning or planning — use `analyze-deep` instead (compression is for context management only, not for producing new reasoning artifacts)

## What the planning agent must resolve

Before writing a compression node, answer these questions:

1. **Phase concluded** — What work has just finished? Be specific.
   - Good: "Scout phase complete — three scouts reported findings on auth, database, and API patterns."
   - Bad: "Work is done."

2. **What to preserve** — List the specific findings, file paths, decisions, or constraints that downstream nodes need. Be concrete.
   - Good: "Preserve: (1) exact file paths identified by scouts (`src/auth/token.ts`, `src/db/queries.ts`), (2) the decision to refactor token validation before API redesign, (3) constraint that `/vendor` directory is out of scope."
   - Bad: "Preserve: key findings." (No specifics — compress will drop the file paths.)

3. **What to discard** — Name the verbose or tangential content that should be removed.
   - Good: "Discard: verbose tool execution logs, failed search attempts, dead-end exploration notes."
   - Bad: "Remove unnecessary stuff." (Undefined — compress cannot discriminate.)

4. **Synthesis question** — What question must the compressed summary answer? Downstream nodes will read the summary to answer this.
   - Good: "The summary must answer: Which files contain authentication logic, and which must be refactored before the API redesign?"
   - Bad: "Summarize what we learned." (Not a question — no clear success criterion.)

5. **Consumer node** — Which node comes after this compression node? (The next node should benefit directly from the compressed summary.)
   - Good: "The next node is `propose-plan` — it needs a crystal-clear file list and the refactor-first decision."
   - Bad: "Some later node."

## Notes

### Timing failure: compressing before scouts complete
**Mechanism:** If you insert a compression node before all parallel scouts have finished reporting, the compress tool will crystallize a partial context. Later, when the outstanding scouts finish, their findings won't be reflected in the compressed summary — you've discarded unread evidence.
**Fix:** Always wait for all prior scout nodes to complete and emit their findings before calling compression. Check the DAG structure: compression should come *after* all scout nodes in the execution order, not between them.

### Specification failure: vague preservation list
**Mechanism:** If the preservation spec says "keep the scout findings" without naming specific file paths or decisions, the compress tool cannot discriminate which details matter. It will drop exact file paths, line numbers, and specific constraints — the very details downstream nodes need.
**Fix:** In the `{{PRESERVE}}` slot, always list concrete items: (1) enumerate exact file paths (e.g., `src/auth/token.ts`), (2) name specific decisions with their rationale, (3) list any scope constraints by name (e.g., `/vendor out-of-scope`). The summary should be a *distilled* artifact that preserves precision, not a prose narrative.

### ID uniqueness failure: duplicate node IDs
**Mechanism:** If a DAG has two compression nodes and both have `id: "compression-node"`, the second node silently overwrites the first in the node map. The first node becomes a terminal (ending the session prematurely), and the second node is never reached during execution.
**Fix:** When writing a DAG with more than one compression node, give each a unique ID: `compress-scout-findings`, `compress-post-analysis`, `compress-before-implementation`, etc. The node library template enforces this; see the `## ID uniqueness` section in the prompt template.

## Compression instruction (cascade verbatim)

The planning agent must embed this instruction format verbatim in the node prompt. Do not paraphrase:

> Call the compress tool with: **Compress accumulated context from {{PHASE_CONCLUDED}}. Preserve: {{PRESERVE}}. Discard: {{DISCARD}}. The compressed summary must answer: {{SYNTHESIS_QUESTION}}.**

This format is non-negotiable. It ensures HeadWrench understands what to compress and what to keep. Any simplification (e.g., "compress the scout findings") loses the specificity that makes compression effective.
