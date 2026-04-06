---
name: juniordev-delegation
description: Teaches how to dispatch @junior-dev for goal-oriented code implementation with investigation-driven approach.
---

# Delegating to @junior-dev

This skill teaches how to dispatch @junior-dev for goal-oriented implementation. Load it before writing a dispatch prompt to understand what @junior-dev can do and how to frame the goal.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "junior-dev", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should state the goal clearly, explain why it matters, provide relevant context about where the code lives, describe scope boundaries (what to change and what to leave alone), list constraints, include instructions to retrieve accumulated session knowledge from the appropriate Qdrant collection using qdrant_qdrant-find before starting, and store findings and changes when done.

## What @junior-dev Does

@junior-dev is a goal-oriented implementer. It investigates code using semantic search and tracing tools to understand context, then makes targeted changes to achieve the stated goal. It reads and edits files to accomplish objectives. @junior-dev executes implementation goals effectively and reliably. It handles shell operations through @tailwrench, not directly. For testing and verification, dispatch @tailwrench separately. For documentation files, dispatch @documentation-expert. @junior-dev focuses on code implementation, not testing or shell operations.

## Rules for Good Dispatch Prompts

State the goal clearly — what needs to be achieved and why it matters. Provide relevant context and rationale so @junior-dev understands the change's purpose. Describe scope boundaries precisely — what to change and what to leave alone. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @junior-dev to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store findings and changes to the same collection when done. Point to reference files or existing patterns @junior-dev should study. State constraints — what should not be changed. Let @junior-dev investigate and decide how to implement rather than prescribing exact line numbers or diff hunks. Investigation gives junior-dev its reliability. The more context you provide about why the change matters, the better decisions junior-dev makes.

## Examples

**Good:** "Goal: add verbose error logging to debug configuration. This helps troubleshoot connection issues. Context: logging framework in src/config/logging.ts. Scope: debug config only, do not touch production. Constraints: do not change test files. Before starting, retrieve knowledge from Qdrant collection 'project-implementation' using qdrant_qdrant-find. Investigate and make the change. Store findings to Qdrant when done."

**Bad — too vague:** "Refactor the authentication module." Needs specific aspect to change and why it matters.

**Bad — prescribes implementation:** "In file X at line Y, change Z to W, then add three lines of new code below." Let @junior-dev investigate and decide how to implement the goal.

**Bad — includes shell operations:** "Add the feature and run the test suite." Dispatch @junior-dev for the code change, then @tailwrench separately for testing.

**Bad — asks for architectural decisions:** "Make this system more performant." @junior-dev implements stated goals, not broad design decisions.

**Bad — missing Qdrant instruction:** "Add support for custom authentication providers. Store in /src/auth/providers.ts." Does not include instruction to retrieve and store findings with Qdrant. When in a plan session, include the plan name and Qdrant instructions in the dispatch prompt.

**Bad — out-of-scope for implementation:** "Investigate the database schema and decide whether to refactor it." Investigation goes to scouts. Implementation of a decided-upon change goes to junior-dev.
