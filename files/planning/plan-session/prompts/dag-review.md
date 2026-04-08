**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviewer
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: DAG Review

## Goal
Evaluate the first-pass execution DAG through structural validation and deep analysis, providing the reviewer with your tentative assessment answers.

## Instructions

1. Use the `dag-reviewer` skill to compose a dispatch prompt — include your tentative assessment answers from the previous step alongside the user's goal and review scope
2. Dispatch dag-reviewer using the `task` tool with plan name `{{PLAN_NAME}}`, the user's goal, your tentative assessment answers, and the review scope
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I provided the user's goal so the reviewer can assess whether the DAG fits it?
- Have I included my tentative assessment answers — the reviewer uses these as starting points for deep analysis?
- Have I specified which review dimensions matter most for this plan, or requested a full review?
- Is the prompt self-contained — the reviewer has no memory of the designer's reasoning, but can retrieve session notes?
