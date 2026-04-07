---
name: dag-review
description: Teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# Delegating to @dag-reviewer

Dispatch @dag-reviewer to evaluate execution DAGs against design criteria.

## How to Dispatch

Call task tool with: `subagent_type="dag-reviewer"`, description (3-5 words), goal-based prompt with plan name, user's goal, and review dimensions.

## What @dag-reviewer Does

- Evaluates DAGs against design criteria
- Assesses completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, efficiency
- Produces structured critiques

## Rules
- State plan_name explicitly
- Provide user's goal so reviewer can assess fit
- List review dimensions to evaluate
- Prompt must be self-contained
- Instruct reviewer to call `show_compact_dag` and `show_dag` before starting review
