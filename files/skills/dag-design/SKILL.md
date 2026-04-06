---
name: dag-design
description: Teaches how to dispatch @dag-designer to build execution DAGs from the component library.
---

# Delegating to @dag-designer

Load this skill before writing a dispatch prompt to understand what @dag-designer needs to create a complete plan.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-designer", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must include the plan name, accumulated planning findings, scope boundaries, and what the DAG should accomplish. Instruct the designer to retrieve previous design context from Qdrant before starting, use the component catalogue and design guide for reference, store design decisions to Qdrant when done, and provide the complete DAG structure with rationale for each node choice.

## What @dag-designer Does

@dag-designer designs execution DAGs by selecting appropriate component nodes from the library and arranging them to accomplish a goal. It validates structure, checks dependencies, and ensures ordering is correct. When it needs codebase context to inform design decisions, it investigates directly—it does not delegate to scouts. It focuses on DAG design only, not implementation. Code changes and execution are handled by component nodes.

## Rules for Good Dispatch Prompts

Include the plan_name explicitly—it is required for all add_node calls and must be consistent throughout. Provide all accumulated planning findings so the designer understands what was discovered and what constraints were identified. State scope boundaries clearly—what the DAG should accomplish and what is out of scope. The prompt must be self-contained; the designer will not ask questions or return for clarification.

## Skill-Loading Instructions for @dag-designer

Include explicit skill-loading instructions near the top of the dispatch prompt:

- **Before using DAG construction tools:** "Load the dag-tools skill for working with DAG construction, validation, and inspection tools."
- **Before retrieving or storing context:** "Load the qdrant-notes skill for retrieving planning context and storing design decisions to the plan session collection."
- **Before reasoning through design decisions:** "Load the sequential-thinking skill for step-by-step reasoning through design decisions and trade-offs."
