# Research: {{RESEARCH_TOPIC}}

## Zone 1: Fixed Framing

You are HeadWrench. In this node, dispatch @ExternalScout for targeted external research on a code-related topic. This is a cursory lookup — not a deep investigation. ExternalScout will prioritize Context7 (library documentation) first, then use code-example tools if needed. No multi-threaded exploration.

---

## Zone 2: Planning Agent Fills These Slots

### {{RESEARCH_TOPIC}}
*What is the specific question or API/config lookup target?*

*Example (good): "What is the exact syntax for configuring TLS client certificates in the requests library (Python)?"*

*Example (bad): "Python HTTP libraries" (too broad — produces a survey, not a how-to)*

### {{OUTPUT_FORMAT}}
*What specific form should the answer take?*

*Example: "Include the exact configuration code, which library versions support it, and a working example. Cite the minimum required version."*

### {{DOWNSTREAM_USE}}
*How will this research feed into the next planning step?*

*Example: "A code implementation node will use this to write the HTTP client setup — include exact syntax and version requirements."*

### {{SCOPE_BOUNDARY}}
*What threads can ExternalScout follow if the first source is incomplete?*

*Example: "Use Context7 first. If the docs lack a working example, use `get_code_context_exa` to find one from GitHub repos. Stop after first example is found."*

---

## Zone 3: Fixed Execution Specs (Recency)

### Answer Format Requirement

ExternalScout must synthesize a **direct answer with code examples**. Do NOT return a list of links or a survey-style summary. Cite specific library versions and minimum version requirements. If the research is partially successful, state explicitly what was found and what was NOT found.

### Scope Guard

This is a cursory research pass. Use Context7 first (`context7_resolve-library-id` to resolve the library ID, then `context7_query-docs` with that ID). Use `get_code_context_exa` second if needed for code examples. Do NOT perform multiple search iterations — report what you find and stop. Do NOT loop or pursue multiple threads.

---

### Dispatch Blockquote (Final Element)

> **Writing the @ExternalScout task prompt:** Include these instructions verbatim or adapted:
>
> 1. Tell @ExternalScout the exact research topic/question — name the specific library, API, configuration option, or error pattern you need researched.
> 2. Include this exact instruction: "Prioritize Context7 first — call `context7_resolve-library-id` to identify the library, then `context7_query-docs` with that ID. Use `get_code_context_exa` second for code examples and GitHub patterns. Use `web_search_exa` only as a last resort."
> 3. Include this exact instruction: "Synthesize a direct answer with code examples. Cite specific library versions and minimum version requirements. Do NOT return a list of links or a survey-style summary."
> 4. Include this exact instruction: "This is a cursory research pass — use at most 2–3 research tool calls and stop. Do not pursue multiple threads or cross-reference conflicting sources."

## Todo

> **Task tool:** Required params: `subagent_type` ("ExternalScout"), `description` (3–5 words), `prompt` (full instructions). Omit `task_id` for new tasks.

1. `task` — Dispatch @ExternalScout with the research instructions from Zones 1–3 above.

## After ExternalScout Reports Back

Call `next_step()` to advance to the downstream node. If the research found nothing useful, note this in your context — the absence of documentation is itself actionable information.

## Fill Examples

**Example 1 — Library API lookup:**
- Research topic: "React Query v5 — the `invalidateQueries` API and how to use it after a mutation"
- Output format: "Function signature, parameter descriptions, a working code example showing invalidateQueries in a mutation callback, and the React Query version number"
- Downstream use: "A sequential-thinking node will decide which invalidation pattern to use in our mutation handler"
- Scope boundary: "Use Context7 first. If the docs lack a complete example, use `get_code_context_exa` to find one from a GitHub repo. Stop after first example found."

**Example 2 — Configuration options:**
- Research topic: "PostgreSQL connection pooling in Node.js — exact options for node-postgres (pg) pool configuration"
- Output format: "The key configuration parameters (max, idleTimeoutMillis, max_overflow), their defaults, and one complete working example config file"
- Downstream use: "An implementation node will copy this config into the database connection setup"
- Scope boundary: "Context7 only — the node-postgres documentation should cover all pooling options"
