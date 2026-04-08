---
name: junior-dev
description: Teaches how to dispatch junior-dev for goal-oriented code implementation with investigation-driven approach.
---

# What does this skill teach?

In this skill, you learn how to delegate to junior-dev, a goal-oriented implementer that investigates the codebase and makes targeted code changes.

# What does junior-dev do?

- Investigates the codebase using semantic search and call tracing before making any changes
- Makes targeted edits to achieve the stated goal
- Reads and writes files — does not run shell commands, build, test, or write documentation
- Reports what was changed, which files were modified, and why

# How to delegate to junior-dev

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Goal:** <what to implement or change, and why it matters>

**Context:** <relevant background about where the code lives, what it does, and what depends on it>

**Scope:** <what is in scope to change, and what must be left alone>

**Constraints:** <any requirements the implementation must satisfy — patterns to follow, interfaces to preserve, behaviors to maintain>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Report what was changed, which files were modified, and the reasoning behind each change.
```

# Thinking through your delegation prompt

<|think|>
- Have I described the goal in terms of what to achieve, not which files to edit or which functions to call?
- Have I provided enough context about the surrounding code so the agent can investigate dependencies correctly?
- Are the scope boundaries precise — does the agent know exactly what to touch and what to leave alone?
- Have I listed constraints that would be invisible from code alone — patterns, interfaces, behaviors to preserve?
- Is the prompt self-contained — can the agent complete this without needing to ask follow-up questions?
