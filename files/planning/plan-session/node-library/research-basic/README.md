# research-basic

## When to use

When the task requires looking something up externally before or during implementation. Use for problem-solving research: API references, library documentation, configuration options, debugging known issues, comparing approaches. This is the default research node — use it when you need external information to inform implementation decisions.

## What it does

Dispatches one `@ExternalScout` agent via a single `task` call. ExternalScout uses Context7 for documentation lookup and Exa for web search. Research is targeted — the prompt specifies what to find, not how deep to go.

## What the planning agent must resolve

- **Research topic** — What specific information is needed? Good: "React Query v5 — the `invalidateQueries` API and cache invalidation patterns when used with server-side mutations." Bad: "React Query" (topic, not a question — ES returns a survey, not an API reference.)
- **Output format** — What should ExternalScout return? (e.g., code examples, config options, comparison table, summary of findings) Good: "A summary of configuration options with inline code examples, citing the specific library version." Bad: "A summary of findings." (No format requirement — ES may return prose with no code examples or version citations.)
- **Scope** — What threads should ExternalScout follow if the first source is insufficient?
- **Downstream use** — How will the findings be used in subsequent nodes? Good: "Findings feed the `sequential-thinking` node to decide which React Query pattern to adopt." Bad: "Used later." (No specificity — planning agent cannot determine what format the downstream node needs.)
- **Answer format** — The dispatched ES prompt must instruct ExternalScout to synthesize a direct answer with code examples — not return a list of links. Cite specific versions.
- **Scope guard** — The dispatched ES prompt must explicitly state: "This is a cursory research pass. Use Context7 first, then one Exa search if needed. Do NOT perform multiple search iterations or cross-reference contradictory sources — report what you find and stop." Don't omit the scope guard — without it, ExternalScout pursues multiple research threads and exhausts its 15-step budget on tangential sources before answering the primary question.
- **Scope check** — Is this a targeted API/config lookup (1–2 sources sufficient)? Use `research-basic`. If the question requires comparing approaches across 3+ sources or discovering novel techniques, use `research-deep` instead.

## Node ID

Default: `research-basic`. Rename for specificity: `research-library-api`, `research-config-options`, `research-error-pattern`.

## Notes

- ExternalScout has a 15-step budget — enough for targeted multi-source lookup
- Use Context7 first: instruct ExternalScout to call `context7_resolve-library-id` then `context7_query-docs`. Use Exa second only if Context7 is insufficient.
- For deep investigative research (novel algorithms, academic papers, state-of-the-art), use `research-deep` instead
- ExternalScout is for EXTERNAL research only — if you need codebase exploration, use `scout-parallel` or `analyze-deep`
- **Failure mode:** Dispatching ExternalScout with an overly broad topic ("React Query") instead of a specific question ("React Query v5 invalidation API — how to programmatically invalidate a query by key after a mutation"). Broad topics produce survey-style responses with no actionable specifics.
- **Failure mode:** Omitting the scope guard from the dispatched prompt. Without it, ExternalScout pursues multiple threads and exhausts its 15-step budget before answering the specific question. Always include: "This is a cursory pass — stop after first successful search."
