**Plan Name:** {{PLAN_NAME}}
**Required Skills:** dag-reviewer
**Required Tools:** task
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: DAG Review

## Goal
Evaluate the completed execution DAG against design criteria through independent review.

## Instructions

1. Use the `dag-reviewer` skill to compose a dispatch prompt — think through what context the reviewer needs and which dimensions to evaluate
2. Dispatch dag-reviewer using the `task` tool with plan name `{{PLAN_NAME}}`, the user's goal, and the review scope
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Have I provided the user's goal so the reviewer can assess whether the DAG fits it?
- Have I specified which review dimensions matter most for this plan?
- Is the prompt self-contained — the reviewer has no memory of the designer's reasoning?
