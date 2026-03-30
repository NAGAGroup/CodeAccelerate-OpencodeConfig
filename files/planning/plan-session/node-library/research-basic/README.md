# research-basic

## When to use

When the task requires looking something up externally before or during implementation. Use for problem-solving research: API references, library documentation, configuration options, debugging known issues, comparing approaches. This is the default research node — use it when you need external information to inform implementation decisions.

## What it does

Dispatches one `@ExternalScout` agent via a single `task` call. ExternalScout uses Context7 for documentation lookup and Exa for web search. Research is targeted — the prompt specifies what to find, not how deep to go.

## What the planning agent must resolve

- **Research topic** — What specific information is needed? Be concrete: "React Query v5 invalidation API" not "React Query"
- **Output format** — What should ExternalScout return? (e.g., code examples, config options, comparison table, summary of findings)
- **Scope** — What threads should ExternalScout follow if the first source is insufficient?
- **Downstream use** — How will the findings be used in subsequent nodes?

## Node ID

Default: `research-basic`. Rename for specificity: `research-library-api`, `research-config-options`, `research-error-pattern`.

## Notes

- ExternalScout has a 15-step budget — enough for targeted multi-source lookup
- Use Context7 first (structured docs), Exa second (broader web search)
- For deep investigative research (novel algorithms, academic papers, state-of-the-art), use `research-deep` instead
- ExternalScout is for EXTERNAL research only — if you need codebase exploration, use `scout-parallel` or `analyze-deep`
