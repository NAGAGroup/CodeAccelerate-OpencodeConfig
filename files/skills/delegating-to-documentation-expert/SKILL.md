---
name: delegating-to-documentation-expert
description: Teaches how to dispatch documentation-expert for writing and editing documentation files.
---

# What does this skill teach?

In this skill, you learn how to delegate to documentation-expert, a goal-oriented documentation agent that investigates existing conventions and produces or updates documentation.

# What does documentation-expert do?

- Investigates existing documentation, project conventions, and code as reference before writing
- Produces or updates documentation files — Markdown, configuration, prompt files, and similar
- Reads code to understand what to document — does not edit code
- Reports what was written or changed and how ambiguities were resolved

# How to delegate to documentation-expert

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Goal:** <what the documentation should accomplish — audience, purpose, and what it needs to convey>

**Scope:** <what files or areas to document, and what to leave alone>

**Style reference:** <existing files or conventions to match for tone, structure, and formatting>

**Constraints:** <anything the documentation must or must not include>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Report what was written or changed, which files were modified, and how any ambiguities were resolved.
```

# Thinking through your delegation prompt

<|think|>
- Have I described what the documentation should accomplish for its reader, not just what files to create?
- Have I pointed to existing files the agent can use as style and structure references?
- Are the scope boundaries clear — what areas to cover and what to leave alone?
- Are there constraints that aren't obvious from the codebase — audience assumptions, tone requirements, things to omit?
- Is the prompt self-contained — can the agent produce the right output without needing clarification?
