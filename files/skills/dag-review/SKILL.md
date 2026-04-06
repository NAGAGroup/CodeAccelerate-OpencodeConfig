---
name: dag-review
description: Teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria and produce structured critiques.
---

# Delegating to @dag-reviewer

This skill teaches how to dispatch @dag-reviewer to review execution DAGs against design criteria. Load it before writing a dispatch prompt to understand what @dag-reviewer needs to produce a thorough critique.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-reviewer", a short description (3-5 words) for logging purposes, and a complete goal-based prompt. The prompt should specify the plan name to review, state the user's goal, instruct the reviewer to call get_dag_design_guide and get_planning_components_catalogue for reference, list the review dimensions to evaluate (completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, efficiency), include instructions to retrieve previous review findings from the appropriate Qdrant collection using qdrant_qdrant-find before starting, and store findings and critique when done.

## Tools Available to @dag-reviewer

@dag-reviewer uses these tools to evaluate DAGs:

- `show_dag`: Display the full DAG structure
- `show_compact_dag`: Display a compact overview of the DAG
- `validate_dag`: Check DAG structure for errors and enforceability
- `get_planning_components_catalogue`: Reference available component node types
- `get_dag_design_guide`: Reference design principles and patterns
- `present_compact_dag_to_user`: Show the DAG to the user for review

## What @dag-reviewer Does

@dag-reviewer evaluates execution DAGs against design criteria and produces structured critiques. It reads the DAG structure and design rationale, understands the intended goal and scope, and assesses the design against multiple dimensions: completeness, dependency ordering, component fit, verification coverage, scope discipline, failure handling, and efficiency. It can delegate to @context-scout for spot-checking specific areas to verify DAG assumptions about the codebase. @dag-reviewer reviews and critiques DAGs thoroughly but does not revise them — revisions are separate work.

## Rules for Good Dispatch Prompts

State the plan_name explicitly so the reviewer knows which DAG to evaluate. Provide the user's goal so the reviewer can assess whether the DAG fits the intention and scope. Tell the reviewer to call get_dag_design_guide and get_planning_components_catalogue before reviewing — these provide reference material about design principles and component types. Describe the review dimensions to evaluate: completeness (does the DAG cover all work needed), dependency order (are nodes in logical sequence), component fit (does each node use the right type for its purpose), verification coverage (does every work node have verification), scope discipline (does it stay within boundaries), failure handling (are recovery paths appropriate), and efficiency (is it as lean as possible). When working within a plan session, include the plan name (the Qdrant collection name) in the dispatch prompt. Instruct @dag-reviewer to use qdrant_qdrant-find to retrieve accumulated session knowledge from that collection before starting, and to store findings and critique to the same collection when done. The prompt must be self-contained.

## Examples

**Good:** "Review DAG for plan: logging-auth-module. Goal: add logging to authentication. Call get_dag_design_guide and get_planning_components_catalogue first. Review dimensions: completeness, dependency order, component fit, verification coverage, scope discipline, failure handling, efficiency. Before starting, retrieve previous findings from Qdrant collection 'dag-reviews' using qdrant_qdrant-find. Store your findings when done."

**Bad — no plan_name:** "Review the DAG at some path." The reviewer needs the plan name to identify which DAG to evaluate.

**Bad — asks for revision:** "Review the DAG and fix any problems." Reviewer critiques only. Revision is separate work with its own dispatch.

**Bad — missing goal context:** "Review the DAG." The reviewer needs the user's goal to assess whether the DAG is appropriate and complete.

**Bad — asks for implementation:** "Review the DAG and tell me what files to edit." Review evaluates design, not prescribes implementation. Implementation happens through component node execution.

## Review Dimensions Explained

Completeness assesses whether the DAG covers all work needed to accomplish the goal and whether any major work items are missing. Dependency order evaluates whether nodes execute in logical sequence and whether any dependencies are backwards or skipped. Component fit reviews whether each node uses the right component type for its intended purpose — investigation nodes vs. work nodes vs. verification nodes. Verification coverage checks whether every work-producing node has a corresponding verification check and whether verification is comprehensive. Scope discipline examines whether the DAG respects stated scope boundaries and does not venture into out-of-scope work. Failure handling assesses whether error conditions and edge cases have appropriate recovery or handling paths. Efficiency evaluates whether the DAG is as lean as possible without skipping necessary steps — no redundant work, no excessive complexity.

## When to Use @dag-reviewer

Dispatch @dag-reviewer after the planning phase completes and a DAG has been designed. The reviewer examines the design before execution begins, catching structural problems, missing work, verification gaps, or scope violations. Use @dag-reviewer for quality assurance on DAG structure before handing off to execution. Do not use it for implementation (component nodes execute the plan), for investigation (scouts gather information), or for DAG redesign (that is separate work with a new design dispatch).
