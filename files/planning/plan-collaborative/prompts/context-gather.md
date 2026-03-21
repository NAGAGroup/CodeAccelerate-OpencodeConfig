# Context Exploration

Your task is to **explore the design context and gather relevant patterns and precedents**. For architecture/design tasks, research industry patterns and tool ecosystems too.

## Codebase Exploration

Survey the codebase and design space for:
1. **Existing Patterns** — What design patterns or components already exist?
2. **Architectural Constraints** — How does the technical architecture shape what's possible?
3. **Related Work** — Similar designs or decisions elsewhere in the codebase?
4. **Design Precedent** — How does the product handle similar problems?
5. **User Context** — Who will use this? What's their workflow?

## External Research (if applicable)

**When to research:** Task involves designing architecture, selecting tools, or making framework decisions (keywords: `architecture`, `design pattern`, `API gateway`, `microservice`, `library selection`, `framework choice`, `integrate`, `ecosystem`).

**Tools available:**
- `exa_web_search` — Current patterns and implementation guides
- `context7_query-docs` — Framework/library documentation and comparisons
- `exa_get_code_context` — Real-world implementation examples

**What to search:**
- `"API gateway architecture patterns 2024"`
- `"microservice framework comparison Node.js"`
- `"GraphQL vs REST API design patterns"`

**Stop when:** You find architectural patterns, tool comparisons, and implementation approaches (max 2-3 queries).

**Example:** Task is "Design API gateway for microservices":
- Codebase: "Uses Express patterns; see `services/api.js` middleware structure"
- External: "Kong and AWS API Gateway are industry standards; recommend rate-limiting, auth, routing patterns"

## Output

Summarize findings:
- Key design patterns to follow (internal + external)
- Architectural constraints and decisions
- 2-3 relevant precedents from codebase and industry
- User context and workflow
- Tool/library recommendations (if researched)

Call `next_step()` when ready.
