---
name: context-insurgent-delegation
description: Teaches how to dispatch @context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---

# Delegating to @context-insurgent

This skill teaches how to dispatch @context-insurgent for narrow-deep analysis of specific code mechanisms. Load it before writing a dispatch prompt to understand what @context-insurgent can do and what kind of questions work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type context-insurgent:

```
task(
  subagent_type="context-insurgent",
  description="Trace token validation logic",
  prompt="Goal: understand how token validation works across the codebase. Trace the flow from request entry through validation and identify all constraints. Before starting, retrieve any previous findings on token validation from Qdrant collection 'rebuild-files-from-spec' using qdrant_qdrant-find. Store new findings to the same collection as you discover them. Report prose findings with specific code evidence and explain what you examined but could not fully verify."
)
```

**Parameters:**
- `subagent_type`: always the string "context-insurgent"
- `description`: 3–5 word label for logging
- `prompt`: your full goal-based dispatch prompt

## What @context-insurgent Does

@context-insurgent is a narrow-deep analyst. It traces cross-file logic, synthesizes findings across many sources, audits constraints, and builds detailed analytical reports. It reads code using semantic search and tracing tools to understand mechanisms in depth. It is effective for understanding why a system behaves a certain way, how data flows through multiple components, and what constraints or dependencies exist. For broad overviews of an area, dispatch @context-scout instead. Insurgent is ideal for focused, deep investigation of specific mechanisms.

## Rules for Good Dispatch Prompts

Name the specific area or question to investigate with precision. Describe what you need to understand — relationships, logic flow, root causes, constraints that matter. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @context-insurgent to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store new findings to the same collection as it discovers them. Ask for prose findings with specific supporting evidence and an uncertainties section. Let @context-insurgent choose which files to read and which tools to use based on the investigation goal rather than prescribing specific methods. Provide enough context that @context-insurgent understands why this question matters and what decisions depend on the answer.

## Examples

**Good:** "Goal: understand how token validation works. Trace the flow from request entry through validation and identify all constraints. Before starting, retrieve previous findings on token validation from Qdrant collection 'rebuild-files-from-spec' using qdrant_qdrant-find. Store new findings to the same collection. Report prose findings with code evidence and uncertainties section."

**Bad — missing Qdrant instruction:** "Goal: investigate token validation." Does not tell insurgent to retrieve or store findings. When in a plan session, include the plan name and Qdrant instructions in the dispatch prompt.

**Bad — too broad for insurgent:** "Explore the entire authentication system." Use @context-scout for broad surveys. @context-insurgent works on specific, narrow questions requiring deep analysis.

**Bad — asks for structured output:** "Return a table of all validation functions and what they check." Asks for data structure. @context-insurgent provides prose analysis with code evidence instead.

**Bad — missing context about what changed:** "Goal: investigate error handling." Needs context about what changed in prior steps or what the dispatcher has already learned so insurgent can build on it.

**Bad — out-of-scope request:** "Trace the token validation logic and then fix the bugs you find." @context-insurgent investigates only. For code changes, use @junior-dev.

**Bad — vague scope:** "Understand the system." Too broad and imprecise. @context-insurgent needs a specific mechanism or area to investigate with focus.

## When to Use @context-insurgent vs Other Scouts

Use @context-insurgent when you have a specific question that requires deep technical analysis — how a system works internally, what constraints exist, where data flows, or how components interact. Dispatch @context-scout for broad exploration and initial overviews. Use @junior-dev for code changes, not investigation. Architectural design decisions belong in the planning phase, not with @context-insurgent.
