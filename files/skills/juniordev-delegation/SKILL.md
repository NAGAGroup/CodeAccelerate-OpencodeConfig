---
name: juniordev-delegation
description: Teaches how to dispatch @junior-dev for goal-oriented code implementation with investigation-driven approach.
---

# Delegating to @junior-dev

Dispatch @junior-dev for goal-oriented code implementation using the task tool.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "junior-dev", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the goal clearly, explain why it matters, provide context about where the code lives, describe scope boundaries (what to change and what to leave alone), and list constraints.

## What @junior-dev Does

@junior-dev is a goal-oriented implementer. It investigates code using semantic search and tracing to understand context, then makes targeted changes to achieve the stated goal. It reads and edits files. It does not run shell commands, execute builds, or write documentation files.

## Rules for Good Dispatch Prompts

- State the goal clearly and why it matters
- Provide relevant context and rationale about where the code lives
- Describe scope boundaries precisely — what to change and what to leave alone
- State constraints clearly
- Let @junior-dev investigate and decide how to implement rather than prescribing exact line numbers
- Investigation gives @junior-dev its reliability; more context produces better decisions
