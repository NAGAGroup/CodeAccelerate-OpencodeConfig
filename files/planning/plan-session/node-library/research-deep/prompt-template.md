# Research: Deep Investigation

Dispatch @ExternalScout to conduct investigative research with full authority to discover, compare, and recommend.

**Todo:** `["task"]`

## Zone 1 — Fixed execution spec

1. Dispatch @ExternalScout subagent
2. Fill `{{RESEARCH_TOPIC}}` and `{{RESEARCH_DEPTH}}` in the template below, then use it verbatim as the `prompt` field

```
Research topic: {{RESEARCH_TOPIC}}

Depth requirement: {{RESEARCH_DEPTH}}

Use Context7 first for official docs. Use Exa for current news, changelogs, and community examples.

External sources only — do not read project files.

Return a structured report with sections: Summary, Key Findings, Sources. Cite versions. No prose filler.
```

## Zone 2 — Planning agent fills

**{{RESEARCH_TOPIC}}**
Specific question or technology comparison target.
✓ Good: "Tradeoffs between tRPC and REST for a Next.js monorepo"
✗ Bad: "Research APIs"

**{{RESEARCH_DEPTH}}**
How thorough the investigation should be.
✓ Good: "Compare at least 3 sources, include version numbers"
✗ Bad: "Thorough"

## Zone 3 — Fixed constraints

Return verbatim citations, not paraphrases. Compare approaches and state confidence levels (High: 3+ sources; Medium: 2 sources; Low: 1).
