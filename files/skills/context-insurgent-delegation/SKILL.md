---
name: context-insurgent-delegation
description: Teaches how to dispatch @context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---

# Delegating to @context-insurgent

This skill teaches how to dispatch @context-insurgent for narrow-deep analysis of specific code mechanisms. Load it before writing a dispatch prompt to understand what @context-insurgent can do and what kind of questions work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "context-insurgent", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the analysis goal, describe what mechanism to trace or understand, include instructions to retrieve previous findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, store new findings as they're discovered, and report prose findings with specific code evidence and explanations of what was examined but could not be fully verified.

## What @context-insurgent Does

@context-insurgent is a narrow-deep analyst. It traces cross-file logic, synthesizes findings across many sources, audits constraints, and builds detailed analytical reports. It reads code using semantic search and tracing tools to understand mechanisms in depth. It is effective for understanding why a system behaves a certain way, how data flows through multiple components, and what constraints or dependencies exist. For broad overviews of an area, dispatch @context-scout instead. Insurgent is ideal for focused, deep investigation of specific mechanisms.

## Rules for Good Dispatch Prompts

Name the specific area or question to investigate with precision. Describe what you need to understand — relationships, logic flow, root causes, constraints that matter. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @context-insurgent to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store new findings to the same collection as it discovers them. Ask for prose findings with specific supporting evidence and an uncertainties section. Let @context-insurgent choose which files to read and which tools to use based on the investigation goal rather than prescribing specific methods. Provide enough context that @context-insurgent understands why this question matters and what decisions depend on the answer.

Explicitly require the insurgent to report what it examined but could not fully verify — partial traces, ambiguous constraints, code paths that were not fully resolvable. These surfaced unknowns are critical input for the planner. An insurgent that only reports what it confirmed is hiding the most important information.

## Skill-Loading Instructions for @context-insurgent

Include explicit skill-loading instructions in your dispatch prompt so @context-insurgent loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before searching code:** Include "Load the grepai skill for semantic code search and deep tracing tools."
- **Before storing findings:** Include "Load the qdrant-notes skill for persisting discoveries to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning deep analysis. This ensures @context-insurgent has access to semantic search and knowledge persistence from the start.

## Examples

**Good:** "Load the grepai skill for semantic code search and tracing. Load the qdrant-notes skill for persisting findings. Goal: understand how token validation works. Trace the flow from request entry through validation and identify all constraints. Before starting, retrieve previous findings on token validation from Qdrant collection 'rebuild-files-from-spec' using qdrant_qdrant-find. Store new findings to the same collection. Report prose findings with specific code evidence — what you confirmed, what you traced partially, and what you examined but could not fully verify."

**Bad — missing Qdrant instruction:** "Goal: investigate token validation." Does not tell insurgent to retrieve or store findings. When in a plan session, include the plan name and Qdrant instructions in the dispatch prompt.

**Bad — too broad for insurgent:** "Explore the entire authentication system." Use @context-scout for broad surveys. @context-insurgent works on specific, narrow questions requiring deep analysis.

**Bad — asks for structured output:** "Return a table of all validation functions and what they check." Asks for data structure. @context-insurgent provides prose analysis with code evidence instead.

**Bad — missing context about what changed:** "Goal: investigate error handling." Needs context about what changed in prior steps or what the dispatcher has already learned so insurgent can build on it.

**Bad — out-of-scope request:** "Trace the token validation logic and then fix the bugs you find." @context-insurgent investigates only. For code changes, use @junior-dev.

**Bad — vague scope:** "Understand the system." Too broad and imprecise. @context-insurgent needs a specific mechanism or area to investigate with focus.

## When to Use @context-insurgent vs Other Scouts

Use @context-insurgent when you have a specific question that requires deep technical analysis — how a system works internally, what constraints exist, where data flows, or how components interact. Dispatch @context-scout for broad exploration and initial overviews. Use @junior-dev for code changes, not investigation. Architectural design decisions belong in the planning phase, not with @context-insurgent.

## Investigation Depth vs Breadth

@context-insurgent excels at depth. It traces single mechanisms across many files, synthesizes findings into coherent logical chains, and audits constraints in detail. It moves slowly through careful analysis but produces deep understanding.

@context-scout excels at breadth. It surveys available materials quickly, maps relationships, and reports landscape-level understanding. It moves fast across many files but does not go deep into mechanisms.

Choose your scout based on your need:
- **Need to understand how something works internally?** Use @context-insurgent for depth.
- **Need a landscape overview of what exists?** Use @context-scout for breadth.
- **Need to make a specific narrow-scope code change?** Use @junior-dev after investigation.

## Qdrant Integration in Investigation

When using @context-insurgent within a plan session, the dispatch prompt should include Qdrant instructions. @context-insurgent retrieves prior findings before starting (to avoid re-discovering what is known) and stores new findings as it discovers them (to accumulate knowledge for later use).

This creates a continuous knowledge thread through the session. Each agent can build on what prior agents discovered, avoiding duplication and building coherent understanding across the entire planning process.

## Dispatch Prompt Quality Checklist

Before dispatching @context-insurgent, verify your prompt includes:
- ✓ Specific analysis goal (not vague exploration)
- ✓ Mechanism or area to trace (data flow, constraint, logic, relationship)
- ✓ Context about why this analysis matters
- ✓ Plan name and Qdrant collection name
- ✓ Instructions to retrieve prior findings from the collection
- ✓ Instructions to store new findings to the collection
- ✓ Request for prose findings with code evidence — what was confirmed, what was partially traced, what could not be fully verified
