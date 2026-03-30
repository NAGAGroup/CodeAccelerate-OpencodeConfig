# [Research Topic]

Dispatch @ExternalScout to research [specific topic]. The findings will be used by [downstream node] to [purpose].

## Research target

[Describe exactly what ExternalScout should find. Be specific: library name, version, API surface, configuration options, known patterns, etc.]

## Scope

[What threads should ExternalScout follow if the primary source is insufficient? What related topics are in scope?]

## Expected output

[What format should ExternalScout return findings in? Examples: "a summary of configuration options with code examples", "a comparison of approach A vs approach B", "the canonical way to implement X in library Y"]

> **Writing the ExternalScout's prompt:** The prompt must specify: (1) the exact research question; (2) tool order: use Context7 first — call `context7_resolve-library-id` to find the library, then `context7_query-docs` to retrieve documentation — then Exa for broader web search if Context7 is insufficient; (3) scope guard: "This is a cursory pass — stop after first successful search. Do NOT pursue multiple threads, cross-reference sources, or use sequential thinking."; (4) return format: cite specific versions, include code examples when relevant, synthesize into a direct answer rather than a link list.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ExternalScout with the research instructions above. Tell ExternalScout to use Context7 first: call `context7_resolve-library-id` to identify the library, then `context7_query-docs` to retrieve docs. If Context7 is insufficient, use one Exa search — then stop. Do NOT pursue multiple threads. Include code examples where relevant, cite specific versions, and return a direct answer — not a list of links.

## Before advancing

After the researcher reports back, call `next_step()` to advance to the next node. If the research returned no useful findings, note this in your context and proceed — the gap itself is useful information.
