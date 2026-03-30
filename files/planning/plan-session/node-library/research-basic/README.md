# research-basic

## When to use

When the task requires looking up code-related external information before or during implementation. Use for: API references, library documentation, configuration options, debugging known issues, finding code examples and patterns. This is the **code and implementation** research node — it answers "how do I use X" questions.

**Not for:** discovering novel algorithms, reading academic papers, comparing conceptual approaches, or any research where the goal is understanding ideas rather than finding code. Use `research-deep` for those.

## What it does

Dispatches one `@ExternalScout` agent via a single `task` call. ExternalScout uses Context7 for versioned library documentation and `get_code_context_exa` for code examples, GitHub patterns, and implementation references. Research is targeted and cursory — the prompt specifies what to find, not how deep to go.

## What the planning agent must resolve

- **Research topic** — What specific code information is needed? Good: "React Query v5 — the `invalidateQueries` API and cache invalidation patterns when used with server-side mutations." Bad: "React Query" (topic, not a question — ES returns a survey, not an API reference.)
- **Output format** — What should ExternalScout return? Good: "A summary of configuration options with inline code examples, citing the specific library version." Bad: "A summary of findings." (No format requirement — ES may return prose with no code examples or version citations.)
- **Scope** — What threads should ExternalScout follow if the first source is insufficient?
- **Downstream use** — How will the findings be used in subsequent nodes? Good: "Findings feed the `sequential-thinking` node to decide which React Query pattern to adopt." Bad: "Used later." (No specificity — planning agent cannot determine what format the downstream node needs.)
- **Answer format** — The dispatched ES prompt must instruct ExternalScout to synthesize a direct answer with code examples — not return a list of links. Cite specific versions.
- **Scope guard** — The dispatched ES prompt must explicitly state: "This is a cursory research pass. Use Context7 first, then `get_code_context_exa` if needed. Do NOT perform multiple search iterations or cross-reference contradictory sources — report what you find and stop." Don't omit the scope guard — without it, ExternalScout pursues multiple research threads and exhausts its 15-step budget on tangential sources before answering the primary question.
- **Scope check** — Is this a targeted API/config/code lookup (1–2 sources sufficient)? Use `research-basic`. If the question requires understanding ideas, algorithms, or comparing conceptual approaches across 3+ sources, use `research-deep` instead.

## Node ID

Default: `research-basic`. Rename for specificity: `research-library-api`, `research-config-options`, `research-error-pattern`.

## Notes

- ExternalScout has a 15-step budget — enough for targeted multi-source lookup
- Tool priority: Context7 first for versioned library docs; `get_code_context_exa` second for code examples and GitHub patterns; `web_search_exa` last resort
- For deep investigative research (novel algorithms, academic papers, state-of-the-art techniques, conceptual exploration), use `research-deep` instead
- ExternalScout is for EXTERNAL research only — if you need codebase exploration, use `scout-parallel` or `analyze-deep`
- **Failure mode:** Dispatching ExternalScout with an overly broad topic ("React Query") instead of a specific question ("React Query v5 invalidation API — how to programmatically invalidate a query by key after a mutation"). Broad topics produce survey-style responses with no actionable specifics.
- **Failure mode:** Omitting the scope guard from the dispatched prompt. Without it, ExternalScout pursues multiple threads and exhausts its 15-step budget before answering the specific question. Always include: "This is a cursory pass — stop after first successful search."
