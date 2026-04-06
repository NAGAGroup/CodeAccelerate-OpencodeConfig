---
name: context-insurgent-delegation
description: Teaches how to dispatch @context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---

# Delegating to @context-insurgent

Load this skill before writing a dispatch prompt to understand what @context-insurgent does and what questions work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "context-insurgent", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must state the analysis goal, describe what mechanism to trace, include instructions to retrieve previous findings from Qdrant using qdrant_qdrant-find before starting, store new findings as discovered, and report prose findings with specific code evidence and explanations of what was examined but could not be fully verified.

## What @context-insurgent Does

@context-insurgent is a narrow-deep analyst. It traces cross-file logic, synthesizes findings across sources, audits constraints, and builds detailed analytical reports. It is effective for understanding why systems behave certain ways, how data flows through multiple components, and what constraints or dependencies exist. For broad overviews, dispatch @context-scout instead. Insurgent is ideal for focused, deep investigation of specific mechanisms.

## Rules for Good Dispatch Prompts

Name the specific area or question to investigate with precision. Describe what you need to understand—relationships, logic flow, root causes, constraints. When working within a plan session, include the plan name (Qdrant collection name) and instruct @context-insurgent to use qdrant_qdrant-find to retrieve prior findings before starting and store new findings as discovered. Ask for prose findings with supporting evidence and an uncertainties section. Let @context-insurgent choose which files to read and tools to use based on the investigation goal. Provide enough context that @context-insurgent understands why this question matters and what decisions depend on the answer. Explicitly require reporting what was examined but could not be fully verified—partial traces, ambiguous constraints, code paths not fully resolvable. These surfaced unknowns are critical input for planning.

## Skill-Loading Instructions for @context-insurgent

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before reasoning through investigation scope:** "Load the sequential-thinking skill and use it to reason through the investigation approach and what specific questions to trace before starting."
- **Before searching code:** "Load the grepai skill for semantic code search and deep tracing tools."
- **Before storing findings:** "Load the qdrant-notes skill for persisting discoveries to the plan session collection."
