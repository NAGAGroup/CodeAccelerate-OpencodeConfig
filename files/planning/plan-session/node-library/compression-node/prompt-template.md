# Compress Context

Your job in this node: call the `compress` tool once with the format below, then call `next_step()` immediately.

## Todo

1. `compress` — Call the compress tool with the exact format specified below.

---

**ZONE 1 — Fixed framing**

You are HeadWrench. In this node, call the `compress` tool directly — no agent is dispatched — to replace stale conversation context with a dense technical summary. Compression is a context management step only, not a reasoning or planning step. HW acts directly; no subagent is involved.

---

**ZONE 2 — Planning agent fills these placeholders**

## What to compress

{{PHASE_CONCLUDED}}

*Specific instruction for planning agent:* Name the phase that just ended (e.g., "Scout phase — three ContextScout agents reported findings on auth, database, and API patterns"). Do not write "everything so far" or "old context" — be explicit about which phase's output is being compressed.

## Key findings to preserve

{{PRESERVE}}

*Specific instruction for planning agent:* List concrete items that must survive compression: (1) exact file paths (e.g., `src/kernels/matmul.cpp`, `include/solvers/cg_solver.hpp`), (2) specific decisions and their outcomes, (3) constraints or patterns (e.g., "public API must not change", "`/vendor out-of-scope`"). Do not write "important findings" or "key results" — name them explicitly with exact values. The summary downstream nodes read must be precise.

## What can be discarded

{{DISCARD}}

*Specific instruction for planning agent:* Identify verbose or tangential content (e.g., "verbose tool call outputs, failed search attempts, redundant repetitions, exploratory queries that found nothing"). Be specific about what makes sense to drop without losing substance.

## Synthesis question

{{SYNTHESIS_QUESTION}}

*Specific instruction for planning agent:* State the single most important question the compressed summary must answer. This is the north star for compression — it shapes what is kept vs. dropped. Good: "Which files contain the affected kernel dispatch logic and what constraints govern the changes?" Bad: "What happened?" (too vague — produces narrative, not technical reference).*

---

**ZONE 3 — Recency zone (fixed execution specs)**

## Compression instruction

Call the compress tool with this exact format:

> **Compress accumulated context from {{PHASE_CONCLUDED}}. Preserve: {{PRESERVE}}. Discard: {{DISCARD}}. The compressed summary must answer: {{SYNTHESIS_QUESTION}}.**

Do not simplify or paraphrase this format. The specificity is essential — HW needs to know exactly what to keep and what the summary must answer.

## Scope constraint

This node calls the `compress` tool directly — do not dispatch a subagent. You (HeadWrench) are the agent performing the compression. After compress returns, call `next_step()` to advance to the next node.

## ID uniqueness

If this DAG has more than one compression node, give each a unique `id` value:
- First compression node: `id: "compress-scout-findings"` or `id: "compress-1"`
- Second compression node: `id: "compress-post-analysis"` or `id: "compress-2"`
- Etc.

**Never reuse `id: "compression-node"` if there are multiple compression nodes.** Duplicate IDs cause a silent node map collision, making the first node a terminal (ending the session early) and blocking the second node from execution. The plugin now validates and rejects duplicate IDs. Always use unique IDs.

## Output requirements

The compressed summary must include:
- All key file paths confirmed during the completed phase (exact repo-relative paths)
- All decisions made with outcomes stated (chosen option, not just options considered)
- All constraints or patterns that downstream nodes must respect
- An explicit "gaps / unknowns" item if anything was unresolved

Do NOT produce a narrative recap — the summary is a technical reference, not a story.

## Fill examples

**Example 1 — Scout phase compression:**
- Phase concluded: "Scout phase complete — three ContextScout agents explored kernel implementations, build conventions, and external library boundaries."
- Preserve: "Matmul kernel at `src/kernels/matmul.cpp`; dispatched via `src/pipeline/executor.cpp:87`. Pattern: SYCL buffer-based dispatch. Constraint: public kernel API in `include/kernels/matmul.hpp` must not change."
- Discard: "Verbose glob outputs, exploratory reads of unrelated modules, intermediate file listing overhead."
- Synthesis question: "Which files need to change and what patterns/constraints govern the changes?"

**Example 2 — Post-analysis compression:**
- Phase concluded: "ContextInsurgent deep analysis of kernel dispatch call sites completed."
- Preserve: "`runMatmul()` called at `src/pipeline/executor.cpp:87` and `src/pipeline/stages.cpp:134`. Both pass raw host pointers. No USM allocation wrapper exists yet."
- Discard: "Sequential thinking steps, file discovery overhead, rejected hypotheses."
- Synthesis question: "Which call sites need a new USM allocation wrapper and what exact changes are required at each location?"

MUST call `next_step()` after compress returns.
