# Delegating to @context-scout

This skill teaches how to dispatch @context-scout for wide-shallow project exploration. Load it before writing a dispatch prompt to understand what @context-scout can do and what kind of goals work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type context-scout:

```
task(
  subagent_type="context-scout",
  description="Survey authentication flow",
  prompt="Goal: understand how the system handles user authentication. Explore what exists, how parts relate, and what constraints matter. Before starting, retrieve any previous findings on this topic from Qdrant collection 'rebuild-files-from-spec' using qdrant_qdrant-find. Store new findings to the same collection as you discover them. Report in prose with an uncertainties section explaining what you investigated but could not fully determine."
)
```

**Parameters:**
- `subagent_type`: always the string "context-scout"
- `description`: 3–5 word label for logging
- `prompt`: your full goal-based dispatch prompt

## What @context-scout Does

@context-scout is a wide-shallow explorer. It surveys available materials, maps what exists and how parts relate, and reports findings in prose. It reads code and documentation using semantic search and exploration tools. It is effective for broad understanding, initial exploration, and getting a landscape overview. For deep analysis of a specific mechanism, dispatch @context-insurgent instead. Scout works fast and broad; insurgent works slow and deep on narrow questions.

## Rules for Good Dispatch Prompts

State the goal and describe what areas to explore in terms of concepts, not file paths. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @context-scout to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store new findings to the same collection as it discovers them. Ask for prose findings with an uncertainties section. Let @context-scout choose appropriate tools based on the goal rather than prescribing search queries or investigative methods. Specify off-limits areas if there are specific domains the scout should not investigate.

## Examples

**Good:** "Goal: understand how the system handles user authentication. Explore what exists, how parts relate, and what constraints matter. Before starting, retrieve any previous findings on this topic from Qdrant collection 'rebuild-files-from-spec' using qdrant_qdrant-find. Store new findings to the same collection. Report prose findings with uncertainties section."

**Bad — missing Qdrant instruction:** "Goal: explore the authentication system." Does not tell scout to retrieve previous findings or where to store new ones. When in a plan session, include the plan name and Qdrant instructions in the dispatch prompt.

**Bad — prescribes investigative methods:** "Read files in src/auth/, then search for validation logic." Let @context-scout choose tools based on the goal rather than prescribing specific file paths.

**Bad — asks for structured output:** "Return a table of all authentication modules with their responsibilities." Asks for structured data. @context-scout provides prose findings instead.

**Bad — asks for deep analysis:** "Trace how token validation works across the codebase and explain each constraint." This is deep analysis work. Use @context-insurgent for that depth instead.

**Bad — vague scope:** "Investigate the project." Does not specify what part, what question, or what you want to understand. Provide a specific area or concept to explore.

**Bad — out of scope for scout:** "Explore the authentication system and make recommendations for improvement." @context-scout explores and reports, not prescribes. Design decisions belong to planning.
