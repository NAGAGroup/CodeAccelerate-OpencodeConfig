# {{TOPIC}}

*The technology, library, algorithm, or domain being researched. Good: "Ollama tool-calling reliability on RTX 4090". Bad: "AI stuff".*

You are HeadWrench. In this node, dispatch @ExternalScout to conduct investigative research with full authority to discover, compare, and recommend approaches.

The findings will inform {{DOWNSTREAM_DECISION}}.

*What this research informs — the specific node or decision that consumes these findings. Good: "Informs the sequential-thinking node that selects the recommended model". Bad: "The next steps".*

---

## Zone 1: Research Framing

### Research Question

{{RESEARCH_QUESTION}}

*Frame as a specific answerable question, not a topic area. Good: "What are the trade-offs between Redis Pub/Sub and Redis Streams for real-time notification at scale?" Bad: "Redis messaging."*

### Domain Context

{{DOMAIN_CONTEXT}}

*What is already known. What ExternalScout should build on vs. explore fresh. E.g., "Current architecture uses REST polling; team has Redis available; constraint is sub-100ms delivery."*

### Exploration Mandate

Explicitly direct @ExternalScout to pursue these research directions:

1. {{EXPLORATION_DIRECTION_1}}
2. {{EXPLORATION_DIRECTION_2}}
3. {{EXPLORATION_DIRECTION_3}} *(optional if only 2 directions needed)*

*Name each direction explicitly. E.g., "Academic papers on consensus protocols", "Production case studies from engineering blogs", "GitHub issues for the specific library." Do not leave exploration open-ended.*

---

## Zone 2: Execution Specification (Fixed — do not modify)

### Synthesis Requirement

@ExternalScout must synthesize findings, not return a source list. The output must:

- Compare the top 2–3 approaches identified in the research with explicit trade-offs on each dimension named in the exploration mandate
- Recommend one approach and justify it against the stated constraints
- State what was found AND what was NOT found (gaps in available research)
- Include confidence levels: High (3+ sources aligned), Medium (2 sources), Low (1 source or conflicting)

### Tool Priority

- Primary: `web_search_advanced_exa` for broad discovery across the field
- Secondary: `crawling_exa` to read key sources in depth
- Tertiary: `get_code_context_exa` for reference implementations of techniques found
- Context7 only if the topic is a well-documented library or framework

---

## Zone 3: Dispatch Instructions (Final — HW reads and acts immediately)

> **Writing the @ExternalScout task prompt:** Embed these five elements in your dispatch prompt:
>
> 1. **Research question and domain context** — In your dispatch prompt, state the research question and domain context from above verbatim. This grounds ExternalScout's investigation in the specific constraints.
> 2. **Exploration mandate** — In your dispatch prompt, list the 2–3 exploration directions from above exactly as written. This prevents open-ended exploration and keeps the research focused.
> 3. **Tool priority** — Include this exact instruction in your dispatch prompt: "Use `web_search_advanced_exa` first for broad discovery, then `crawling_exa` to read key sources in depth, then `get_code_context_exa` for reference implementations. Use Context7 only for well-documented libraries."
> 4. **Synthesis requirement** — Include this exact instruction verbatim in your dispatch prompt: "Compare the top 2–3 approaches identified in your research with explicit trade-offs on each dimension named in the exploration mandate. Recommend one approach and justify it against the stated constraints. State what was found AND what was NOT found (gaps in available research). Include confidence levels: High (3+ sources aligned), Medium (2 sources), Low (1 source or conflicting)."
> 5. **Output format** — Include this exact instruction in your dispatch prompt: "Return a synthesized direct answer with supporting evidence and confidence levels, not a source list or generic overview."

---

## Todo

1. `task` — Dispatch @ExternalScout with the full research mandate, tool priority, and synthesis requirement as specified above

## After the Research

MUST call `next_step()` immediately after @ExternalScout reports findings. Do NOT summarize findings for the user, propose next steps, or ask questions — advance immediately. If the research returned no useful findings, note the gap and proceed — the absence is itself actionable information.

---

## Reference Examples

**Example 1 — Numerical Methods (Physics Simulation)**
- Research question: "What numerical integration methods are best suited for real-time incompressible fluid simulation at interactive frame rates?"
- Domain context: "GPU-accelerated simulation, C++/CUDA, target: 60fps at 256³ grid. Stability matters more than accuracy."
- Exploration directions: (1) Academic papers on SPH, FLIP, grid-based methods. (2) Production implementations in games/VFX (how studios solve this). (3) Recent GPU-optimized approaches.
- Synthesis: "Ranked comparison of top 3 methods with trade-offs. Recommend one given the stated constraints."
- Downstream: "`sequential-thinking` selects the algorithm and designs the solver architecture."

**Example 2 — AI/ML Research**
- Research question: "What loss functions and training strategies produce the best perceptual quality for neural radiance field (NeRF) scene reconstruction with sparse input views?"
- Domain context: "PyTorch, 8 input views, target: photorealistic novel view synthesis. No prior NeRF implementation in codebase."
- Exploration directions: (1) Recent papers on sparse-view NeRF (2022–2025). (2) Loss function comparisons (perceptual, SSIM, frequency-based). (3) Reference implementations on GitHub.
- Synthesis: "Top 2–3 approaches with confidence levels. Include reference implementation links."
- Downstream: "`decision-gate` selects the approach before implementation begins."

**Example 3 — Graphics Technique**
- Research question: "What screen-space ambient occlusion techniques (SSAO, HBAO, GTAO) offer the best quality/performance trade-off for a deferred renderer targeting mid-range GPUs?"
- Domain context: "OpenGL 4.6 deferred pipeline, 1080p target, ~4ms AO budget per frame."
- Exploration directions: (1) Technique comparisons and benchmarks. (2) Production implementations (game engines, demos). (3) Recent improvements or hybrid approaches.
- Synthesis: "Comparison table with quality/perf trade-offs. Recommend one and link a reference implementation."
- Downstream: "`impl-ao` uses the recommendation to implement the chosen technique."
