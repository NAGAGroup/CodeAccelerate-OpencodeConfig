# Node: agent-routing — /plan-debug

Your role in this node is to determine what delegation instructions should be embedded in each debug session prompt file before finalize writes them.

## Steps

1. **Load the delegation skill** — `delegation`. Internalize the routing table and decision heuristics.

2. **Review the approved hypothesis list and bug context** from this planning session.

3. **Determine delegation instructions for each prompt file** finalize will write:

   **`hypothesis-gate.md`** (only if confirm-mode: yes) — HW direct. No delegation needed. Note this explicitly.

   **`diagnose.md`** — The diagnosis agent needs to inspect code and trace execution paths. Determine:
   - Is the bug localized (one or two files)? → `@ContextScout` (haiku) for quick reads
   - Does it require tracing across multiple files or layers? → `@ContextInsurgent` (sonnet) for deep analysis
   - Include the specific routing instruction in your recommendation.

   **`fix.md`** — The fix agent applies targeted code edits. Determine:
   - For scoped edits (1–3 files): `@JuniorDev` (haiku)
   - For multi-file refactors: `@JuniorDev` in parallel slots
   - HeadWrench runs all test commands directly after fixes are applied.

   **`verify.md`** — HeadWrench runs tests directly. No delegation needed. Note this explicitly.

4. **Produce a delegation summary** — one paragraph per prompt file stating what delegation instruction to embed.

## Constraints

- Do not write any files in this node.
- Base your routing recommendations on actual bug complexity from context — do not default to the most expensive agent.

## Advance

**Call `next_step()`** to advance.
