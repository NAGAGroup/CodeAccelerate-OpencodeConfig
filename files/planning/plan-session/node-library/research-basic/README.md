# research-basic Node Type

**Use this node type to:** Look up code-related external information — API references, library documentation, configuration options, debugging guidance, code examples, and patterns. Answers "how do I use X" questions with practical, immediately applicable answers.

**Do NOT use this node type for:** Conceptual research, algorithm design, architectural comparisons, or academic papers. Use `research-deep` instead when you need to understand design trade-offs or compare multiple competing approaches.

## When to Use

- **API/library reference lookup** — "What are the exact parameters for the boto3 S3 client?" or "How do I configure CORS headers in Express?"
- **Code examples and patterns** — "Show me how to implement retry logic in Python async code" or "What's the pattern for graceful shutdown in Node.js?"
- **Debugging and troubleshooting** — "What does this TypeScript error mean and how do I fix it?" or "How do I enable HTTPS in a local dev environment?"
- **Configuration options** — "What are the available options for Vite's build configuration?" or "How do I set up environment-based logging levels?"

**Contrast with research-deep:**
- `research-basic`: Implementation details, specific how-to answers, code examples with versions. Cursory pass. Step budget: 15.
- `research-deep`: Conceptual understanding, architectural decisions, trade-off analysis, design patterns. Deep investigation. Step budget: higher.

## What the Planning Agent Must Resolve

Before writing this node's prompt, the planning agent must determine and specify:

### 1. Research Topic
**What:** The specific question or lookup target — not a broad subject area.
- ✓ Good: "What is the exact syntax for defining a custom Jest matcher in TypeScript?"
- ✓ Good: "How do I configure PostgreSQL connection pooling in Node.js using node-postgres?"
- ✗ Bad: "Research the authentication system"
- ✗ Bad: "Look up documentation"

### 2. Output Format
**What:** What ExternalScout should return — the structure and specificity level.
- ✓ Good: "Return the function signature, parameter descriptions, and a working code example with at least one practical use case. Include the library version that introduced or last changed this API."
- ✓ Good: "Return a step-by-step troubleshooting guide with the most common cause first. Include the exact error message pattern and the fix."
- ✗ Bad: "Return documentation"
- ✗ Bad: "Find relevant information"

### 3. Scope Boundary
**What:** What to do if the first source is insufficient — which follow-up threads are in scope.
- ✓ Good: "If Context7 has the docs, use them. If those docs lack a code example, use `get_code_context_exa` to find one. Stop after the first code example is found."
- ✓ Good: "Use Context7 for the API reference. If the reference does not cover the configuration option, stop — do not search the web for third-party configuration guides."
- ✗ Bad: "Research until you have a complete answer"
- ✗ Bad: No guidance — ExternalScout invents its own scope

### 4. Downstream Use
**What:** How the answer feeds into the next planning step — what the consuming node expects.
- ✓ Good: "This answer will be passed to a coding node — include exact syntax and working code examples, not explanatory prose."
- ✓ Good: "This answer feeds into a decision gate where the user will choose a configuration option — list the 3–5 most common options with trade-offs."
- ✗ Bad: "Use in the next step"
- ✗ Bad: Omitted

### 5. Answer Format (Cascade)
**Explicit requirement to copy into the dispatch prompt:**
Synthesize a direct answer with code examples — do not return a list of links. Cite specific versions (library version, language version if relevant).

### 6. Scope Guard (Cascade — Verbatim)
**Explicit requirement to copy into the dispatch prompt:**
This is a cursory research pass. Use Context7 first, then `get_code_context_exa` if needed. Do NOT perform multiple search iterations — report what you find and stop.

## Notes

### Failure Mode 1: Overly Broad Topic
**Mechanism:** Planning agent specifies topic as a subject area ("the authentication system", "error handling") instead of a specific question. ExternalScout produces a survey response with no actionable specifics. Downstream node cannot use the answer.

**Prevention:** In the "Research Topic" checklist item, the planning agent must write a question, not a subject. Test: if the topic ends with a question mark, it is usually specific enough. If it is a noun phrase ("API documentation", "configuration options"), it is too broad — push back and ask for the specific question.

### Failure Mode 2: Exhausted Step Budget (Scope Guard Omitted)
**Mechanism:** Planning agent writes the prompt but omits or weakens the scope guard. ExternalScout pursues multiple research threads — "if the first source doesn't have X, search for Y; if Y doesn't cover Z, try Z"—and produces shallow or incomplete findings from unguided exploration.

**Prevention:** The scope guard must be copied into the prompt verbatim (see "Scope Guard" under "What the Planning Agent Must Resolve"). It is non-negotiable. When writing this node's prompt, the planning agent must include the exact constraint: "This is a cursory research pass. Use Context7 first, then `get_code_context_exa` if needed. Do NOT perform multiple search iterations — report what you find and stop."

### Failure Mode 3: Tool Priority Reversed
**Mechanism:** ExternalScout uses `get_code_context_exa` or web search before checking Context7. Context7 has the answer in the first query, but it is never called. The expensive Exa quota is burned on library lookups Context7 covers. Or: ExternalScout cannot find the answer in web search and exhausts budget without trying Context7.

**Prevention:** The dispatch prompt must explicitly state tool priority and show the exact tool call sequence: "Use Context7 first (`context7_resolve-library-id` to identify the library, then `context7_query-docs` with that ID). Use `get_code_context_exa` second. `web_search_exa` only as a last resort."

## When NOT to Use

- Conceptual/algorithmic research → use `research-deep`
- Internal codebase questions → use `analyze-deep` with @ContextInsurgent
- Multi-source trade-off analysis → use `research-deep`
- Anything that requires reading the project's own code → use scout or analyze-deep, not external research
