# Pre-Research Thinking

Call `sequential-thinking_sequentialthinking` repeatedly to reason through the scouts' findings and determine whether external research is needed, what gaps exist, and what execution path to take.

**Todo:** `["sequential-thinking_sequentialthinking"]`

> (1) Consolidate scout findings: what does the codebase contain, what's ambiguous, and does it provide enough context for a complete plan?
> (2) Identify knowledge gaps: what remains unknown that model training data might not cover well (e.g., recent library versions, fast-moving frameworks, environment-specific behavior)?
> (3) Decide if planning-time research is necessary (would external docs/APIs change the plan?) or unnecessary (codebase + model knowledge suffice)?
> (4) Determine if execution-time research is needed (e.g., runtime configuration, version-specific edge cases, or multi-source synthesis deferred to DAG implementation)?
> (5) If execution research is needed, classify as `research-basic` (specific lookup) or `research-deep` (multi-source synthesis)?
> (6) End with a 3-line block: Planning research: [NECESSARY|RECOMMENDED|NO] — [reason]. Execution research: [NECESSARY|RECOMMENDED|NO] — [reason]. Execution research type: [research-basic|research-deep|N/A] — [reason].

Call this tool repeatedly until your conclusion is clear, then call `next_step()`.
