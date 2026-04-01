# Research Brief

Dispatch @ExternalScout to gather targeted external research on topics identified as needed during research-gate, then advance to plan design.

**Todo:** `["task"]`

> (1) Identify the single most valuable research topic from task context and scout findings (library APIs, framework behavior, recent versions, community patterns).
> (2) Dispatch @ExternalScout: instruct to use `context7_query-docs` first for library docs, then Exa for recency-sensitive questions. ✓ `context7_query-docs("React hooks API changes in v18")` / ✗ `context7_query-docs("a.ts, b.ts")`.
> (3) Request a brief structured summary with sections: Key Findings, Relevant APIs or Patterns, Caveats. Include code examples where they exist. Synthesize direct answers, not links.
> (4) Scope: one round of research only, maximum two tool calls total. This is cursory lookup, not deep multi-source investigation.
> (5) Do not summarize findings or propose plan changes — @ExternalScout returns findings to your context window only.
> (6) After @ExternalScout reports, call `next_step()` with no arguments.
