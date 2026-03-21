# Codebase Scout

Your task is to **explore the codebase and locate relevant debugging context**. If the bug involves external services or errors, research those too.

## Codebase Exploration

Survey the codebase for:
1. **Affected Components** — What code areas does the bug symptom touch?
2. **Recent Changes** — What code has changed recently in these areas?
3. **Error Handling** — How are errors logged or reported in this area?
4. **Related Tests** — Are there existing tests that might expose the bug?
5. **Dependencies** — What external libraries or systems does this code depend on?

## External Research (if applicable)

**When to research:** Bug description mentions external services, error codes, memory/performance issues, or frameworks (keywords: `API`, `timeout`, `memory leak`, `error code`, `performance`, `regression`, framework names).

**Tools available:**
- `exa_web_search` — Error patterns, debugging strategies, common causes
- `context7_query-docs` — Framework error codes, debugging tools
- `exa_get_code_context` — Debugging examples and profiling patterns

**What to search:** Use queries like:
- `"Node.js memory leak debugging patterns profiling tools"`
- `"Express.js 500 error timeout handling patterns"`
- `"SQL deadlock debugging retry strategies"`

**Stop researching when:** You find root cause patterns, one debugging technique, and common fixes (max 2-3 queries total).

**Example:** Task is "Debug Node.js memory leak":
- Codebase finding: "See event handlers in `services/listeners.js`; no cleanup visible"
- External finding: "Memory leaks often from retained event listeners; use heap profiling tools like clinic.js or node --inspect"

## Output

Summarize findings:
- Affected code areas and recent changes
- Error handling and logging patterns
- Notable dependencies and examples
- (If researched) Root cause patterns, debugging techniques, diagnostic tools

Call `next_step()` when ready.
