# [Research Topic]

You are HeadWrench. In this node, write and dispatch a single targeted ExternalScout research task.

Dispatch @ExternalScout to research [specific topic]. The findings will be used by [downstream node] to [purpose].

## Research target

{{RESEARCH_TARGET}}
*Describe exactly what ExternalScout should find: library name, version, API surface, configuration options. Good: "React Query v5 — the `invalidateQueries` API and cache invalidation patterns." Bad: "React Query stuff."*

## Scope

{{SCOPE}}
*What secondary threads ExternalScout may follow if the primary source is insufficient. Omit if no secondary threads are relevant.*

## Expected output

{{EXPECTED_OUTPUT}}
*Return format with specific format and version requirement. E.g., "A summary of configuration options with code examples, citing library version X." Bad: "Whatever is useful."*

## Output requirements (fixed)

The research findings must include:
- A direct answer to the research question (not a list of links)
- Specific library version(s) cited
- At least one code example if the question concerns an API or configuration
- An explicit statement of what was NOT found if the search was partially successful

If ExternalScout returns only links or a broad survey with no specific answer, flag the gap before advancing — do not silently pass incomplete findings to the next node.

> **Writing the ExternalScout's prompt:** The prompt must specify: (1) the exact research question; (2) tool order: use Context7 first — call `context7_resolve-library-id` to find the library, then `context7_query-docs` to retrieve documentation — then Exa for broader web search if Context7 is insufficient; (3) scope guard: "This is a cursory pass — stop after first successful search. Do NOT pursue multiple threads, cross-reference sources, or use sequential thinking."; (4) return format: cite specific versions, include code examples when relevant, synthesize into a direct answer rather than a link list; (5) Termination: "Stop after first successful search. Do not loop. Return findings immediately."

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ExternalScout with the research instructions above. Tell ExternalScout to use Context7 first: call `context7_resolve-library-id` to identify the library, then `context7_query-docs` to retrieve docs. If Context7 is insufficient, use one Exa search — then stop. Do NOT pursue multiple threads. Include code examples where relevant, cite specific versions, and return a direct answer — not a list of links.

## Before advancing

After the researcher reports back, call `next_step()` to advance to the next node. If the research returned no useful findings, note this in your context and proceed — the gap itself is useful information.

## Fill examples

**Example 1 — Library API lookup:**
- Research topic: "React Query v5 cache invalidation API"
- Scope: "Use Context7 first. If not covered, one Exa search for React Query v5 invalidateQueries."
- Expected output: "Code examples showing invalidateQueries usage with mutation callbacks; cite the specific version."
- Downstream node: "`sequential-thinking` decides which invalidation pattern to use."

**Example 2 — Configuration options:**
- Research topic: "Cloudflare Workers wrangler.jsonc configuration for custom domains"
- Scope: "Context7 only — Cloudflare docs should be well covered."
- Expected output: "The exact wrangler.jsonc fields for custom domain routing with a working example config."
- Downstream node: "`impl-deploy` uses this to write the wrangler.jsonc file."
