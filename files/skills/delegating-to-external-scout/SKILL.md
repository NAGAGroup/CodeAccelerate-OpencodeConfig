---
name: delegating-to-external-scout
description: Teaches how to dispatch external-scout for external research on public information and documentation.
---

# What does this skill teach?

In this skill, you learn how to delegate to external-scout, a research specialist that searches public sources and returns findings tagged with confidence levels.

# What does external-scout do?

- Searches public sources: documentation, community resources, published guides, official references
- Reads actual source material — does not rely on search result snippets
- Tags every finding as verified (read from source), inferred (logical conclusion), or uncertain (conflicting or insufficient evidence)
- Includes an explicit unknowns section covering what could not be confirmed
- Has no access to internal project files — use only for questions answerable from public information

# How to delegate to external-scout

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Research goal:** <what to find out — use general, public terms with no internal identifiers or proprietary details>

**Background:** <what is already known so the scout focuses on new information>

**Specific questions:** <the questions the research should answer>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Tag every finding as verified, inferred, or uncertain. Include an explicit unknowns section covering what was searched for but could not be confirmed, contradictions between sources, and gaps in available information.
```

# Thinking through your delegation prompt

<|think|>
- Have I used general, public terms — no internal names, proprietary identifiers, or confidential context?
- Have I stated what is already known so the scout doesn't duplicate existing understanding?
- Are my specific questions answerable from public sources, or do they require access to internal code?
- Have I asked for confidence tagging and an unknowns section so the reliability of each finding is clear?
- Is the research goal scoped narrowly enough to produce focused findings rather than a broad survey?
