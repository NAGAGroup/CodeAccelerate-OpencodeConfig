---
name: dag-design
description: Teaches how to dispatch @dag-designer to build execution DAGs from the component library.
---

# Delegating to @dag-designer

This skill teaches how to dispatch @dag-designer to build execution DAGs from the component library. Load it before writing a dispatch prompt to understand what @dag-designer needs to create a complete plan.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-designer", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt must include the plan name, accumulated planning findings, scope boundaries, and what the DAG should accomplish. Instruct the designer to retrieve previous design context from Qdrant before starting, use the component catalogue and design guide for reference, store design decisions to Qdrant when done, and provide the complete DAG structure with rationale for each node choice.

## What @dag-designer Does

@dag-designer designs execution DAGs by selecting appropriate component nodes from the library and arranging them to accomplish a goal. It validates structure, checks dependencies, and ensures ordering is correct. When it needs codebase context to inform design decisions, it investigates directly using its search and file reading tools — it does not delegate to scouts. It focuses on DAG design only, not implementation — code changes and execution are handled by component nodes.

## Rules for Good Dispatch Prompts

Include the plan_name explicitly — it is required for all add_node calls and must be consistent throughout. Provide all accumulated planning findings so the designer understands what was discovered and what constraints were identified. State scope boundaries clearly — what the DAG should accomplish and what is out of scope. The prompt must be self-contained; the designer will not ask questions or return for clarification.

## Examples

**Good:** "Goal: design a DAG for adding logging to authentication. Scope: auth module only, no changes outside it. Plan name: logging-auth-module. Before starting, retrieve design context from Qdrant collection 'logging-auth-module' using qdrant_qdrant-find. Use get_planning_components_catalogue and get_dag_design_guide before designing. Planning findings: [summarized findings]. Store design decisions to Qdrant when done."

**Bad — no plan_name:** "Design a DAG for the goal." The plan_name is required for add_node calls. Must be included in the dispatch prompt.

**Bad — no planning context:** "Design a DAG for adding logging to authentication." The designer needs accumulated investigation findings, not just the goal statement.

**Bad — prescribes implementation:** "Create a DAG that reads files in src/auth and updates logging calls in validation.ts." That is implementation detail. The designer chooses node types that accomplish the goal.

**Bad — vague scope:** "Design a DAG to improve the system." Needs a specific user goal and scope boundaries.

## When to Use @dag-designer

Dispatch @dag-designer during the planning phase to translate discovered context and user intent into a structured execution DAG. Do not use it for implementation, investigation, or plan review.
