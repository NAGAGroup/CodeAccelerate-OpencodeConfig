---
name: dag-design
description: Teaches how to dispatch @dag-designer to build execution DAGs from the component library.
---

# Delegating to @dag-designer

Load this skill before writing a dispatch prompt to understand what @dag-designer needs to create a complete plan.

## How to Dispatch the Agent

Call the task tool with subagent_type set to "dag-designer", a short description (3-5 words) for logging, and a complete goal-based prompt. The prompt must include the plan name, accumulated planning findings, scope boundaries, and what the DAG should accomplish.

## What @dag-designer Does

@dag-designer designs execution DAGs by selecting appropriate component nodes from the library and arranging them to accomplish the goal. It validates structure, checks dependencies, and ensures ordering is correct.

## Rules for Good Dispatch Prompts

Include the plan_name explicitly—it is required for all add_node calls and must be consistent throughout. Provide all accumulated planning findings so the designer understands what was discovered and what constraints were identified. State scope boundaries clearly—what the DAG should accomplish and what is out of scope. The prompt must be self-contained; the designer will not ask questions or return for clarification.

**Describe problems, not tasks.** The dispatch prompt must describe what kinds of work are needed and in what order — not specific files to edit, commands to run, or implementation steps to follow. The executor discovers specifics from planning notes at runtime. The planner's job is to shape the structure: what phases exist, what could fail and needs a retry path, what decisions require a gate. Wrong: "Edit auth.js, add the JWT library, update middleware." Right: "The auth system needs to be changed. We need to understand its current state before touching it, implement the change, verify it, and have a retry path if verification fails."

**Branches are exclusive paths, not parallel work.** The DAG is sequential — one node runs at a time. Branches represent mutually exclusive execution paths chosen at a decision gate. If two things both need to happen, they are sequential nodes, not branches. Make this clear in the dispatch prompt so the designer doesn't create parallel-looking structures.
