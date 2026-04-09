---
name: deep-researcher
description: Teaches how to dispatch deep-researcher for comprehensive investigation of novel or frontier topics.
---

# What does this skill teach?

In this skill, you learn how to delegate to deep-researcher, a research specialist that conducts comprehensive, multi-source investigation on novel algorithms, cutting-edge approaches, and frontier techniques.

# When to use deep-researcher vs external-scout

- **external-scout**: Routine research — evaluating established options, scoping implementation details, comparing common tools, checking API documentation, verifying library behavior. Most research tasks are this.
- **deep-researcher**: Novel or frontier research — cutting-edge algorithms, advanced techniques, niche implementation patterns, emerging standards. The task requires investigating multiple angles, synthesizing across sources, and building understanding of something that isn't well-documented in a single place. This is rarely needed.

If there is any ambiguity about whether a task needs deep research, it almost certainly doesn't — use external-scout.

# What does deep-researcher do?

- Decomposes research into multiple angles and sub-questions
- Searches public sources and reads actual source material in depth
- Cross-references findings between sources and follows reference chains
- Synthesizes findings into a coherent picture with agreements, disagreements, and gaps
- Tags every finding as verified (read from source), inferred (logical conclusion), or uncertain (conflicting or insufficient evidence)
- Has no access to internal project files — use only for questions answerable from public information

# How to delegate to deep-researcher

Use the `task` tool to delegate using the prompt template below:

```prompt
**Research domain:** <the area to investigate — use general, public terms with no internal identifiers or proprietary details>

**Background:** <what is already known so the researcher focuses on new ground>

**Angles to investigate:**
- <angle 1>
- <angle 2>
- <angle 3>

**Key questions:**
- <question 1>
- <question 2>

**Plan Name:** <plan name to store findings under, or N/A if not working within a plan session>

Tag every finding as verified, inferred, or uncertain. Cross-reference findings between sources. Include an explicit unknowns section covering contradictions, gaps, and what could not be confirmed.
```

# Thinking through your delegation prompt

<|think|>
- Have I used general, public terms — no internal names, proprietary identifiers, or confidential context?
- Have I identified multiple angles that together give a comprehensive picture?
- Is this genuinely novel or frontier research, or could external-scout handle it with a single targeted query?
- Have I stated what is already known so the researcher doesn't duplicate existing understanding?
- Are my questions answerable from public sources?
