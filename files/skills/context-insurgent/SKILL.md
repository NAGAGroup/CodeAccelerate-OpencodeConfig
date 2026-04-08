---
name: context-insurgent
description: Teaches how to dispatch context-insurgent for deep, narrow analysis of specific code mechanisms and logic flows.
---

# What does this skill teach?

In this skill, you learn how to delegate to context-insurgent, a narrow-deep analyst that traces logic chains across files and returns evidence-grounded findings.

# What does context-insurgent do?

- Traces specific mechanisms, data flows, and dependencies across files using search, trace, and read tools
- Synthesizes findings with file paths and line numbers as evidence for every claim
- Returns a precise analytical report — not a broad survey
- Includes an explicit unknowns section covering what could not be verified
- Makes no changes — read-only

# How to delegate to context-insurgent

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Goal:** <the specific mechanism, behavior, or relationship to investigate>

**Questions to answer:** <the specific questions the analysis should resolve>

**Why this matters:** <what decision or understanding depends on these findings>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Return a precise analytical report with file paths and line numbers as evidence for every claim. Include an explicit unknowns section covering what was examined but could not be fully verified, what assumptions were made, and what would require deeper investigation to confirm.
```

# Thinking through your delegation prompt

<|think|>
- Is my goal narrow and specific enough — context-insurgent traces one thing deeply, not many things broadly?
- Have I described what to understand rather than which files to read or which tools to use?
- What are the specific questions I need answered — have I listed them clearly?
- Have I asked for an unknowns section so unverifiable assumptions surface explicitly?
- Does the agent know why this matters so it can prioritize what to trace?
