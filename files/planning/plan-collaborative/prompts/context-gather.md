# Collaborative Planning: Context Gather & Scout

**Phase:** INFO  
**Purpose:** Explore design context, patterns, and related architecture across multiple codebase areas  
**Duration:** 5-10 minutes  
**Domain:** Collaborative design exploration

---

## Task

Scout the codebase to understand the design landscape: existing patterns, architectural layers, related modules, and prior decisions that inform this design challenge.

## Parallel Scout Dispatch (Improvement B1)

When this design problem affects **multiple codebase areas** (e.g., frontend UI, backend API, data model, configuration), use **@ContextScout agents in parallel**. Each scout handles one area independently; gather findings and consolidate.

**Example:**
- Design problem: "Improve caching strategy for API responses"
- Affected areas: API layer (request/response handlers), caching middleware, client cache logic
- **Action:** Dispatch 3 @ContextScout agents in parallel:
  1. Scout explores API handler patterns and current caching integrations
  2. Scout explores middleware and cache invalidation logic
  3. Scout explores client-side cache implementation
- **Consolidate:** Gather 3 findings; note overlaps, conflicts, missing pieces

## Codebase Exploration

Survey the codebase and design space for:
1. **Existing Patterns** — What design patterns or components already exist?
2. **Architectural Constraints** — How does the technical architecture shape what's possible?
3. **Related Work** — Similar designs or decisions elsewhere in the codebase?
4. **Design Precedent** — How does the product handle similar problems?
5. **Team Standards** — Coding style, framework conventions, architectural guidelines

## Web Research Tools for Design Patterns (Improvement B4)

Use these tools explicitly when scouting design areas:

- **`exa_web_search`** — Search for design patterns, best practices, architectural approaches (e.g., "event-driven architecture patterns", "cache invalidation strategies")
- **`context7_query-docs`** — Query framework or library documentation (e.g., "React hooks patterns", "Express middleware design")
- **`exa_get_code_context`** — Retrieve working code examples in target framework (e.g., "Redux store patterns", "Node.js cluster management")

**Dispatch Criteria:**
- If task mentions an external library/framework → use `context7` for official docs
- If task requires understanding best practices → use `exa_web_search`
- If task requires seeing working examples → use `exa_get_code_context`

**Stop when:** You find architectural patterns, tool comparisons, and implementation approaches (max 2-3 queries).

## Sequential Thinking for Complex Scouting (Improvement B2)

If this design problem requires understanding interactions across 3+ layers or has competing concerns:
- Use **sequential-thinking** to reason through the scout findings
- Example: "Use sequential-thinking to map data flow through caching layer, considering both performance and consistency implications"

## Output

Summarize findings:
```
## Context Scout Summary

### Design Patterns in Scope
- [Pattern 1]: Where used, why chosen, trade-offs visible
- [Pattern 2]: ...

### Architectural Layers Affected
- [Layer 1 - e.g., API Handler]: Current design, constraints
- [Layer 2 - e.g., Middleware]: Current design, constraints

### Related Modules & Dependencies
- [Module 1]: Role in design, coupling points

### Prior Design Decisions (Trade-offs Made)
- [Decision 1]: What was chosen, what was rejected, why

### Team Standards & Conventions
- Coding style, framework conventions, architectural rules

### Web Research Findings
- [Tool used + finding]: Design patterns from industry
- [Tool used + finding]: Best practices for this architectural concern
```

---

**See also:**
- `planning-audit-spec.md` Section B1 (@ContextScout parallel dispatch)
- `planning-audit-spec.md` Section B2 (Sequential thinking integration)
- `planning-audit-spec.md` Section B4 (Web tools integration)
