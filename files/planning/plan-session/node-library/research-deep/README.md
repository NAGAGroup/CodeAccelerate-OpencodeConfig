# research-deep

## When to use

When the task requires genuine investigative research — not code lookup, but **discovery of ideas**: algorithms, mathematical techniques, academic approaches, state-of-the-art methods, architectural patterns, and comparative analysis across the field. Use when you need to understand *what approaches exist and which is best* before you can even decide what to implement.

**Typical use cases:** numerical methods for a class of physics simulation; rendering techniques for a graphics feature; loss functions and training strategies for an AI/ML task; consensus algorithms for distributed systems; theoretical trade-offs between competing mathematical approaches.

**Not for:** finding how to use a specific library or API — use `research-basic` for that. `research-deep` is for questions where the answer isn't already in a docs page.

## What it does

Dispatches one `@ExternalScout` agent via a single `task` call with full investigative authority. ExternalScout uses `web_search_advanced_exa` for broad discovery, `crawling_exa` to read key sources in depth, and `get_code_context_exa` for reference implementations of techniques found. Sequential thinking is authorized for synthesizing across contradictory or complex sources. Context7 is secondary — most deep research topics won't be in library docs.

## What the planning agent must resolve

- **Research question** — What is the fundamental question to answer? Good: "What numerical methods are best suited for simulating incompressible fluid dynamics at interactive frame rates?" (specific, answerable domain question). Bad: "fluid simulation" (topic, not a question — ES has no way to know what level of answer is needed).
- **Domain context** — What is the technical domain? What existing knowledge can ExternalScout build on? What constraints (performance targets, hardware, language) bound the answer?
- **Exploration mandate** — Which directions should ExternalScout actively pursue? Name them explicitly. Good: "academic papers on the topic", "production implementations or benchmarks", "reference implementations on GitHub". Bad: open-ended ("explore widely") — ES has no search anchor and wastes budget.
- **Synthesis requirement** — What should the final output synthesize? Good: "compare the top 2–3 approaches with trade-offs and recommend one given the stated constraints." Bad: (none specified — ES returns a source list rather than a recommendation). Don't dispatch without a synthesis requirement.
- **Downstream decision** — How will findings inform subsequent decisions? Will results gate a `decision-gate` or feed directly into `sequential-thinking`? Good: "Findings feed `sequential-thinking-2` which selects the algorithm and designs the implementation plan." Bad: "Used by a later node."
- The dispatched ES prompt must instruct ExternalScout to synthesize a direct answer — not a source list.
- ES must explicitly state what was found and what was not found.
- Include confidence levels for major findings: "High" (3+ sources aligned), "Medium" (2 sources), "Low" (1 source or conflicting).
- **Direction count** — How many research directions should ExternalScout actively pursue? Good: 2–3 specific named directions. Bad: Open-ended exploration (budgets 15 steps on undirected searches and produces low-quality synthesis.)

## Node ID

Default: `research-deep`. Rename for specificity: `research-fluid-sim-methods`, `research-rendering-techniques`, `research-loss-functions`, `research-consensus-algorithms`.

## Notes

- ExternalScout has a 15-step budget — scope the question carefully; deep research burns budget fast
- Tool priority for this node: `web_search_advanced_exa` first for broad discovery, `crawling_exa` for reading key sources in depth, `get_code_context_exa` for reference implementations — Context7 only if the topic happens to be a well-documented library
- If findings need to be synthesized before the next decision, follow this node with a `sequential-thinking` node
- For multi-topic deep research, use multiple `research-deep` nodes sequentially rather than trying to cover everything in one pass
- ExternalScout is for EXTERNAL research only — if you need codebase exploration, use `scout-parallel` or `analyze-deep`
- Use `research-basic` for implementation-time code/API lookups; use `research-deep` for pre-implementation idea discovery
- **Failure mode:** Using research-deep for a simple API or config lookup.
- **Mechanism:** Deep research authorizes multiple search threads — the extra latitude wastes the 15-step budget on tangential exploration.
- **Fix:** If the question is "how do I use X", use `research-basic` instead.
- **Failure mode:** Omitting the synthesis requirement from the dispatched prompt. Without explicit synthesis instructions, ExternalScout returns a list of sources rather than actionable findings. Always specify what to synthesize: a recommendation, a comparison table, or a ranked list of approaches.
