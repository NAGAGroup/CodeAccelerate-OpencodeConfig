# {{TOPIC}}

Dispatch @ExternalScout to conduct deep investigative research. The findings will inform [downstream decision/node].

## Research question

{{RESEARCH_QUESTION}}
*Frame as a specific answerable question, not a topic area. Good: "What are the trade-offs between Redis Pub/Sub and Redis Streams for real-time notification at scale?" Bad: "Redis messaging."*

## Domain context

{{DOMAIN_CONTEXT}}
*What is already known. What ExternalScout should build on vs. explore fresh. E.g., "Current architecture uses REST polling; team has Redis available; constraint is sub-100ms delivery."*

## Exploration mandate

Actively pursue the following research directions:

{{DIRECTION_1}}
*Name the research direction explicitly. E.g., "Academic papers on consensus protocols", "Production case studies from engineering blogs", "GitHub issues for the specific library."*

{{DIRECTION_2}}
*Second research direction (omit if only one direction needed).*

Do not stop at the first source. Follow threads across multiple sources and synthesize.

## Expected output

{{EXPECTED_OUTPUT}}
*Describe the synthesis: a recommendation with rationale, a comparison table, a ranked list. Good: "Recommend one approach with trade-offs and a confidence level." Bad: "Tell me what you found."*

> **Writing the ExternalScout's prompt:** The prompt must specify: (1) the exact research question and scope; (2) authorize all tools: use Context7 first — call `context7_resolve-library-id` to identify the library, then `context7_query-docs` to retrieve documentation — then Exa web search for broad discovery and Exa crawling for in-depth source reading; (3) depth authorization: "You are authorized to perform multiple iterative searches. Use sequential thinking for complex trade-offs. Pursue contradictions to resolution or flag as unresolved."; (4) return format: synthesize findings into a direct answer with supporting evidence and code examples where they illustrate the approach — not a list of sources. Include confidence levels: High (3+ sources), Medium (2 sources), Low (1 source or conflicting). Explicitly state what was found and what was not found.

## Output requirements (fixed)

The research synthesis must include:
- A direct answer to the research question (recommendation, comparison, or ranked list as specified)
- Confidence levels for major findings: High (3+ aligned sources), Medium (2 sources), Low (1 source or conflicting)
- An explicit statement of what was NOT found
- Code examples where they illustrate the approach (not as decoration)

If ExternalScout returns only a source list without synthesis, flag the gap before advancing.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ExternalScout with the full research mandate above. Instruct ExternalScout to: use Context7 first (call `context7_resolve-library-id`, then `context7_query-docs`); then use Exa web search for broad discovery and Exa crawling for in-depth reading of key sources. Authorize multiple iterative searches and sequential thinking for trade-off analysis. Include code examples where they illustrate the approach. Synthesize findings into a direct answer with confidence levels (High/Medium/Low). Explicitly state what was found and what was not found.

## Before advancing

After the researcher reports back, call `next_step()` to advance to the next node. If the research returned no useful findings, note this in your context and proceed — the gap itself is useful information.
