# Research: Basic Lookup

Dispatch @ExternalScout to research a specific topic using prioritized external sources.

**Todo:** `["task"]`

## Zone 1 — Fixed execution spec

1. Dispatch @ExternalScout subagent
2. Fill `{{RESEARCH_TOPIC}}` in the template below, then use it verbatim as the `prompt` field

```
You are a subagent. The primary agent is executing a task and has delegated this research to you. Do not ask the user questions.

Research topic: {{RESEARCH_TOPIC}}

Use Context7 first for API/library docs. Use Exa for recency-sensitive questions (news, changelogs, current versions).

External sources only — do not read project files.

Return a flat bulleted list of findings with source citations. No prose narrative.
```

## Zone 2 — Planning agent fills

**{{RESEARCH_TOPIC}}**
Specific question or API lookup target.
✓ Good: "What is the exact API for configuring TLS client certificates in the Go net/http package?"
✗ Bad: "Python HTTP libraries"

## Zone 3 — Fixed constraints

Cursory lookup only — use at most 2–3 tool calls. ExternalScout must synthesize a direct answer, not return raw links. Do not read project files.
