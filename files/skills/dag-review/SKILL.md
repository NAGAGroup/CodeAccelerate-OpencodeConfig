---
name: dag-review
description: Teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# Delegating to @dag-reviewer

Load this skill before writing a dispatch prompt to understand what @dag-reviewer needs to produce a thorough critique.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-reviewer", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must specify the plan name to review, state the user's goal, list the review dimensions to evaluate, include instructions to retrieve previous findings from Qdrant using qdrant_qdrant-find before starting, and store findings and critique when done.

## What @dag-reviewer Does

@dag-reviewer evaluates execution DAGs against design criteria and produces structured critiques. It reads the DAG structure, understands the intended goal and scope, and assesses the design against multiple dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, and efficiency. When it needs to spot-check codebase assumptions, it investigates directly—it does not delegate to scouts. @dag-reviewer reviews and critiques DAGs thoroughly but does not revise them—revisions are separate work.

## Rules for Good Dispatch Prompts

State the plan_name explicitly so the reviewer knows which DAG to evaluate. Provide the user's goal so the reviewer can assess whether the DAG fits the intention and scope. Describe the review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, and efficiency. When working within a plan session, include the plan name (Qdrant collection name) and instruct @dag-reviewer to use qdrant_qdrant-find to retrieve prior findings before starting and store review findings when done. The prompt must be self-contained.

## Skill-Loading Instructions for @dag-reviewer

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before inspecting or validating the DAG:** "Load the dag-tools skill for reading, inspecting, and validating DAG structures."
- **Before retrieving or storing findings:** "Load the qdrant-notes skill for retrieving prior design context and storing review findings to the plan session collection."
- **Before reasoning through review criteria:** "Load the sequential-thinking skill for step-by-step reasoning through review dimensions and identifying gaps."

## Reference Material Instructions for @dag-reviewer

After loading skills and before starting the review, instruct @dag-reviewer to retrieve reference materials:

- **Component catalogue:** "Call get_planning_components_catalogue to understand available component types and their intended purposes."
- **Design guide:** "Call get_dag_design_guide to reference DAG design principles and patterns for evaluating the design."
