---
name: context-scout-delegation
description: Teaches how to dispatch @context-scout for wide-shallow project exploration and landscape overviews.
---

# Delegating to @context-scout

Load this skill before writing a dispatch prompt to understand what @context-scout does and what goals work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "context-scout", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must state the exploration goal, describe what to understand (what exists, how parts relate, what constraints matter), include instructions to retrieve previous findings from Qdrant using qdrant_qdrant-find before starting, store new findings as discovered, and report in prose with an uncertainties section for anything investigated but not fully determined.

## What @context-scout Does

@context-scout is a wide-shallow explorer. It surveys available materials, maps what exists and how parts relate, and reports findings in prose. It is effective for broad understanding, initial exploration, and landscape overview. For deep analysis of a specific mechanism, dispatch @context-insurgent instead. Scout works fast and broad; insurgent works slow and deep on narrow questions.

## Rules for Good Dispatch Prompts

State the goal and describe what areas to explore in terms of concepts, not file paths. When working within a plan session, include the plan name (Qdrant collection name) and instruct @context-scout to use qdrant_qdrant-find to retrieve prior findings before starting and store new findings as discovered. Ask for prose findings with an uncertainties section. Let @context-scout choose tools based on the goal rather than prescribing search queries or methods. Explicitly request that the scout surface what it could not determine—areas investigated but remaining ambiguous, questions raised but unanswered, and what deeper investigation should follow up on.

## Skill-Loading Instructions for @context-scout

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before reasoning through exploration scope:** "Load the sequential-thinking skill and use it to reason through what areas to explore and what questions you are trying to answer before starting."
- **Before searching code:** "Load the grepai skill for semantic code search and exploration tools."
- **Before storing findings:** "Load the qdrant-notes skill for persisting discoveries to the plan session collection."
