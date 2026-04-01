# analyze-deep Node Type

## When to use

Select `analyze-deep` when:

- Prior scout reports have surfaced conflicting information or incomplete coverage that requires synthesis across multiple files
- The question requires tracing execution flow, dependency chains, or state transitions across 3+ files
- You need to reason about cross-cutting concerns (e.g., concurrency safety, data consistency) that no single file reveals
- The scope is tightly defined and achievable within 8–10 files of focused reading (ContextInsurgent runs without a fixed step cap)

**Do NOT use analyze-deep for:**
- Single-file clarifications (route to scout instead)
- Context compression / token pruning (→ `compression-node`)
- Questions answerable by a haiku scout with the right file paths (→ `scout-parallel`)
- Scope >10 files or unbounded exploration (split into two `analyze-deep` nodes instead)

## What the planning agent must resolve

Before writing this node's prompt, determine and fill in:

1. **Synthesis question** — The specific question ContextInsurgent must answer.
   - ✓ Good: "Which components read from the session store and write without acquiring the lock?"
   - ✗ Bad: "Understand the session system" (too broad, no convergence criterion)
   - ✓ Good: "Trace the call chain from `UserController.login()` through auth middleware to the JWT token store — which components inject the secret?"
   - ✗ Bad: "How does authentication work?" (vague, produces boilerplate)

2. **Input context** — The exact file list ContextInsurgent must read, plus any prior scout findings it builds on.
   - ✓ Good: `src/auth/controller.ts`, `src/auth/middleware.ts`, `src/store/session.ts`, and scout findings from the concurrency analysis (see prior node output)
   - ✗ Bad: "The auth system" (no file paths — CI cannot orient without them)
   - Always include: prior scout findings (name the node they came from), exact repo-relative file paths

3. **Complexity justification** — Why haiku scouts are insufficient for this specific question.
   - ✓ Good: "This requires cross-file tracing: middleware calls three different token validation functions across two modules, and we need to verify each one checks the lock state before writing."
   - ✗ Bad: "Need a smart agent" (no mechanism — doesn't justify why scouts failed)

4. **Expected output format** — What ContextInsurgent should produce.
   - ✓ Good: "A list of affected components with file paths, line numbers, and the specific unsafe pattern in each. Example: `src/auth/token.ts line 42: token written without lock check`"
   - ✗ Bad: "A report" (too vague — CI may produce thematic summary instead of evidence)

5. **Output constraint (cascade verbatim into the prompt)** — "Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings."
   - This must appear in the dispatched prompt exactly as stated.

6. **Budget scope check** — If the file list exceeds 10 files or the question requires 8+ independent reasoning steps, split into two `analyze-deep` nodes instead. Dense synthesis with >10 files risks shallow or incomplete output — split into two `analyze-deep` nodes for better quality.

## Notes

### Failure Mode: Broad synthesis questions

**Mechanism:** If the question lacks a specific convergence point (e.g., "Understand the system"), ContextInsurgent will produce a generic architectural summary instead of answering a precise question. Haiku scouts do this naturally when given bad input; sonnet does it *deliberately* when left without constraints.

**Prevention:** The synthesis question must be a single, answerable interrogative. Use the test: "Can ContextInsurgent answer this with a list of files and line numbers, or does it require prose narrative?" If the latter, the question is too broad.

### Failure Mode: Exceeding budget with file scope

**Mechanism:** Reading 12+ files with cross-file reasoning leaves minimal margin for quality synthesis output — the findings become shallow and surface-level. Planning agents who list "all files in the auth/ directory" or "everything related to session handling" will exceed the budget.

**Prevention:** Before filling the `{{CONTEXT_TO_PROVIDE}}` placeholder, count files. If the list exceeds 10, split the analysis: create two `analyze-deep` nodes, one for each subset (e.g., "token validation chain" vs. "session store mutations"). Each node answers a narrower synthesis question.

### Failure Mode: Using analyze-deep for context compression

**Mechanism:** Planning agents sometimes mistakenly use `analyze-deep` to "summarize and compress the codebase." ContextInsurgent will produce a long architectural narrative, consuming steps and token budget without answering any specific question. This is not what the node is for.

**Prevention:** If the goal is token pruning or context window reclamation, use `compression-node` instead. The compression-node dispatches HW directly (not a subagent) and calls the compress tool. `analyze-deep` is for *reasoning about specific questions*, not compression.

### Failure Mode: Reading .opencode/ session directories

**Mechanism:** Planning agents sometimes include `.opencode/` paths in the file list, expecting ContextInsurgent to read prior session plans or artifacts. These directories contain stale planning state and may reference files or code patterns that have changed, corrupting the analysis.

**Prevention:** Instruct ContextInsurgent explicitly NOT to read `.opencode/`. State in the dispatched prompt: "Do not read any files under `.opencode/` session directories — they contain stale plan artifacts that may conflict with the actual codebase." The prompt template's fixed `## Scope restriction` section will include this, but the planning agent must not override it.

### Three-constraint cascade check

The constraint "Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings" must appear in:
1. Your "must resolve" checklist (item 5) — so you know to propagate it
2. The template's fixed `## Output format requirements` section — so it survives the fill step
3. The dispatch blockquote as item 3 — so HW re-states it when delegating to CI

If it appears in fewer than three places, it will be dropped at one indirection hop.

## Output constraint

**Cascade this verbatim into the node prompt:**

> Do not produce a generic 'Architecture Overview' or 'Key Decisions' section — report specific file paths, line numbers, and exact strings.
