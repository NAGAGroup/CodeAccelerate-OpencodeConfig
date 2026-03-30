# [Research Question]

Dispatch @ExternalScout to conduct deep investigative research on [topic]. The findings will inform [downstream decision/node].

## Research question

[State the fundamental question as a question. Frame it precisely: what needs to be discovered, not just what topic to explore.]

## Domain context

[What is the technical domain? What is already known? What should ExternalScout build on vs. explore fresh?]

## Exploration mandate

Actively pursue the following research directions:
- [Direction 1 — e.g., "academic papers and publications"]
- [Direction 2 — e.g., "production case studies and engineering blogs"]
- [Direction 3 — e.g., "library and framework comparisons"]

Do not stop at the first source. Follow threads across multiple sources and synthesize.

## Expected output

[Describe the synthesis required: a recommendation, a comparison table, a ranked list of approaches with trade-offs, etc.]

> **Writing the ExternalScout's prompt:** The prompt must specify: (1) the exact research question and scope; (2) authorize all tools: use Context7 first — call `context7_resolve-library-id` to identify the library, then `context7_query-docs` to retrieve documentation — then Exa web search for broad discovery and Exa crawling for in-depth source reading; (3) depth authorization: "You are authorized to perform multiple iterative searches. Use sequential thinking for complex trade-offs. Pursue contradictions to resolution or flag as unresolved."; (4) return format: synthesize findings into a direct answer with supporting evidence and code examples where they illustrate the approach — not a list of sources. Include confidence levels: High (3+ sources), Medium (2 sources), Low (1 source or conflicting). Explicitly state what was found and what was not found.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ExternalScout with the full research mandate above. Instruct ExternalScout to: use Context7 first (call `context7_resolve-library-id`, then `context7_query-docs`); then use Exa web search for broad discovery and Exa crawling for in-depth reading of key sources. Authorize multiple iterative searches and sequential thinking for trade-off analysis. Include code examples where they illustrate the approach. Synthesize findings into a direct answer with confidence levels (High/Medium/Low). Explicitly state what was found and what was not found.

## Before advancing

After the researcher reports back, call `next_step()` to advance to the next node. If the research returned no useful findings, note this in your context and proceed — the gap itself is useful information.
