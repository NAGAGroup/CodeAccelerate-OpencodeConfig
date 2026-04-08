---
name: delegating-to-context-scout
description: Teaches how to dispatch context-scout for wide-shallow project exploration and landscape overviews.
---

# What does this skill teach?

In this skill, you learn how to delegate to context-scout, a read-only explorer that surveys a project broadly and returns findings as clear prose.

# What does context-scout do?

- Searches the codebase using semantic queries to map what exists and how parts relate
- Covers multiple aspects in a single pass: structure, components, relationships, conventions, documentation
- Returns prose findings — not file lists or bullet inventories
- Includes an explicit unknowns section covering what could not be determined
- Makes no changes — read-only

# How to delegate to context-scout

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Goal:** <what to understand about the project — describe in terms of concepts and questions, not file paths>

**Areas to survey:** <the aspects or questions you need answered>

**Why this matters:** <what decision or next step depends on these findings>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Return findings as prose. Include an explicit unknowns section covering what was investigated but could not be determined, what remains ambiguous, and what follow-up investigation would be needed to resolve it.
```

# Thinking through your delegation prompt

<|think|>
- What do I actually need to understand — am I after structure, relationships, conventions, or something else?
- Am I describing concepts and questions, or am I accidentally prescribing file paths and tools?
- What decision does this finding inform — does the scout need to know that to focus correctly?
- Have I asked for an unknowns section so gaps surface rather than get silently skipped?
- Is the prompt self-contained — does the scout have everything it needs without asking follow-up questions?
