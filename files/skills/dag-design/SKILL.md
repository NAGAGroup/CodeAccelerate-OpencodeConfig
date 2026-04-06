---
name: dag-design
description: Teaches how to dispatch @dag-designer to build execution DAGs from the component library.
---

# Delegating to @dag-designer

This skill teaches how to dispatch @dag-designer to build execution DAGs from the component library. Load it before writing a dispatch prompt to understand what @dag-designer needs to create a complete plan.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-designer", a short description (3-5 words) for logging purposes, and a complete goal-based prompt that includes the plan name, accumulated planning findings, scope boundaries, and what the DAG should accomplish. The prompt should instruct the designer to retrieve previous design context from Qdrant, use the available DAG tools (init_dag, add_node, validate_dag, show_compact_dag), reference the component catalogue and design guide, store design decisions to Qdrant when done, and provide the complete DAG structure with rationale for each node choice.

## Tools Available to @dag-designer

@dag-designer uses these tools to design execution DAGs:

- `init_dag`: Initialize a new DAG with a plan_name
- `add_node`: Add a component node to the DAG
- `delete_node`: Remove a node from the DAG
- `modify_node`: Update node parameters
- `validate_dag`: Check DAG structure for errors and enforceability
- `show_dag`: Display the full DAG structure
- `show_compact_dag`: Display a compact overview of the DAG
- `get_planning_components_catalogue`: Reference available component node types
- `get_dag_design_guide`: Reference design principles and patterns
- `choose_plan_name`: Select or confirm the plan name (used in planning phase)
- `present_compact_dag_to_user`: Show the DAG to the user for review

## What @dag-designer Does

@dag-designer designs execution DAGs by selecting appropriate component nodes from the library and arranging them to accomplish a goal. It references the component catalogue to understand each node type's purpose and enforcement requirements. It validates the DAG structure, checks dependencies, and ensures ordering is correct. It produces a complete, enforceable plan that can be executed by the framework. @dag-designer works from accumulated planning findings and understands component semantics, ordering constraints, and how to structure branching for conditional work paths. It focuses on DAG design and structure only, not implementation — code changes and execution are handled separately.

## Rules for Good Dispatch Prompts

State the user's goal and scope boundaries clearly — what should the DAG accomplish and what is explicitly out of scope. Provide all accumulated planning findings so the designer understands what was discovered and what constraints were identified. Include the plan_name explicitly — this is the identifier used in all add_node calls and must be consistent throughout. Tell the designer to call get_planning_components_catalogue and get_dag_design_guide before designing — these provide reference material about available node types and design principles. When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @dag-designer to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store design decisions and rationale to the same collection when done. The prompt must be self-contained — the designer will not ask questions. For complex goals, you can suggest constraints on DAG structure (linearity vs. branching, verification coverage, whether additional investigation is needed).

## Examples

**Good:** "Goal: design a DAG for adding logging to authentication. Scope: auth module only. Plan name: logging-auth-module. Call init_dag with plan_name parameter. You have planning findings about the auth system. Call get_planning_components_catalogue and get_dag_design_guide first. Before starting, retrieve design context from Qdrant collection 'dag-designs' using qdrant_qdrant-find. Validate and show the final DAG. Store design decisions to Qdrant when done."

**Bad — no plan_name:** "Design a DAG for the goal." The plan_name is required for add_node calls. Must be included in the dispatch prompt.

**Bad — no planning context:** "Design a DAG for adding logging to authentication." The designer needs accumulated findings from planning, not just the goal statement.

**Bad — prescribes implementation instead of design:** "Create a DAG that reads files in src/auth, updates logging calls in validation.ts, and then runs tests." That is implementation detail. The designer chooses the node types that accomplish the goal.

**Bad — missing planning findings:** "Design a DAG based on the user's goal." Needs accumulated planning findings from prior investigation steps to make informed design choices.

**Bad — vague scope:** "Design a DAG to improve the system." Too vague. Needs specific user goal and scope boundaries.

**Bad — insufficient context for design:** "Design a DAG for adding features." Missing the user's goal, investigation findings, and scope boundaries.

## When to Use @dag-designer

Dispatch @dag-designer during the planning phase to translate discovered context and user intent into a structured execution DAG. The designer works best when you have accumulated investigation findings, clear scope boundaries, and a well-defined goal. Provide planning findings and constraints that will guide good design choices. Do not use it for implementation (component nodes execute the plan), for investigation (scouts gather information), or for plan review (use @dag-reviewer).
