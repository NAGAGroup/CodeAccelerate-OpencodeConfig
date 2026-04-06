---
name: dag-review
description: Teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# Delegating to @dag-reviewer

This skill teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria. Load it before writing a dispatch prompt to understand what @dag-reviewer needs to produce a thorough critique.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-reviewer", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt must specify the plan name to review, state the user's goal, list the review dimensions to evaluate, include instructions to retrieve previous findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, and store findings and critique when done.

## What @dag-reviewer Does

@dag-reviewer evaluates execution DAGs against design criteria and produces structured critiques. It reads the DAG structure, understands the intended goal and scope, and assesses the design against multiple dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, and efficiency. When it needs to spot-check codebase assumptions, it investigates directly using its search and file reading tools — it does not delegate to scouts. @dag-reviewer reviews and critiques DAGs thoroughly but does not revise them — revisions are separate work.

## Rules for Good Dispatch Prompts

State the plan_name explicitly so the reviewer knows which DAG to evaluate. Provide the user's goal so the reviewer can assess whether the DAG fits the intention and scope. Describe the review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, and efficiency. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. The prompt must be self-contained.

## Examples

**Good:** "Review DAG for plan: logging-auth-module. Goal: add logging to authentication module only. Review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, efficiency. Before starting, retrieve previous findings from Qdrant collection 'logging-auth-module' using qdrant_qdrant-find. Store findings and critique when done."

**Bad — no plan_name:** "Review the DAG." The reviewer needs the plan name to identify which DAG to evaluate.

**Bad — asks for revision:** "Review the DAG and fix any problems." Reviewer critiques only. Revision is separate work with its own dispatch.

**Bad — missing goal context:** "Review the DAG for plan: logging-auth-module." The reviewer needs the user's goal to assess whether the DAG is appropriate and complete.

**Bad — asks for implementation:** "Review the DAG and tell me what files to edit." Review evaluates design only.

## When to Use @dag-reviewer

Dispatch @dag-reviewer after a DAG has been designed, before execution begins. Use it for quality assurance on DAG structure to catch structural problems, missing work, verification gaps, or scope violations. Do not use it for implementation, investigation, or DAG redesign.
