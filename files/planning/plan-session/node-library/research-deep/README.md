# research-deep

## When to use

When the task requires intensive investigative research — not just documentation lookup, but discovery of novel approaches, academic publications, state-of-the-art techniques, or comparative analysis across multiple sources. Use when the implementation direction itself is uncertain and research must inform the architectural decision, not just the implementation details.

## What it does

Dispatches one `@ExternalScout` agent via a single `task` call with an expanded research mandate. ExternalScout uses the full Exa tool suite (web search, academic sources, crawling) plus Context7, and is explicitly authorized to pursue multiple research threads and synthesize findings across sources.

## What the planning agent must resolve

- **Research question** — What is the fundamental question to answer? Frame as a question, not a topic: "What are the current best practices for streaming LLM responses in production systems?" not "LLM streaming"
- **Domain context** — What is the technical domain? What existing knowledge can ExternalScout build on?
- **Exploration mandate** — Which directions should ExternalScout actively pursue? (e.g., "explore academic papers, production case studies, and library comparisons")
- **Synthesis requirement** — What should the final output synthesize? (e.g., "recommend an approach with rationale", "compare three alternatives with trade-offs")
- **Downstream decision** — How will findings inform subsequent decisions? Will results gate a `decision-gate` or feed directly into `sequential-thinking`?

## Node ID

Default: `research-deep`. Rename for specificity: `research-streaming-architecture`, `research-vector-db-options`, `research-auth-patterns`.

## Notes

- ExternalScout has a 15-step budget — for deep research, budget may be tight; scope the question carefully
- If findings need to be synthesized before the next decision, follow this node with a `sequential-thinking` node
- For multi-topic deep research, use multiple `research-deep` nodes sequentially rather than trying to cover everything in one pass
- ExternalScout is for EXTERNAL research only — if you need codebase exploration, use `scout-parallel` or `analyze-deep`
- Use `research-basic` for implementation-time lookups; use `research-deep` for pre-implementation discovery
