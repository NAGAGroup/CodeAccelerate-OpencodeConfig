---
name: context-scout-delegation
description: Teaches how to dispatch @context-scout for wide-shallow project exploration and landscape overviews.
---

# Delegating to @context-scout

This skill teaches how to dispatch @context-scout for wide-shallow project exploration. Load it before writing a dispatch prompt to understand what @context-scout can do and what kind of goals work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "context-scout", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the exploration goal, describe what to understand (what exists, how parts relate, what constraints matter), include instructions to retrieve previous findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, store new findings as they're discovered, and report in prose with an uncertainties section for anything investigated but not fully determined.

## What @context-scout Does

@context-scout is a wide-shallow explorer. It surveys available materials, maps what exists and how parts relate, and reports findings in prose. It reads code and documentation using semantic search and exploration tools. It is effective for broad understanding, initial exploration, and getting a landscape overview. For deep analysis of a specific mechanism, dispatch @context-insurgent instead. Scout works fast and broad; insurgent works slow and deep on narrow questions.

## Rules for Good Dispatch Prompts

State the goal and describe what areas to explore in terms of concepts, not file paths. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @context-scout to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store new findings to the same collection as it discovers them. Ask for prose findings with an uncertainties section. Let @context-scout choose appropriate tools based on the goal rather than prescribing search queries or investigative methods. Specify off-limits areas if there are specific domains the scout should not investigate.

Explicitly request that the scout surface what it could not determine — areas that were investigated but remain ambiguous, questions the scout raised that it could not answer, and anything a deeper investigation should follow up on. This surfacing of unknowns is as valuable as the findings themselves.

## Skill-Loading Instructions for @context-scout

Include explicit skill-loading instructions in your dispatch prompt so @context-scout loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before reasoning through exploration scope:** Include "Load the sequential-thinking skill and use it to reason through what areas to explore and what questions you are trying to answer before starting."
- **Before searching code:** Include "Load the grepai skill for semantic code search and exploration tools."
- **Before storing findings:** Include "Load the qdrant-notes skill for persisting discoveries to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning exploration. This ensures @context-scout reasons through its exploration approach and has access to semantic search and knowledge persistence from the start.

## Examples

**Good:** "Load the grepai skill for semantic code search. Load the qdrant-notes skill for persisting findings. Goal: understand how the system handles user authentication. Explore what exists, how parts relate, and what constraints matter. Before starting, retrieve any previous findings on this topic from Qdrant collection 'rebuild-files-from-spec' using qdrant_qdrant-find. Store new findings to the same collection. Report prose findings — what you found, what remains unclear or ambiguous, and what a deeper investigation should follow up on."

**Bad — missing Qdrant instruction:** "Goal: explore the authentication system." Does not tell scout to retrieve previous findings or where to store new ones. When in a plan session, include the plan name and Qdrant instructions in the dispatch prompt.

**Bad — prescribes investigative methods:** "Read files in src/auth/, then search for validation logic." Let @context-scout choose tools based on the goal rather than prescribing specific file paths.

**Bad — asks for structured output:** "Return a table of all authentication modules with their responsibilities." Asks for structured data. @context-scout provides prose findings instead.

**Bad — asks for deep analysis:** "Trace how token validation works across the codebase and explain each constraint." This is deep analysis work. Use @context-insurgent for that depth instead.

**Bad — vague scope:** "Investigate the project." Does not specify what part, what question, or what you want to understand. Provide a specific area or concept to explore.

**Bad — out of scope for scout:** "Explore the authentication system and make recommendations for improvement." @context-scout explores and reports, not prescribes. Design decisions belong to planning.

## When to Use @context-scout vs Other Scouts

Use @context-scout when you have a broad exploration goal — understand what exists, how parts relate, what constraints matter. Dispatch @context-insurgent for deep technical analysis of specific mechanisms. Use @junior-dev for code changes, not investigation. Architectural design decisions belong in the planning phase, not with @context-scout.

## Exploration Depth vs Breadth

@context-scout is wide-shallow. It maps what exists and relationships quickly across many files but does not trace deep into mechanisms. It produces landscape understanding and identifies areas that need deeper investigation.

@context-insurgent is narrow-deep. It traces specific mechanisms in detail, synthesizes findings into logical chains, and audits constraints. It moves slower but produces deep understanding of specific areas.

Choose your scout based on your need:
- **Need landscape overview of what exists?** Use @context-scout for breadth.
- **Need deep understanding of a specific mechanism?** Use @context-insurgent for depth.
- **Need to make a specific narrow-scope code change?** Use @junior-dev after investigation.

## Qdrant Integration in Exploration

When using @context-scout within a plan session, the dispatch prompt should include Qdrant instructions. @context-scout retrieves prior findings before starting (to avoid re-exploring what is known) and stores new findings as it discovers them (to accumulate knowledge for later use).

This creates a continuous knowledge thread through the session. Each agent can build on what prior agents discovered, avoiding duplication and building coherent understanding across the entire planning process.

## Dispatch Prompt Quality Checklist

Before dispatching @context-scout, verify your prompt includes:
- ✓ Exploration goal (what to understand, what areas to explore)
- ✓ Concepts or domains to explore (not file paths)
- ✓ Context about why this exploration matters
- ✓ Plan name and Qdrant collection name
- ✓ Instructions to retrieve prior findings from the collection
- ✓ Instructions to store new findings to the collection
- ✓ Request for prose findings — what was found, what remains unclear, what to follow up on
- ✓ Any off-limits areas that should not be explored

## Anti-pattern: Confusing Scouts with Investigation Tasks

**Anti-pattern: Using scouts for implementation investigation.** You dispatch @context-scout to explore "how to implement user authentication", expecting implementation guidance. Scouts investigate what exists; they don't prescribe solutions. Use @context-scout to explore existing authentication patterns, then use planning or other mechanisms to decide on changes.

**Anti-pattern: Using scouts for root cause analysis.** You dispatch @context-scout to "investigate why the system is slow". This mixes exploration with diagnosis. Use @context-scout to explore architecture and constraints, then use @context-insurgent or other tools for detailed performance analysis if needed.
