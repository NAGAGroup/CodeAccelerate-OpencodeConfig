# Subtask 3: Update plan-generic Scout Node

**Agent:** @QuickDoc

## Goal

Rewrite `files/planning/plan-generic/prompts/scout.md` to include instructions for HeadWrench to dispatch external research tools when tasks target external resources.

## What to Do

1. **Read the design spec** from subtask 2 (`.opencode/session-plans/scout-research-integration/scout-research-spec.md`)
2. **Read the current scout.md:** `files/planning/plan-generic/prompts/scout.md`
3. **Rewrite scout.md** to include:
   - Current codebase exploration instructions (keep these)
   - NEW: Section on external research dispatch
   - NEW: When to trigger research (use spec's trigger rules)
   - NEW: What to search for and why
   - NEW: How to structure findings for downstream use
   - Examples showing both codebase-only and external-resource scenarios

## Detailed Rewrite Guidance

### Keep from Original
- Explanation of codebase exploration (affected areas, patterns, dependencies, code examples)
- The overall structure: "Survey the codebase for..."

### Add New Content

Add this section after codebase exploration:

```markdown
## External Research (if applicable)

**When:** If the task mentions external resources (APIs, libraries, frameworks, SDKs, third-party integrations), dispatch external research tools to gather context.

**How:** Use the following tools via HeadWrench:
- **exa_web_search_exa** — Web search for current docs, tutorials, API references
- **context7_query-docs** — Official documentation lookup for libraries/frameworks
- **exa_get_code_context_exa** — Code examples from repositories

**What to Search For:**
[Include specific guidance from the spec, e.g., "If task is about 'integrate OAuth', search for 'OAuth implementation [language/framework]'"]

**Example External Research Scenario:**
- Task: "Add authentication to our Express.js API"
- Research queries:
  1. "Express.js authentication patterns 2026"
  2. Context7: "/npm/passport" (popular auth library)
  3. "Passport.js JWT strategy implementation examples"
- Findings: API endpoints, auth flow diagram, best practices, code snippets

**Findings Format:**
Structure research findings as:
- Key patterns and approaches discovered
- Relevant API/library names and documentation URLs
- Code example snippets
- Architectural decisions made by others (best practices)
```

### Example Output

Show a complete example of scout output for an external-resource task:

```markdown
## Example Scout Output: External Resource Task

**Task:** "Integrate OAuth 2.0 into our Node.js microservices"

**Codebase Findings:**
- Services use Express.js for HTTP layer
- Authentication currently hardcoded; no existing auth layer
- User model in `src/models/user.ts`

**External Research Findings:**
- OAuth 2.0 standard: https://datatracker.ietf.org/doc/html/rfc6749
- Popular Node.js library: **Passport.js** (31k GitHub stars)
- Authentication patterns: JWT tokens, refresh token rotation, PKCE for mobile
- Recommended flow for SPAs: Authorization Code with PKCE
- Code examples available in Passport docs

**Recommended Approach:**
Use Passport.js with JWT strategy; implement token rotation; protect endpoints with middleware.

**Next Step:** Decompose will use these findings to route to libraries (Passport.js, jsonwebtoken) and design auth middleware as a subtask.
```

## Success Criteria

- Scout.md is updated and saves to `files/planning/plan-generic/prompts/scout.md`
- New content follows the design spec
- Examples are concrete (external resource + expected findings)
- Existing codebase exploration instructions remain unchanged
- File is readable and scannable (use headers, bullets, short paragraphs)

## Notes

- Do NOT add any implementation guidance—scout only gathers context
- Do NOT mention specific tools like @DeepResearcher—scout is HeadWrench's internal action
- Keep the tone consistent with existing scout.md (direct, action-oriented)

Call `next_step()` when the rewrite is complete.
