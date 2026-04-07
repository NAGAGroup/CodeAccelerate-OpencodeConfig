---
name: context-scout-delegation
description: Teaches how to dispatch @context-scout for wide-shallow project exploration and landscape overviews.
---

# Delegating to @context-scout

Load this skill before writing a dispatch prompt to understand what @context-scout does and what goals work well for this agent.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "context-scout", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must state the exploration goal, describe what to understand (what exists, how parts relate, what constraints matter), and report in prose with an uncertainties section for anything investigated but not fully determined.

## What @context-scout Does

@context-scout is a wide-shallow explorer. It surveys available materials, maps what exists and how parts relate, and reports findings in prose. It is effective for broad understanding, initial exploration, and landscape overview. Use it when you need a wide survey before narrowing into specific mechanisms.

## Rules for Good Dispatch Prompts

State the goal and describe what areas to explore in terms of concepts, not file paths. Ask for prose findings with an uncertainties section. Let @context-scout choose tools based on the goal rather than prescribing search queries or methods. Explicitly request that the scout surface what it could not determine—areas investigated but remaining ambiguous, questions raised but unanswered, and what deeper investigation should follow up on.
