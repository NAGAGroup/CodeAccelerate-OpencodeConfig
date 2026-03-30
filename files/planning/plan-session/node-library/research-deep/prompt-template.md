# {{TOPIC}}

You are HeadWrench. In this node, write and dispatch a single ExternalScout research task with full investigative authority.

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

> **Writing the ExternalScout's prompt:** The prompt must specify: (1) the exact research question, domain context, and constraints; (2) tool priority: use `web_search_advanced_exa` for broad discovery across the field, `crawling_exa` to read key sources in depth, and `get_code_context_exa` for reference implementations of techniques found — use Context7 only if the topic is a well-documented library; (3) depth authorization: "You are authorized to perform multiple iterative searches. Use sequential thinking for complex trade-offs. Pursue contradictions to resolution or flag as unresolved."; (4) return format: synthesize findings into a direct answer with supporting evidence and confidence levels — High (3+ sources), Medium (2 sources), Low (1 source or conflicting). Explicitly state what was found and what was not found; (5) Termination: "When you have gathered sufficient evidence to answer the research question with confidence, stop searching and return your synthesis. Do not continue indefinitely."

## Output requirements (fixed)

The research synthesis must include:
- A direct answer to the research question (recommendation, comparison, or ranked list as specified)
- Confidence levels for major findings: High (3+ aligned sources), Medium (2 sources), Low (1 source or conflicting)
- An explicit statement of what was NOT found
- Code examples where they illustrate the approach (not as decoration)

If ExternalScout returns only a source list without synthesis, flag the gap before advancing.

- Don't present findings as a list of URLs or source titles without synthesizing the answer.
- Don't omit confidence levels — downstream sequential-thinking nodes need to weight findings.

## Todo

> **Task tool:** Required params: `subagent_type` (one of: `context-scout`, `context-insurgent`, `junior-dev`, `quick-doc`, `external-scout`, `headwrench`), `description` (3–5 words), `prompt` (full instructions). **`task_id` is optional — omit it for new tasks.** Only include `task_id` if resuming a prior session; it must start with `ses_`. Do not fabricate a `task_id`.

1. `task` — Dispatch @ExternalScout with the full research mandate above. Instruct ExternalScout to: use `web_search_advanced_exa` for broad field discovery; use `crawling_exa` to read key sources in depth; use `get_code_context_exa` for reference implementations of techniques found; use Context7 only if the topic is a well-documented library. Authorize multiple iterative searches and sequential thinking for trade-off analysis. Synthesize findings into a direct answer with confidence levels (High/Medium/Low). Explicitly state what was found and what was not found.

## Before advancing

After the researcher reports back, call `next_step()` to advance to the next node. If the research returned no useful findings, note this in your context and proceed — the gap itself is useful information.

## Fill examples

**Example 1 — Numerical methods (physics simulation):**
- Research question: "What numerical integration methods are best suited for real-time incompressible fluid simulation at interactive frame rates? Compare stability, accuracy, and computational cost."
- Domain context: "GPU-accelerated simulation, C++/CUDA, target: 60fps at 256³ grid. Stability matters more than accuracy."
- Exploration mandate: Direction 1: academic papers on SPH, FLIP, grid-based methods. Direction 2: production implementations in games/VFX (how studios solve this). Direction 3: recent GPU-optimized approaches.
- Synthesis requirement: "Ranked comparison of top 3 methods with trade-offs. Recommend one given the stated constraints."
- Downstream decision: "`sequential-thinking` selects the algorithm and designs the solver architecture."

**Example 2 — AI/ML research:**
- Research question: "What loss functions and training strategies produce the best perceptual quality for neural radiance field (NeRF) scene reconstruction with sparse input views?"
- Domain context: "PyTorch, 8 input views, target: photorealistic novel view synthesis. No prior NeRF implementation in codebase."
- Exploration mandate: Direction 1: recent papers on sparse-view NeRF (2022–2025). Direction 2: loss function comparisons (perceptual, SSIM, frequency-based). Direction 3: reference implementations on GitHub.
- Synthesis requirement: "Top 2–3 approaches with confidence levels. Include reference implementation links."
- Downstream decision: "`decision-gate` selects the approach before implementation begins."

**Example 3 — Graphics technique:**
- Research question: "What screen-space ambient occlusion techniques (SSAO, HBAO, GTAO) offer the best quality/performance trade-off for a deferred renderer targeting mid-range GPUs?"
- Domain context: "OpenGL 4.6 deferred pipeline, 1080p target, ~4ms AO budget per frame."
- Exploration mandate: Direction 1: technique comparisons and benchmarks. Direction 2: production implementations (game engines, demos). Direction 3: recent improvements or hybrid approaches.
- Synthesis requirement: "Comparison table with quality/perf trade-offs. Recommend one and link a reference implementation."
- Downstream decision: "`impl-ao` uses the recommendation to implement the chosen technique."
