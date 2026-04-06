---
name: juniordev-delegation
description: Teaches how to dispatch @junior-dev for goal-oriented code implementation with investigation-driven approach.
---

# Delegating to @junior-dev

Dispatch @junior-dev for goal-oriented code implementation using the task tool.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "junior-dev", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the goal clearly, explain why it matters, provide context about where the code lives, describe scope boundaries (what to change and what to leave alone), list constraints, and include instructions to retrieve and store findings from the Qdrant collection (when in a plan session).

## What @junior-dev Does

@junior-dev is a goal-oriented implementer. It investigates code using semantic search and tracing to understand context, then makes targeted changes to achieve the stated goal. It reads and edits files. @junior-dev handles implementation goals effectively. It uses @tailwrench for shell operations, not directly. For testing and verification, dispatch @tailwrench separately. For documentation files, dispatch @documentation-expert.

## Rules for Good Dispatch Prompts

- State the goal clearly and why it matters
- Provide relevant context and rationale about where the code lives
- Describe scope boundaries precisely — what to change and what to leave alone
- State constraints clearly
- When in a plan session: include plan name, instruct retrieval from Qdrant collection before starting, store findings when done
- Let @junior-dev investigate and decide how to implement rather than prescribing exact line numbers
- Investigation gives @junior-dev its reliability; more context produces better decisions

## Skill-Loading Instructions for @junior-dev

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before investigating code:** "Load the grepai skill for semantic code search and call graph tracing to understand the codebase before making changes."
- **Before storing findings:** "Load the qdrant-notes skill for retrieving prior context and storing implementation findings to the plan session collection."
- **Before reasoning through implementation approach:** "Load the sequential-thinking skill for step-by-step reasoning through the implementation strategy."
