# research-deep Node Type

## When to Use

Use `research-deep` for **investigative and discovery research** — when you need to understand what approaches, algorithms, architectures, or patterns exist in a domain before deciding what to build or how to solve a problem. The goal is answering "what are the options and which is best given our constraints?"

**Contrast with `research-basic`:**
- **research-basic:** Quick API reference, config syntax, simple facts. Single-source answer sufficient. Example: "What are the required environment variables for service X?"
- **research-deep:** Comparative analysis, design trade-offs, state-of-the-art methods, architectural patterns. Multiple sources required. Synthesis mandatory. Example: "Compare caching strategies (Redis vs. in-memory vs. distributed) for a high-throughput read-heavy system with 100GB dataset."

Use `research-deep` when:
- You are choosing between competing approaches and need trade-off analysis
- You are discovering novel or best-practice patterns in a domain
- You need evidence from 2+ independent sources to build confidence
- The finding will inform architecture or technology decisions downstream

Use `research-basic` when:
- You need a single fact or config detail
- A lookup in official docs is sufficient
- No comparison is needed

## What the Planning Agent Must Resolve

Before writing a `research-deep` node, the planning agent must determine and embed these six elements in the node prompt:

### 1. Research Question (fundamental, singular)
The core question the research must answer. Must be specific enough to scope the research, not so narrow that it excludes relevant patterns.

**Good:** "What architectural patterns are most suitable for real-time data streaming at scale with sub-second latency requirements?"
**Bad:** "Tell me about data streaming."

### 2. Domain Context (technical domain + existing knowledge + constraints)
The landscape in which the research applies. Name the technology domain, what the planning agent already knows, and any hard constraints the solution must satisfy.

**Good:** "Domain: event-driven messaging. We have a 100GB/day ingest volume, sub-100ms latency requirement, and AWS-only deployment constraint. We've evaluated Kafka but need to know if Pulsar, AWS Kinesis, or RabbitMQ are viable alternatives."
**Bad:** "We need to choose a streaming technology."

### 3. Exploration Mandate (2–3 explicitly named directions)
The planning agent must name 2–3 specific research directions @ExternalScout must pursue. Do not say "explore relevant approaches" — name them. This prevents ExternalScout from returning generic overviews.

**Good:** "(1) Kafka architecture and scaling characteristics for 100GB/day, (2) Pulsar vs. Kafka trade-offs at scale, (3) AWS Kinesis as a managed alternative with cost implications."
**Bad:** "Research streaming technologies."

### 4. Synthesis Requirement (compare top 2–3 approaches with trade-offs and recommend one)
The planning agent must explicitly state that @ExternalScout must compare the top 2–3 approaches and recommend one given the stated constraints. Omitting this produces a source list, not findings.

**Good:** "Synthesize by comparing the top 2–3 approaches (from your research directions above) on these dimensions: operational overhead, cost at 100GB/day scale, latency characteristics, and AWS compatibility. Recommend one approach and justify it against our constraints."
**Bad:** "Find information about different streaming approaches."

### 5. Downstream Decision (how findings feed into next nodes)
The planning agent must name what decision or action depends on this research. This clarifies scope and prevents over-research.

**Good:** "Findings will inform whether we build on Kafka (existing knowledge) or pivot to Pulsar/Kinesis. Decision gates follow."
**Bad:** "This research is background research."

### 6. Output Format Expectation
The planning agent must understand that @ExternalScout will return: a direct answer + explicit statement of what was NOT found + confidence levels. This shapes the downstream summary they may write.

**Good:** Expect "Recommendation: Pulsar (high confidence, 3 sources aligned). Trade-off: operational complexity higher than Kafka but matches our latency requirement. NOT found: comprehensive cost modeling for 100GB/day on AWS — Pulsar is self-hosted only."
**Bad:** Expect "a list of links and summaries."

## Notes

### Failure Mode 1: Using research-deep for simple lookup
**Mechanism:** Planning agent writes a research-deep node when the question requires only a single API reference or config syntax lookup. This wastes @ExternalScout's capacity on a deep investigation when `research-basic` would answer the question directly.

**Example:** "research-deep: What is the syntax for Redis HGET?"
**Fix:** Use `research-basic` for single-fact lookups. Reserve `research-deep` for comparative or discovery questions.

### Failure Mode 2: Omitting or weakening the synthesis requirement
**Mechanism:** Planning agent fails to state that @ExternalScout must compare approaches and recommend one. The dispatched prompt says only "research X and Y." @ExternalScout returns a source list or generic overview, not findings. Downstream nodes cannot make a decision because they have not received analysis — only raw sources.

**Example (weak):** "Research caching strategies."
**Fix (strong):** "Synthesize by comparing Redis, in-memory caching, and distributed cache (Memcached) on: operational overhead, latency, cost at 100GB/day, and AWS compatibility. Recommend one approach given our constraint: 50ms max latency, 100GB dataset."

### Failure Mode 3: Exploration mandate too vague
**Mechanism:** Planning agent says "research caching" without naming specific directions. @ExternalScout produces a generic overview covering 10 approaches with no depth on any of them. Downstream decision cannot be made because no approach has been deeply investigated.

**Example (weak):** "Explore caching approaches."
**Fix (strong):** "(1) Redis at scale: cluster mode architecture and latency characteristics. (2) AWS ElastiCache managed Redis vs. self-hosted Redis trade-offs. (3) In-memory caching performance trade-offs for our 100GB dataset."

## Step Budget

@ExternalScout has a 15-step budget. Scope research carefully. If multiple independent research topics are needed, split them into separate sequential `research-deep` nodes rather than combining them — combined topics produce shallow findings on all topics.

## Output Constraint

The synthesis requirement is mandatory. The dispatched prompt must include this instruction verbatim:

"Compare the top 2–3 approaches identified in your research with explicit trade-offs on each dimension named in the exploration mandate. Recommend one approach and justify it against the stated constraints. State what was found AND what was NOT found (gaps in available research). Include confidence levels: High (3+ sources aligned), Medium (2 sources), Low (1 source or conflicting)."
