---
name: dag-reviewer
description: Teaches how to dispatch dag-reviewer to evaluate execution DAGs through structural validation and deep analysis of specialist node needs.
---

# What does this skill teach?

In this skill, you learn how to delegate to dag-reviewer, a DAG critique specialist that evaluates first-pass execution DAGs. The reviewer performs quick structural validation then spends the bulk of its analysis on the hard questions: does the plan need specialist nodes, more sophisticated routing, adjusted retry depths, or user interaction points?

# What does dag-reviewer do?

- Loads the full DAG structure and the full component catalogue before reviewing
- Performs a quick structural validation pass (anti-pattern checks)
- Performs deep analysis: external research needs, complexity-adaptive routing, cascading decisions, retry count assessment, user interaction opportunities
- Uses the orchestrator's tentative answers as starting points for its analysis
- Points to specific node IDs with evidence for every finding
- Produces critiques and recommendations only — does not propose specific restructurings

# How to delegate to dag-reviewer

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Plan Name:** <the plan name to review>

**User's goal:** <what the plan is supposed to accomplish — the reviewer needs this to assess whether the DAG fits the goal>

**Review dimensions:** <which aspects to focus on — or "all dimensions" for a full review>

**Known concerns:** <any specific issues or doubts you already have about the design, so the reviewer pays close attention>

**Orchestrator's tentative assessment:**
<include your tentative answers to the hard questions — the reviewer will use these as starting points>
- External research needs: <your assessment>
- Task complexity and retry counts: <your assessment>
- User interaction points: <your assessment>
- Routing sophistication: <your assessment>
- Confidence in planning-phase research sufficiency: <your assessment>
```

# Thinking through your delegation prompt

<|think|>
- Have I included the plan name so the reviewer can load the DAG?
- Have I stated the user's goal clearly — the reviewer can only assess fit if it knows what the plan is for?
- Have I included my tentative assessment answers — the reviewer uses these as starting points for deep analysis?
- Are there specific dimensions I'm most concerned about, or do I want a full review?
- Do I have any existing doubts about the design that the reviewer should pay close attention to?
- Am I expecting critiques and recommendations only — the reviewer will not propose specific restructurings?
