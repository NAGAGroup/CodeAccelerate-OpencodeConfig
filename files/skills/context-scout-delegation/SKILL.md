---
name: context-scout-delegation
description: Teaches how to dispatch @context-scout for wide-shallow project exploration and landscape overviews.
---

# Delegating to @context-scout

Dispatch @context-scout for broad understanding, initial exploration, and landscape overview.

## How to Dispatch

Call task tool with: `subagent_type="context-scout"`, description (3-5 words), goal-based prompt stating exploration goal and what to understand.

## What @context-scout Does

- Wide-shallow explorer for project surveys
- Maps what exists and how parts relate
- Effective for broad understanding and initial exploration

## Required in Every Dispatch Prompt

Every dispatch prompt MUST explicitly instruct the scout to return an unknowns section: what was investigated but could not be determined, what remains ambiguous, and what follow-up investigation is still needed. A response without this section is incomplete.

## Rules
- State goal and describe areas to explore in terms of concepts, not file paths
- Ask for prose findings, not file lists or bullet inventories
- Let agent choose tools based on goal
