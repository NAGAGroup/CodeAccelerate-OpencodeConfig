---
name: dag-reviewer
description: Teaches how to dispatch dag-reviewer to evaluate execution DAGs through structural validation and deep analysis of specialist node needs.
---
<overview>
dag-reviewer evaluates first-pass execution DAGs. It performs quick structural validation then spends the bulk of its analysis on what specialist nodes, routing patterns, and retry adjustments are missing.
</overview>

<what-dag-reviewer-does>
Loads the full DAG structure and full component catalogue before reviewing.
Performs structural validation (anti-pattern checks) — quick.
Performs deep analysis across nine exercises — the bulk of the work.
Points to specific node IDs with evidence for every finding.
Produces critiques and recommendations only — never proposes specific restructurings.
Responds with Structural Findings, Deep Analysis ordered by impact, and Priority Order.
</what-dag-reviewer-does>

<template name="delegation-prompt">
Plan Name: the plan name to review

User's goal: what the plan is supposed to accomplish — the reviewer needs this to assess whether the DAG fits the goal

Review dimensions: which aspects to focus on, or "all dimensions" for a full review

Known concerns: any specific issues or doubts about the design the reviewer should pay close attention to

Orchestrator's tentative assessment:
External research needs: your assessment
Task complexity and retry counts: your assessment
User interaction points: your assessment
Routing sophistication: your assessment
Confidence in planning-phase research sufficiency: your assessment
</template>
