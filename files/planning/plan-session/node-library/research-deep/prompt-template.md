# Research: Deep Investigation

Dispatch @ExternalScout to conduct investigative research with full authority to discover, compare, and recommend.

**Todo:** `["task"]`

**Zone 1 — Fixed execution spec:**

> (1) Dispatch @ExternalScout subagent to investigate the research question below. (2) Research question: {{RESEARCH_QUESTION}}. (3) Domain context: {{DOMAIN_CONTEXT}}. (4) Exploration mandate: {{EXPLORATION_DIRECTION_1}}, {{EXPLORATION_DIRECTION_2}}, {{EXPLORATION_DIRECTION_3}} (optional if only 2 directions). (5) Tool priority: web_search_advanced_exa first for broad discovery, crawling_exa second for depth, get_code_context_exa third for reference implementations, Context7 only for well-documented libraries. (6) Output: structured report with top 2–3 approaches compared, recommendation justified, gaps identified, and confidence levels (High: 3+ sources; Medium: 2 sources; Low: 1 or conflicting) — not a source list.

**Zone 2 — Planning agent fills:**

{{RESEARCH_QUESTION}}: specific answerable question, not topic area.
✓ Good: "What are the trade-offs between Redis Pub/Sub and Redis Streams for real-time notifications at scale?"
✗ Bad: "Redis messaging"

{{DOMAIN_CONTEXT}}: constraints and current state.
✓ Good: "Current architecture uses REST polling; Redis available; sub-100ms delivery required."
✗ Bad: "We need a better approach"

{{EXPLORATION_DIRECTION_1}}, {{EXPLORATION_DIRECTION_2}}, {{EXPLORATION_DIRECTION_3}}: specific research vectors.
✓ Good: (1) "Academic papers on publish-subscribe patterns", (2) "Production case studies from engineering blogs", (3) "GitHub issues and discussions for specific libraries"
✗ Bad: "Explore thoroughly"

**Zone 3 — Fixed constraints:**

Findings must inform {{DOWNSTREAM_DECISION}} (the sequential-thinking node or next planning phase). ExternalScout must compare approaches with explicit trade-offs, recommend one, and state what was NOT found. Do not read project files. Return verbatim citations, not paraphrases. Call `next_step()` immediately after findings return.
