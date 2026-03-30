# research-deep

## When to use

When the task requires intensive investigative research — not just documentation lookup, but discovery of novel approaches, academic publications, state-of-the-art techniques, or comparative analysis across multiple sources. Use when the implementation direction itself is uncertain and research must inform the architectural decision, not just the implementation details.

## What it does

Dispatches one `@ExternalScout` agent via a single `task` call with an expanded research mandate. ExternalScout uses the full Exa tool suite (web search, academic sources, crawling) plus Context7, and is explicitly authorized to pursue multiple research threads and synthesize findings across sources.

## What the planning agent must resolve

- **Research question** — What is the fundamental question to answer? Good: "What are the current best practices for streaming LLM responses in production systems with sub-500ms TTFBT?" (specific, answerable). Bad: "LLM streaming" (topic, not a question — ES has no way to know what level of answer is needed).
- **Domain context** — What is the technical domain? What existing knowledge can ExternalScout build on?
- **Exploration mandate** — Which directions should ExternalScout actively pursue? (e.g., "explore academic papers, production case studies, and library comparisons")
- **Synthesis requirement** — What should the final output synthesize? (e.g., "recommend an approach with rationale", "compare three alternatives with trade-offs") Don't dispatch ExternalScout without a synthesis requirement — without it, ES returns a list of sources rather than actionable findings.
- **Downstream decision** — How will findings inform subsequent decisions? Will results gate a `decision-gate` or feed directly into `sequential-thinking`? Good: "Findings feed `sequential-thinking-2` which decides whether to adopt streaming or polling." Bad: "Used by a later node." (Too vague — planning agent cannot infer the output format needed.)
- The dispatched ES prompt must instruct ExternalScout to synthesize a direct answer — not a source list.
- ES must explicitly state what was found and what was not found.
- Include confidence levels for major findings: "High" (3+ sources aligned), "Medium" (2 sources), "Low" (1 source or conflicting).
- **Direction count** — How many research directions should ExternalScout actively pursue? Good: 2–3 specific named directions. Bad: Open-ended exploration (budgets 15 steps on undirected searches and produces low-quality synthesis.)

## Node ID

Default: `research-deep`. Rename for specificity: `research-streaming-architecture`, `research-vector-db-options`, `research-auth-patterns`.

## Notes

- ExternalScout has a 15-step budget — for deep research, budget may be tight; scope the question carefully
- If findings need to be synthesized before the next decision, follow this node with a `sequential-thinking` node
- For multi-topic deep research, use multiple `research-deep` nodes sequentially rather than trying to cover everything in one pass
- ExternalScout is for EXTERNAL research only — if you need codebase exploration, use `scout-parallel` or `analyze-deep`
- Use `research-basic` for implementation-time lookups; use `research-deep` for pre-implementation discovery
- When writing the ES prompt, instruct ExternalScout to use Context7 first: call `context7_resolve-library-id` then `context7_query-docs`. Use Exa web search and crawling only after Context7.
- **Failure mode:** Using research-deep for a simple API or config lookup.
- **Mechanism:** Deep research authorizes multiple search threads — the extra latitude wastes the 15-step budget on tangential exploration.
- **Fix:** If the question is a targeted API lookup ("how do I use X"), use `research-basic` instead.
- **Failure mode:** Omitting the synthesis requirement from the dispatched prompt. Without explicit synthesis instructions, ExternalScout returns a list of sources rather than actionable findings. Always specify what to synthesize: a recommendation, a comparison table, or a ranked list of approaches.
