# Subtask 2: Design Scout Research Integration Spec

**Agent:** HW (direct)

## Goal

Design the specification for how scout nodes will integrate external research tools. This spec will guide all scout.md rewrites and ensure consistency across planning DAGs.

## What to Do

Based on the audit findings from subtask 1, design and document the scout research integration approach:

1. **Read the audit findings** from the previous subtask
2. **Decide on scope:** Which DAGs will receive research integration? (typically: plan-generic, plan-debug, plan-collaborative, plan-deep-research)
3. **Design the research trigger:** When should scout dispatch external research?
   - Always? (every planning session)
   - Conditionally? (only when task mentions external resources)
   - What keywords/patterns indicate external work? (API, library, framework, SDK, third-party, etc.)
4. **Choose tools:** Which research tools will scout use?
   - `exa_web_search_exa` — General web search
   - `context7_query-docs` — Library/framework documentation lookup
   - `exa_get_code_context_exa` — Code examples from repositories
   - How to sequence these calls efficiently?
5. **Design findings flow:** How will research findings flow to downstream nodes?
   - Captured as context in a summary file?
   - Included in scout output as structured JSON?
   - Passed as a variable to the next node?
6. **Define success:** What does a "successful" research finding look like? (e.g., relevant API docs, code examples, architecture patterns)

## Output

Create a specification file: `.opencode/session-plans/scout-research-integration/scout-research-spec.md`

The spec should include:

### Section 1: Research Trigger
- When will scout dispatch research? (always/conditional)
- What keywords/patterns trigger research?
- Example: "If task mentions 'API', 'library', 'framework', or 'integrate with', dispatch research"

### Section 2: Tool Selection & Sequencing
- Which tools to use for which scenarios
- Example ordering for external API work:
  1. Web search for API docs and patterns
  2. Context7 for official documentation
  3. Code context for implementation examples
- Rate/cost considerations

### Section 3: Research Query Design
- How to formulate good research queries from task description
- Example: If task is "Integrate OAuth", search for "OAuth implementation patterns in [language/framework]"
- Balance: broad enough to get context, specific enough to avoid noise

### Section 4: Findings Format
- How are findings structured for downstream nodes?
- Include: URLs, key patterns, API endpoints, code snippets, architectural decisions
- Example output:
  ```json
  {
    "task": "Integrate OAuth",
    "research_performed": [
      { "tool": "exa_web_search", "query": "...", "results": [...] },
      { "tool": "context7", "query": "...", "results": [...] }
    ],
    "key_findings": ["Finding 1", "Finding 2", ...],
    "recommended_approach": "...",
    "next_steps": "..."
  }
  ```

### Section 5: Decompose Integration
- How does the decompose node use research findings?
- Example: "Findings inform subtask routing—if research shows library X is the standard, prefer using library X in decomposition"

### Section 6: Constraints & Guardrails
- What should scout NOT do? (e.g., "Don't attempt to implement; gather context only")
- Cost/time limits? (e.g., "Maximum 2-3 research queries per scout phase")
- Error handling (what if searches return no results?)

## Success Criteria

- Spec is complete and implementable
- Spec is consistent with HeadWrench's direct-tool-call approach (no agent delegation during planning)
- All five planning DAGs can follow the same spec (or document exceptions if needed)
- Examples are concrete and testable
- Spec is less than 500 lines (stay focused; scout is minimal)

## Next Steps

Call `next_step()` when the specification is written and saved to `.opencode/session-plans/scout-research-integration/scout-research-spec.md`.
