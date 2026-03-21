# Scout Research Integration Specification

## Overview

Scout nodes in planning DAGs gather contextual knowledge before task decomposition. This specification extends all scout nodes to include minimal external research capability, allowing HeadWrench to discover external resources (APIs, libraries, frameworks, code patterns) during planning.

**Core Philosophy:** Scout gathers context only. It does NOT attempt to solve the task—that's the role of the generated project DAG. Research is narrowly scoped: discover what exists, understand patterns, identify standards.

---

## Section 1: Research Trigger

### When to Dispatch Research

Scout dispatches external research **conditionally**. Research is triggered when the task description or clarified scope mentions external resources.

**Trigger Keywords/Patterns:**
- `API` — REST APIs, GraphQL, gRPC, SDK, third-party service
- `library` or `framework` — npm packages, libraries, frameworks
- `integrate` or `integration` — combining with external systems
- `migration` — moving to a new tool or platform
- `third-party` or `external` — systems outside the immediate codebase
- Specific names — e.g., "OAuth", "Stripe", "AWS", version numbers
- Language/runtime combinations — e.g., "Express.js", "React 18", "Python dataclasses"

**Decision Logic:**
```
IF task_description contains any trigger keyword:
  → "This task likely involves external resources"
  → Dispatch research
ELSE:
  → "This is internal-only work"
  → Skip research; proceed with codebase-only scout
```

**Example Triggers:**
- ✅ "Integrate Stripe payment API" → Research (API keyword)
- ✅ "Add OAuth 2.0 authentication" → Research (OAuth is external resource)
- ✅ "Upgrade to React 18" → Research (framework + version)
- ❌ "Refactor user reducer" → No research (internal)
- ❌ "Add logging to error handler" → No research (internal)

---

## Section 2: Tool Selection & Sequencing

### Available Tools

- **exa_web_search_exa** — General-purpose web search. Best for finding current information, implementation guides, blog posts, community discussions.
- **context7_query-docs** — Library/framework documentation lookup. Best for official API reference, feature docs, version-specific behavior.
- **exa_get_code_context_exa** — Code examples from repositories. Best for implementation patterns, working examples, integration tests.

### Research Query Sequencing

**Standard Sequence (for API/library integration):**

1. **Web search** (exa_web_search) — Cast a wide net for current practices and guides
   - Query pattern: `"{topic} {context} {language/framework} {year/version}"`
   - Example: `"OAuth 2.0 implementation patterns Node.js Express 2024"`
   - Goal: Identify authoritative sources, current best practices

2. **Documentation lookup** (context7_query-docs) — Find official references
   - Query pattern: `"{library/framework} {feature} implementation {language}"`
   - Example: `"Express.js middleware auth JWT"`
   - Goal: API signatures, configuration options, version-specific behavior

3. **Code examples** (exa_get_code_context) — Working implementations
   - Query pattern: `"{topic} {language} {example/tutorial} {library}"`
   - Example: `"OAuth 2.0 JavaScript Express.js example"`
   - Goal: Copy-paste ready snippets, integration patterns

**Cost-Conscious Alternative (1 query):**
Use web search only if context7 is unavailable or takes too long. Web search covers all three angles if queries are well-formulated.

**When to Stop Researching:**
- Found official documentation for the target API/library
- Found at least one complete working example
- Found the current best practice recommendation
- Maximum 2-3 queries (stay minimal; don't let research expand)

---

## Section 3: Research Query Design

### Formulating Effective Queries

A good research query includes:
1. **Topic** — What are we researching? (OAuth, Stripe API, React hooks, etc.)
2. **Context** — What problem are we solving? (authentication, payment processing, state management)
3. **Environment** — What language/framework/version? (Node.js 18, React 18, Python 3.10)
4. **Specificity** — Be concrete; avoid vague terms

**Query Template:**
```
"{Topic} {Context} {Language/Framework} {Version if known} {Year if current practice matters}"
```

**Examples:**

| Task | Query 1 (Web Search) | Query 2 (Docs) | Query 3 (Code) |
|------|-------|------|------|
| Integrate Stripe payments | `"Stripe payment integration Node.js Express 2024"` | `"Stripe API Node.js payment"` | `"Stripe Node.js example implementation"` |
| Add OAuth authentication | `"OAuth 2.0 implementation patterns Express.js"` | `"Express.js JWT authentication"` | `"OAuth 2.0 Express.js tutorial"` |
| Migrate to TypeScript | `"JavaScript to TypeScript migration strategy 2024"` | `"TypeScript project configuration best practices"` | `"TypeScript JavaScript migration examples"` |
| Use React Query | `"React Query data fetching patterns 2024"` | `"React Query useQuery hook documentation"` | `"React Query example implementation"` |

### Query Quality Checklist

- [ ] Query includes the target tool/library name
- [ ] Query includes the target language/framework
- [ ] Query includes version number if the codebase requires a specific version
- [ ] Query is 3-10 words (concise but specific)
- [ ] Query avoids "how do I" phrasing (search engines prefer declarative queries)

---

## Section 4: Findings Format

### Research Output Structure

Scout captures research findings in a structured format for downstream consumption:

```json
{
  "task_summary": "String describing the task",
  "research_triggered": true,
  "external_resources_detected": ["API", "Library", "Framework"],
  "research_performed": [
    {
      "tool": "exa_web_search",
      "query": "Query string used",
      "findings": [
        "Finding 1: URL or key insight",
        "Finding 2: ...",
        "..."
      ]
    },
    {
      "tool": "context7_query-docs",
      "library": "Library ID",
      "query": "Query string",
      "findings": ["API endpoint", "Configuration option", "Version note"]
    }
  ],
  "key_insights": [
    "Insight 1: What we learned",
    "Insight 2: Architectural decision observed",
    "Insight 3: Required dependency"
  ],
  "recommended_approach": "Summary of best practice or approach based on research",
  "codebase_context": {
    "affected_areas": ["file1", "file2"],
    "patterns_to_follow": ["existing pattern"]
  },
  "next_steps_for_decompose": "How should the decompose node use these findings?"
}
```

### Minimal Output (Fallback)

If research yields no results or is skipped:

```json
{
  "task_summary": "...",
  "research_triggered": false,
  "reason": "No external resources detected",
  "codebase_context": { "..." }
}
```

### Examples of Good Findings

**Example 1: OAuth Integration**
```json
{
  "task_summary": "Add OAuth 2.0 authentication to Express.js app",
  "key_insights": [
    "passport.js is standard Node.js OAuth middleware",
    "Recommended flow: Authorization Code Grant for web apps",
    "Requires client ID, client secret, redirect URI"
  ],
  "recommended_approach": "Use passport-oauth2 strategy with local session storage",
  "next_steps_for_decompose": "Subtasks: (1) Install passport, (2) Config OAuth provider, (3) Add routes, (4) Integrate session middleware"
}
```

**Example 2: TypeScript Migration**
```json
{
  "task_summary": "Migrate JavaScript codebase to TypeScript",
  "key_insights": [
    "Current approach: incremental migration file-by-file preferred",
    "tsconfig strict mode recommended but can be phased in",
    "Tools: type-checking with strict mode, tsup for bundling"
  ],
  "recommended_approach": "Phase 1: Configure tsconfig, Phase 2: Migrate non-dependent modules first, Phase 3: Tighten type checking",
  "next_steps_for_decompose": "Subtasks ordered by dependency; strictness increases over phases"
}
```

---

## Section 5: Decompose Integration

### How Decompose Uses Research Findings

The `decompose` node receives research findings and uses them to:

1. **Inform subtask ordering** — If research shows dependencies, order subtasks accordingly
   - Example: "Database migration requires schema design first"

2. **Route to specialized agents** — Research findings may suggest need for specialized expertise
   - Example: "OAuth requires security review → include @SecurityReviewer if available"

3. **Estimate scope** — Research findings clarify complexity
   - Example: "Found 5 official libraries; choosing one reduces scope"

4. **Add acceptance criteria** — Research identifies what "done" looks like
   - Example: "OAuth done when: token refresh works, user can logout, session persists"

5. **Flag constraints** — Research uncovers version requirements, compatibility issues
   - Example: "React Query requires React 16.8+; if codebase is older, major work needed"

### Decompose Node Prompt Integration

The decompose node will receive research findings as context:

```
## External Research Context
{findings_json_here}

## Using These Findings

If research was performed:
- Refer to "key_insights" when explaining subtask rationale
- Use "recommended_approach" to scope subtasks
- Integrate constraints into acceptance criteria
- Route to agents based on complexity identified

If research was skipped:
- Proceed with internal-only decomposition
```

---

## Section 6: Constraints & Guardrails

### What Scout Should NOT Do

- ❌ **Implement** — Scout gathers context; it does NOT write code, configuration, or solutions
- ❌ **Make decisions** — Scout reports options; decompose node makes decisions
- ❌ **Download or install** — Scout researches only; does not modify the environment
- ❌ **Make promises** — Scout says "this exists" not "this will work"
- ❌ **Deep-dive on unrelated topics** — If task mentions "React" but focus is state management, don't research React ecosystem broadly

### Research Scope Limits

- **Maximum research queries per scout:** 2-3
  - Web search: 1 query
  - Docs lookup: 1 query (context7)
  - Code examples: optional, if docs search is insufficient
  - Reason: Stay lightweight; research is context-gathering, not solution-finding

- **Maximum research time:** 10-15 seconds per scout
  - If a query takes >5 seconds, skip to next tool
  - If no results after 2 queries, stop and report as "research inconclusive"

- **Search result depth:** Use top 3-5 results only
  - Don't read entire blog posts; extract key insight only
  - Don't follow chain of links
  - Stop after finding one authoritative source

### Error Handling

**If web search returns no results:**
- Proceed to context7 documentation lookup
- If context7 also fails, report: `"No external documentation found for {topic}; proceeding with codebase-only scout"`

**If external API/service is down:**
- Report: `"Service temporarily unavailable"`
- Proceed with alternative sources or codebase-only scout

**If research query is ambiguous:**
- Try a more specific query (add language/framework)
- If still ambiguous, skip research; let clarify node refine task

**If library/API doesn't exist:**
- Report clearly: `"No official library found for {topic}"`
- Suggest alternatives if research uncovered them

---

## Section 7: Per-DAG Application

### plan-generic Scout
- **Current scope:** Codebase exploration only
- **Addition:** If task mentions external API/library, research the API/library docs and patterns
- **Example:** "If task is 'integrate GraphQL API', add research for GraphQL patterns and Apollo/Urql"

### plan-debug Scout
- **Current scope:** Bug location and affected code
- **Addition:** If task mentions external service errors, research error codes and common causes
- **Example:** "If bug is 'API timeout', research timeout patterns and debugging strategies"

### plan-collaborative Scout (currently context-gather)
- **Current scope:** Design patterns and precedent
- **Addition:** If collaborative goal involves external systems, research existing integrations
- **Example:** "If collaborating on 'API gateway design', research gateway patterns and tools"

### plan-deep-research Scout
- **Current scope:** Knowledge landscape (but lacks research tools)
- **Addition:** Explicitly use web search and context7 to discover papers, documentation, best practices
- **Example:** This is the primary DAG that MUST receive research integration

### plan-deep-review Scout
- **Current scope:** Review target quality baseline (but lacks standards access)
- **Addition:** Research relevant standards, guidelines, benchmarks for the artifact type
- **Example:** "If reviewing a security module, research OWASP guidelines, CWE vulnerabilities"

---

## Section 8: Implementation Checklist

For each scout.md rewrite, verify:

- [ ] Scout checks for external resource keywords in task
- [ ] If external resources detected, scout dispatches research
- [ ] Research queries are examples of the patterns in Section 3
- [ ] Findings are captured in JSON format (Section 4)
- [ ] Scout passes findings to clarify/evaluate nodes
- [ ] Fallback exists if research is skipped
- [ ] Error handling is documented
- [ ] Decompose node is aware of possible research findings

---

## Summary

Scout now has two phases:
1. **External resource detection** — Does task mention external APIs/libraries?
2. **Research dispatch (if triggered)** — Use web search + docs lookup to gather context
3. **Findings flow** — Structured JSON passed to downstream nodes

This keeps scout lightweight (max 2-3 queries, 10-15 seconds total) while enabling informed task decomposition when external work is involved.

All five planning DAGs can follow this spec. Exceptions are documented inline for plan-deep-research (required) and plan-deep-review (should use standards APIs).
