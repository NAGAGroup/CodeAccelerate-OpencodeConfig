---
name: delegating-to-dag-reviewer
description: Teaches how to dispatch dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# What does this skill teach?

In this skill, you learn how to delegate to dag-reviewer, a read-only DAG critique specialist that evaluates execution DAGs for correctness and completeness.

# What does dag-reviewer do?

- Loads the full DAG structure and the component catalogue and design guide before reviewing
- Evaluates against design criteria: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, branching correctness, convergence correctness
- Points to specific node IDs with evidence for every critique
- Produces critiques only — does not propose fixes or redesigns

# How to delegate to dag-reviewer

Use the `task` tool to delegate using the prompt template below, filling in each section for the current goal:

```prompt
**Plan Name:** <the plan name to review>

**User's goal:** <what the plan is supposed to accomplish — the reviewer needs this to assess whether the DAG fits the goal>

**Review dimensions:** <which aspects to focus on — or "all dimensions" for a full review>

**Known concerns:** <any specific issues or doubts you already have about the design, so the reviewer pays close attention>
```

# Thinking through your delegation prompt

<|think|>
- Have I included the plan name so the reviewer can load the DAG?
- Have I stated the user's goal clearly — the reviewer can only assess fit if it knows what the plan is for?
- Are there specific dimensions I'm most concerned about, or do I want a full review?
- Do I have any existing doubts about the design that the reviewer should pay close attention to?
- Am I expecting critiques only — the reviewer will not propose fixes, so I need to be ready to act on the findings myself?
