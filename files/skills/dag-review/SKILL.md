---
name: dag-review
description: Teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# Delegating to @dag-reviewer

Load this skill before writing a dispatch prompt to understand what @dag-reviewer needs to produce a thorough critique.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-reviewer", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must specify the plan name to review, state the user's goal, and list the review dimensions to evaluate.

## What @dag-reviewer Does

@dag-reviewer evaluates execution DAGs against design criteria and produces structured critiques. It reads the DAG structure, understands the intended goal and scope, and assesses the design against multiple dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, and efficiency.

## Rules for Good Dispatch Prompts

State the plan_name explicitly so the reviewer knows which DAG to evaluate. Provide the user's goal so the reviewer can assess whether the DAG fits the intention and scope. Describe the review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, and efficiency. The prompt must be self-contained.

## Loading the DAG to be Reviewed

Instruct the reviewer to immediately call the `show_compact_dag` and `show_dag` tools before doing any review work.
