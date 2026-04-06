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

## Skill-Loading Instructions for @junior-dev

Include explicit skill-loading instructions in your dispatch prompt so @junior-dev loads necessary skills before starting work. Add these instructions near the top of the dispatch prompt:

- **Before reasoning through approach:** Include "Load the sequential-thinking skill and use it to reason through your implementation approach before starting."
- **Before searching code:** Include "Load the grepai skill for semantic code search and dependency tracing."
- **Before making file edits:** Include "Load the file-operations skill for reading and editing files."
- **Before storing findings:** Include "Load the qdrant-notes skill for persisting discoveries and changes to the plan session collection."

Skill-loading instructions should appear early in the dispatch prompt so the subagent loads skills before beginning investigation and implementation work. This ensures @junior-dev reasons through its approach before acting and has access to semantic search, file operations, and knowledge persistence from the start.

## Examples

**Good:** "Load the grepai skill for semantic search. Load the file-operations skill for reading and editing files. Load the qdrant-notes skill for persisting findings. Goal: add verbose error logging to debug configuration. This helps troubleshoot connection issues. Context: logging framework in src/config/logging.ts. Scope: debug config only, do not touch production. Constraints: do not change test files. Before starting, retrieve knowledge from Qdrant collection 'project-implementation' using qdrant_qdrant-find. Investigate and make the change. Store findings to Qdrant when done."

**Bad — too vague:** "Refactor the authentication module." Needs specific aspect to change and why it matters.

**Bad — prescribes implementation:** "In file X at line Y, change Z to W, then add three lines of new code below." Let @junior-dev investigate and decide how to implement the goal.

**Bad — includes shell operations:** "Add the feature and run the test suite." Dispatch @junior-dev for the code change, then @tailwrench separately for testing.

**Bad — asks for architectural decisions:** "Make this system more performant." @junior-dev implements stated goals, not broad design decisions.

**Bad — missing Qdrant instruction:** "Add support for custom authentication providers. Store in /src/auth/providers.ts." Does not include instruction to retrieve and store findings with Qdrant. When in a plan session, include the plan name and Qdrant instructions in the dispatch prompt.

**Bad — out-of-scope for implementation:** "Investigate the database schema and decide whether to refactor it." Investigation goes to scouts. Implementation of a decided-upon change goes to junior-dev.

## When to Use @junior-dev

Dispatch @junior-dev for goal-oriented code implementation after you understand what needs to change. Use it for adding features, fixing bugs, refactoring code, and making targeted edits. @junior-dev is especially effective when you have clear requirements and scope boundaries.

Use scouts (@context-scout, @context-insurgent) for investigation. Use @junior-dev only for implementation of understood changes.

## Investigation-Driven Implementation

@junior-dev's strength is investigation-driven implementation. Instead of prescribing exact line numbers to edit, you give @junior-dev:

- **The goal:** What needs to be accomplished
- **The context:** Where relevant code lives and why the change matters
- **The scope:** What to change and what to leave alone
- **The constraints:** Requirements that must be satisfied

@junior-dev then investigates the codebase using semantic search and tracing to understand the current implementation, identifies the best places to make changes, and executes changes carefully.

This investigation phase gives @junior-dev reliability. It understands the code deeply enough to make informed decisions about where and how to make changes safely.

## Qdrant Integration for Implementation

When using @junior-dev within a plan session, the dispatch prompt should include Qdrant instructions. @junior-dev retrieves prior findings and context (to inform what changes need to be made) and stores findings and changes to the collection (so other agents can understand what was changed and why).

This creates continuity in the planning process. Each agent can build on what prior agents discovered and changed.

## Dispatch Prompt Quality Checklist

Before dispatching @junior-dev, verify your prompt includes:
- ✓ Clear goal (what needs to be accomplished)
- ✓ Rationale (why it matters, context for the change)
- ✓ Scope boundaries (what to change, what to leave alone)
- ✓ Constraints (requirements that must be satisfied)
- ✓ Reference files or patterns to study
- ✓ Plan name and Qdrant collection name
- ✓ Instructions to retrieve prior findings from the collection
- ✓ Instructions to store findings and changes when done

## Common Implementation Mistakes

**Anti-pattern: Prescribing implementation details.** "At line 42, change X to Y. Then add these 3 lines below." Let @junior-dev investigate and decide how to implement the goal. Investigation-driven changes are more reliable.

**Anti-pattern: Vague goals.** "Improve the code" or "fix bugs". @junior-dev needs specific, measurable targets. What specifically needs to change?

**Anti-pattern: Missing scope boundaries.** "Refactor the authentication system." How much of the system? What is in scope? What is explicitly out of scope?

**Anti-pattern: Mixing implementation with verification.** "Add the feature and run the tests to verify it works." Dispatch @junior-dev for the implementation, then @tailwrench separately for verification.
