# Research: Basic Lookup

Dispatch @ExternalScout to research a specific topic using prioritized external sources.

**Todo:** `["task"]`

**Zone 1 — Fixed execution spec:**

> (1) Dispatch @ExternalScout subagent to research the topic below. (2) Research topic: {{RESEARCH_TOPIC}}. (3) Tool priority: Context7 first for API/library documentation; `get_code_context_exa` second for code examples; web search only as last resort. (4) Scope: external sources only — ExternalScout must not read project files. (5) Output: direct answer with code examples, specific version numbers, and minimum version requirements — not a link list or survey. Return findings and call `next_step()` immediately.

**Zone 2 — Planning agent fills:**

{{RESEARCH_TOPIC}}: specific question or API lookup target.
✓ Good: "What is the exact syntax for configuring TLS client certificates in the Python requests library?"
✗ Bad: "Python HTTP libraries"

{{CONTEXT}}: what ExternalScout should build on.
✓ Good: "Our code uses urllib currently; we need TLS client cert auth, not system certificates."
✗ Bad: "We need a better library"

{{EXPECTED_OUTPUT}}: what form the answer should take.
✓ Good: "Function/method signature, parameter descriptions, one working example, and minimum library version."
✗ Bad: "Whatever you find"

**Zone 3 — Fixed constraints:**

This is a cursory lookup — use at most 2–3 tool calls. Do not pursue multiple research threads or compare alternatives; stop after the first complete answer. ExternalScout must synthesize a direct answer, not return raw links. Call `next_step()` after task returns.
